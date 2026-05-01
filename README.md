# qlist

B 站近期视频「?」弹幕数量排行榜网站，使用 PostgreSQL 做增量库，Redis 做接口和分析缓存。

## 功能

- 按二级分区 `rid` 调用 `https://api.bilibili.com/x/web-interface/newlist` 获取最新投稿。
- 只把最近 N 天且播放量达到阈值的视频加入弹幕统计候选，但所有近期视频都会 upsert 到 PostgreSQL。
- 通过 `x/web-interface/view` 获取分 P 的 `cid`，再读取 `https://comment.bilibili.com/{cid}.xml` 普通弹幕。
- 统计包含半角 `?` 或全角 `？` 的弹幕条数，写入 PostgreSQL。
- 使用 Redis 缓存排行榜、实时统计和单视频分析结果，避免重复计算。
- 提供静态排行榜页面和 JSON API。

## 快速开始

要求 Node.js 18+、PostgreSQL、Redis。

默认连接：

- PostgreSQL：`postgres://qlist:qlist@127.0.0.1:5432/qlist`
- Redis：`redis://127.0.0.1:6379`

项目启动时会自动读取根目录 `.env`，例如：

```bash
REDIS_URL=rediss://default:***@example.upstash.io:6379
```

本地启动数据库：

```bash
docker compose up -d postgres redis
```

```bash
npm install
npm run build
npm run crawl
npm start
```

打开 `http://localhost:3000`。

前端现在使用 Vite：

```bash
npm run dev
```

Vite 开发服务器默认运行在 `5173`，并把 `/api` 代理到 `http://127.0.0.1:5176`。生产部署时运行 `npm run build` 生成 `dist/`，后端 `npm start` 会优先托管 `dist/`。

指定 5176 端口：

```bash
PORT=5176 npm start
```

## 增量库说明

PostgreSQL 默认连接来自 `POSTGRES_URL` 或 `DATABASE_URL`。
Redis 默认连接来自 `REDIS_URL`。

主要表：

| 表 | 说明 |
| --- | --- |
| `videos` | 视频基础信息，按 `bvid` 去重增量更新 |
| `danmaku_stats` | 每个视频的问号弹幕统计缓存 |
| `crawl_runs` | 每次采集运行记录 |

采集逻辑：

1. 扫 `newlist` 时，把最近 N 天内发现的视频写入 `videos`。
2. 播放量达到 `VIEW_THRESHOLD` 的视频进入弹幕统计候选。
3. 如果 `danmaku_stats.scanned_at` 仍在缓存 TTL 内，直接跳过弹幕请求。
4. 超过 TTL 或未统计过的视频，会重新拉 `view` 和弹幕 XML。
5. 排行榜从 PostgreSQL 查询，并通过 Redis 短期缓存接口结果，不再依赖 JSON 文件。

## 配置

通过环境变量调整采集范围：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RECENT_DAYS` | `7` | 统计最近多少天投稿 |
| `VIEW_THRESHOLD` | `100000` | 候选视频最低播放量 |
| `EARLY_WINDOW_HOURS` | `0` | 新视频观察窗口，窗口内使用低播放阈值 |
| `EARLY_VIEW_THRESHOLD` | `0` | 新视频观察窗口内的候选播放阈值 |
| `RIDS` | 内置一组二级分区 ID | 逗号分隔的分区 ID |
| `MAX_PAGES_PER_RID` | `200` | 每个分区最多翻页数 |
| `PAGE_SIZE` | `50` | 每页数量 |
| `REQUEST_DELAY_MS` | `700` | 请求间隔，避免过快触发风控 |
| `FETCH_TIMEOUT_MS` | `15000` | 单次请求超时时间 |
| `FETCH_RETRIES` | `2` | 单次请求失败后的重试次数 |
| `DANMAKU_CACHE_TTL_HOURS` | `6` | 弹幕统计缓存时长 |
| `ANALYSIS_CACHE_TTL_HOURS` | `6` | 单视频分析缓存时长 |
| `COMMENT_PAGES` | `5` | 单视频评论分析最多读取页数 |
| `COMMENT_PAGE_SIZE` | `20` | 单视频评论分析每页评论数 |
| `TIMELINE_BUCKET_SECONDS` | `30` | 疑问时间轴聚合桶大小 |
| `RID_CONCURRENCY` | `4` | 同时扫描的二级分区数 |
| `VIDEO_CONCURRENCY` | `8` | 同时统计弹幕的视频数 |
| `PAGE_CONCURRENCY` | `3` | 单个视频同时拉取的分 P 弹幕数 |
| `RANKING_LIMIT` | `100` | API 默认返回榜单数量 |
| `POSTGRES_URL` | `postgres://qlist:qlist@127.0.0.1:5432/qlist` | PostgreSQL 连接串 |
| `DATABASE_URL` | 空 | `POSTGRES_URL` 未设置时使用 |
| `REDIS_URL` | `redis://127.0.0.1:6379` | Redis 连接串 |
| `RANKING_CACHE_SECONDS` | `60` | Redis 排行榜缓存秒数 |
| `STATS_CACHE_SECONDS` | `15` | Redis 统计接口缓存秒数 |
| `PORT` | `3000` | 网站端口 |

示例：

```bash
RECENT_DAYS=3 VIEW_THRESHOLD=50000 REQUEST_DELAY_MS=1200 npm run crawl
```

更快采集：

```bash
npm run crawl:fast
```

更激进采集，可能更容易触发 B 站风控：

```bash
npm run crawl:turbo
```

## 定时更新

项目提供了 cron 脚本，使用全局锁避免多个采集任务重叠：

```bash
sudo npm run cron:install
```

默认计划：

- 每 15 分钟：`crawl:early`，快速更新刚发布视频。
- 每小时第 5 分钟：`crawl:fast`，更新近期热门视频。
- 每天 03:30：`crawl:backfill`，回扫最近 7 天高播放视频。
- 每天 04:20：`backfill:tags`，补齐缺失的视频标签。

日志位置：`logs/cron.log`。
锁文件：`logs/crawl.lock`。

分层采集示例：发布 12 小时内所有视频都统计弹幕，超过 12 小时后只统计 1 万播放以上的视频。

```bash
RECENT_DAYS=3 VIEW_THRESHOLD=10000 EARLY_WINDOW_HOURS=12 EARLY_VIEW_THRESHOLD=0 npm run crawl
```

内置了 3 个分层采集预设：

| 命令 | 用途 |
| --- | --- |
| `npm run crawl:early` | 高频扫最近 1 天，12 小时内低阈值观察 |
| `npm run crawl:hot` | 扫最近 3 天，适合每小时补热点 |
| `npm run crawl:backfill` | 扫最近 7 天高播放视频，适合每天补漏 |
| `npm run crawl:month` | 扫最近 30 天高播放视频，适合月榜补漏 |

如果命令长时间停在某个 `rid`，通常是服务器访问 B 站接口慢、被风控或网络不可达。可以先缩小范围测试：

```bash
RIDS=24 MAX_PAGES_PER_RID=1 FETCH_TIMEOUT_MS=8000 FETCH_RETRIES=0 npm run crawl
```

## API

- `GET /api/ranking`：读取当前排行榜 JSON。
- `GET /api/ranking?limit=200`：指定返回数量。
- `GET /api/ranking?range=day`：日榜，最近 1 天。
- `GET /api/ranking?range=week`：周榜，最近 7 天，默认范围。
- `GET /api/ranking?range=month`：月榜，最近 30 天。
- `GET /api/ranking?range=all`：总榜，所有已采集视频。
- `GET /api/ranking?sort=score`：综合疑惑榜，默认排序。
- `GET /api/ranking?sort=count`：按问号弹幕总数排序。
- `GET /api/ranking?sort=rate`：按问号弹幕占比排序。
- `GET /api/video/:bvid/analysis`：分析单个视频的疑问时间轴和评论。
- `GET /api/video/:bvid/analysis?force=1`：跳过缓存，强制重新分析。
- `GET /api/status`：查看是否正在采集。
- `POST /api/crawl`：触发一次采集并返回最新结果。
- `GET /api/stats/summary?range=day`：按范围汇总已统计视频、问号弹幕总量和疑问率。
- `GET /api/stats/realtime`：准实时统计，返回最近 24 小时发布视频的累计量和相邻快照增量。
- 迷惑指数计算器已改为输入 BV 号，前端调用 `GET /api/video/:bvid/analysis` 读取真实弹幕和评论分析结果。
- `GET /api/tools/estimate?text=...`：保留的标题估算工具接口，不再作为新版计算器主流程。

实时统计口径：

- `totalQuestionCount`：最近 24 小时发布、且已采集统计的视频中的当前累计问号弹幕。
- `lastDeltaQuestionCount`：当前累计量与上一个日榜快照之间的差值，近似表示最近一次采集新增问号弹幕。
- 每次 `npm run crawl` 结束会自动写入一个日榜快照。
- 这是准实时估算，不是 B 站官方全站实时弹幕流。

单视频分析返回：

- `danmaku.timeline`：按 `TIMELINE_BUCKET_SECONDS` 聚合的问题弹幕高峰片段。
- `danmaku.samples`：问题弹幕样本。
- `comments.topWords`：疑问评论中的高频词。
- `comments.samples`：疑问评论样本。

排行榜排序：

- `range`：支持 `day`、`week`、`month`、`all`。
- `day` / `week` / `month` 按弹幕发送时间统计最近 1 / 7 / 30 天的问号弹幕，不再按视频发布时间过滤。
- `all` 使用视频全量弹幕统计，总榜只包含 PostgreSQL 中已经采集过的视频。
- `count`：`questionCount` 降序，同分按播放量降序。
- `rate`：`questionCount / danmakuCount` 降序，同分按问号总量和播放量降序。
- `score`：默认综合分，兼顾问号总量、播放量和疑问率。

综合分公式：

```text
questionRate = questionCount / danmakuCount
effectiveRate = questionCount / (danmakuCount + 50)
rateBoost = 1 + 2 * (1 - exp(-5 * effectiveRate))
confusionScore = sqrt(questionCount) * log10(view + 10) * rateBoost
```

## 加速建议

4C8G 机器实测 CPU 不是瓶颈，弹幕统计主要受网络和 B 站风控影响。稳妥生产参数：

```bash
RECENT_DAYS=3 \
VIEW_THRESHOLD=200000 \
MAX_PAGES_PER_RID=100 \
REQUEST_DELAY_MS=300 \
VIDEO_CONCURRENCY=5 \
PAGE_CONCURRENCY=2 \
FETCH_TIMEOUT_MS=8000 \
FETCH_RETRIES=1 \
npm run crawl
```

如果连续运行没有 `fetch failed`、`HTTP 412` 或其他风控错误，可以逐步提高：

```bash
REQUEST_DELAY_MS=100 VIDEO_CONCURRENCY=20 PAGE_CONCURRENCY=3 npm run crawl
```

短压测通过的激进参数如下，但不建议直接长期定时跑：

```bash
REQUEST_DELAY_MS=50 VIDEO_CONCURRENCY=40 PAGE_CONCURRENCY=3 npm run crawl
```

长期运行建议用 cron 做分层增量采集：

```cron
*/10 * * * * cd /root/qlist && PATH=/root/qlist/.node/bin:$PATH REQUEST_DELAY_MS=100 VIDEO_CONCURRENCY=20 PAGE_CONCURRENCY=3 npm run crawl:early >> data/crawl-early.log 2>&1
0 * * * * cd /root/qlist && PATH=/root/qlist/.node/bin:$PATH REQUEST_DELAY_MS=100 VIDEO_CONCURRENCY=20 PAGE_CONCURRENCY=3 npm run crawl:hot >> data/crawl-hot.log 2>&1
20 3 * * * cd /root/qlist && PATH=/root/qlist/.node/bin:$PATH REQUEST_DELAY_MS=300 VIDEO_CONCURRENCY=5 PAGE_CONCURRENCY=2 npm run crawl:backfill >> data/crawl-backfill.log 2>&1
40 4 * * * cd /root/qlist && PATH=/root/qlist/.node/bin:$PATH REQUEST_DELAY_MS=300 VIDEO_CONCURRENCY=5 PAGE_CONCURRENCY=2 npm run crawl:month >> data/crawl-month.log 2>&1
```

## 重要限制

- 普通接口和 XML 弹幕不能保证严格全量，历史弹幕、风控、接口变更都会影响结果。
- 播放量会持续增长，建议定时重扫最近 N 天，而不是只扫一次。
- `RIDS` 应尽量使用二级分区 ID；只扫一级分区会漏数据。
- 采集时务必低频、缓存、去重，不要并发爆破。

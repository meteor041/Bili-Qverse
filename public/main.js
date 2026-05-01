const rankingElement = document.querySelector('#ranking');
const metaElement = document.querySelector('#meta');
const refreshButton = document.querySelector('#refreshButton');
const sortButtons = [...document.querySelectorAll('[data-sort]')];
const rangeButtons = [...document.querySelectorAll('[data-range]')];

const initialParams = new URLSearchParams(location.search);
let currentSort = initialParams.get('sort') || 'score';
let currentRange = initialParams.get('range') || 'week';

const formatter = new Intl.NumberFormat('zh-CN');
const scoreFormatter = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 });
const percentFormatter = new Intl.NumberFormat('zh-CN', { style: 'percent', maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' });
const sortLabels = {
  score: '综合疑惑榜',
  count: '问号总量榜',
  rate: '疑问浓度榜'
};
const rangeLabels = {
  day: '日榜',
  week: '周榜',
  month: '月榜',
  all: '总榜'
};

function formatDate(value) {
  if (!value) return '暂无';
  return dateFormatter.format(new Date(value));
}

function render(payload) {
  const items = payload.items || [];
  const sort = payload.config?.sort || currentSort;
  const range = payload.config?.range || currentRange;
  currentSort = sort;
  currentRange = range;
  updateTabs();

  const rangeText = payload.config?.rangeDays ? `近 ${payload.config.rangeDays} 天` : '所有已采集视频';
  metaElement.textContent = `更新时间：${formatDate(payload.generatedAt)} · ${rangeLabels[range] || range} · ${sortLabels[sort] || sort} · ${rangeText} · 播放阈值 ${formatter.format(payload.config?.viewThreshold || 0)}`;

  if (items.length === 0) {
    rankingElement.innerHTML = '<div class="empty">暂无数据。请先运行 npm run crawl，或点击“刷新采集”。</div>';
    return;
  }

  rankingElement.innerHTML = items.map((item, index) => `
    <article class="card">
      <div class="rank">${index + 1}</div>
      <div>
        <h2 class="title"><a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></h2>
        <div class="detail">
          <span>${escapeHtml(item.author || '未知 UP')}</span>
          <span>${item.bvid}</span>
          <span>播放 ${formatter.format(item.view || 0)}</span>
          <span>弹幕 ${formatter.format(item.danmakuCount || 0)}</span>
        </div>
        <div class="metrics">
          <span>问号 ${formatter.format(item.questionCount || 0)}</span>
          <span>疑问率 ${percentFormatter.format(item.questionRate || 0)}</span>
          <span>综合分 ${scoreFormatter.format(item.confusionScore || 0)}</span>
        </div>
      </div>
      <div class="score">
        <strong>${formatPrimaryScore(item, sort)}</strong>
        <span>${formatPrimaryLabel(sort)}</span>
      </div>
    </article>
  `).join('');
}

function formatPrimaryScore(item, sort) {
  if (sort === 'rate') return percentFormatter.format(item.questionRate || 0);
  if (sort === 'score') return scoreFormatter.format(item.confusionScore || 0);
  return formatter.format(item.questionCount || 0);
}

function formatPrimaryLabel(sort) {
  if (sort === 'rate') return '疑问率';
  if (sort === 'score') return '综合分';
  return '问号弹幕';
}

function updateTabs() {
  for (const button of sortButtons) {
    button.classList.toggle('active', button.dataset.sort === currentSort);
  }
  for (const button of rangeButtons) {
    button.classList.toggle('active', button.dataset.range === currentRange);
  }
}

function updateUrl() {
  const params = new URLSearchParams({ range: currentRange, sort: currentSort });
  history.replaceState(null, '', `?${params.toString()}`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

async function loadRanking() {
  const params = new URLSearchParams({ range: currentRange, sort: currentSort });
  const response = await fetch(`/api/ranking?${params.toString()}`);
  render(await response.json());
}

function attachTabHandlers(buttons, key) {
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      if (key === 'sort') currentSort = button.dataset.sort;
      else currentRange = button.dataset.range;
      updateUrl();
      loadRanking().catch(error => {
        metaElement.textContent = `加载失败：${error.message}`;
      });
    });
  });
}

attachTabHandlers(sortButtons, 'sort');
attachTabHandlers(rangeButtons, 'range');

refreshButton.addEventListener('click', async () => {
  refreshButton.disabled = true;
  refreshButton.textContent = '采集中...';
  try {
    const response = await fetch('/api/crawl', { method: 'POST' });
    const payload = await response.json();
    payload.config = { ...payload.config, sort: currentSort, range: currentRange };
    render(payload);
  } catch (error) {
    metaElement.textContent = `采集失败：${error.message}`;
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = '刷新采集';
  }
});

updateTabs();
loadRanking().catch(error => {
  metaElement.textContent = `加载失败：${error.message}`;
});

import React from 'react';
import { createRoot } from 'react-dom/client';
const ReactDOM = { createRoot };

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
  }, []);
  return [values, setTweak];
}
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return React.createElement(React.Fragment, null, React.createElement("style", null, __TWEAKS_STYLE), React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, React.createElement("b", null, title), React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), React.createElement("div", {
    className: "twk-body"
  }, children)));
}
function TweakSection({
  label,
  children
}) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, React.createElement("div", {
    className: "twk-lbl"
  }, React.createElement("span", null, label), value != null && React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}
function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return React.createElement("div", {
    className: "twk-row twk-row-h"
  }, React.createElement("div", {
    className: "twk-lbl"
  }, React.createElement("span", null, label)), React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return React.createElement(TweakRow, {
    label: label
  }, React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return React.createElement(TweakRow, {
    label: label
  }, React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return React.createElement(TweakRow, {
    label: label
  }, React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return React.createElement("div", {
    className: "twk-num"
  }, React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return React.createElement("div", {
    className: "twk-row twk-row-h"
  }, React.createElement("div", {
    className: "twk-lbl"
  }, React.createElement("span", null, label)), React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
(function () {
  const {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo
  } = React;
  function allVideos() {
    return window.__Q.realVideos?.length ? window.__Q.realVideos : window.__Q.videos;
  }
  function hourlyData() {
    return window.__Q.hourly;
  }
  const PALETTES = [['#1a0533', '#5c1a8a', '#00A1D6'], ['#0d1b2a', '#1b4332', '#00A1D6'], ['#1a0a00', '#6b2d00', '#fb7299'], ['#0a0a2e', '#1a1a6e', '#00e5ff'], ['#2d0a1a', '#8a1a4a', '#ffd700'], ['#001a0d', '#003320', '#00e5ff']];
  const SORT_TO_API = {
    '综合': 'score',
    '问号': 'count',
    '浓度': 'rate'
  };
  function formatCompactNumber(value) {
    const num = Number(value || 0);
    if (num >= 100000000) return `${(num / 100000000).toFixed(num >= 1000000000 ? 1 : 2).replace(/\.0$/, '')}亿`;
    if (num >= 10000) return `${(num / 10000).toFixed(num >= 100000 ? 0 : 1).replace(/\.0$/, '')}万`;
    return num.toLocaleString('zh-CN');
  }
  function formatUploadTime(pubdate) {
    const seconds = Math.max(0, Math.floor(Date.now() / 1000) - Number(pubdate || 0));
    if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    if (seconds < 172800) return '昨天';
    return `${Math.floor(seconds / 86400)}天前`;
  }
  function formatDuration(seconds) {
    const totalSeconds = Math.max(0, Math.floor(Number(seconds || 0)));
    if (!totalSeconds) return '--:--';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const secs = totalSeconds % 60;
    const pad = value => String(value).padStart(2, '0');
    if (hours > 0) return `${hours}:${pad(minutes)}:${pad(secs)}`;
    return `${minutes}:${pad(secs)}`;
  }
  function parseVideoTags(value) {
    const rawTags = Array.isArray(value) ? value : (() => {
      try {
        const parsed = JSON.parse(value || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();
    return rawTags.map(tag => String(tag || '').trim()).filter(Boolean).slice(0, 3).map(tag => tag.startsWith('#') ? tag : `#${tag}`);
  }
  function normalizeImageUrl(value) {
    const url = String(value || '').trim();
    if (!url) return null;
    const normalized = url.startsWith('//') ? `https:${url}` : url.replace(/^http:\/\//i, 'https://');
    if (/^https:\/\/i[0-9]\.hdslb\.com\/bfs\//i.test(normalized)) return `/api/image?url=${encodeURIComponent(normalized)}`;
    return normalized;
  }
  function normalizeVideo(item, index = 0) {
    const danmakuCount = Number(item.danmakuCount || 0);
    const questionCount = Number(item.questionCount || 0);
    const questionRate = Number(item.questionRate || (danmakuCount > 0 ? questionCount / danmakuCount : 0));
    const score = Number(item.confusionScore || 0);
    const questionIndex = Math.max(1, Math.min(100, Math.round(score > 0 ? 100 * (1 - Math.exp(-score / 3000)) : questionCount)));
    const bvid = item.bvid || `mock-${index + 1}`;
    const tags = parseVideoTags(item.tags);
    return {
      id: bvid,
      bvid,
      title: item.title || '未命名视频',
      cover: normalizeImageUrl(item.pic),
      uploader: item.author || '未知 UP',
      avatar: null,
      plays: formatCompactNumber(item.view),
      playsNum: Number(item.view || 0),
      danmaku: formatCompactNumber(danmakuCount),
      comments: 0,
      questionIndex,
      questionCount,
      confusionScore: score,
      commentQuestionRate: Math.round(questionRate * 1000) / 10,
      tags,
      duration: formatDuration(item.duration),
      uploadTime: formatUploadTime(item.pubdate),
      description: `问号弹幕 ${formatCompactNumber(questionCount)} 条，疑问率 ${(questionRate * 100).toFixed(2)}%。`,
      timeline: [{
        time: 0,
        value: questionCount || 1
      }],
      peaks: [],
      comments: [],
      trend: [Math.max(1, questionIndex - 12), Math.max(1, questionIndex - 6), questionIndex],
      src: {
        d: 100,
        c: 0,
        t: 0
      },
      url: item.url || `https://www.bilibili.com/video/${bvid}`
    };
  }
  function getBilibiliVideoUrl(vid) {
    return vid?.url || (vid?.bvid ? `https://www.bilibili.com/video/${vid.bvid}` : 'https://www.bilibili.com/');
  }
  function openBilibiliVideo(vid) {
    window.open(getBilibiliVideoUrl(vid), '_blank', 'noopener,noreferrer');
  }
  function useHomeData(initialRange = 'week', initialType = '综合') {
    const [range, setRange] = useState(initialRange);
    const [type, setType] = useState(initialType);
    const [videos, setVideos] = useState(allVideos());
    const [stats, setStats] = useState(null);
    const [hotTags, setHotTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      let cancelled = false;
      async function load() {
        setLoading(true);
        setError(null);
        try {
          const params = new URLSearchParams({
            range,
            sort: SORT_TO_API[type] || 'score',
            limit: '100'
          });
          const tagParams = new URLSearchParams({
            range,
            limit: '16'
          });
          const [rankingRes, statsRes, tagsRes] = await Promise.all([fetch(`/api/ranking?${params.toString()}`), fetch('/api/stats/realtime'), fetch(`/api/tags/hot?${tagParams.toString()}`)]);
          if (!rankingRes.ok) throw new Error(`ranking HTTP ${rankingRes.status}`);
          const ranking = await rankingRes.json();
          const realtime = statsRes.ok ? await statsRes.json() : null;
          const tagPayload = tagsRes.ok ? await tagsRes.json() : null;
          if (cancelled) return;
          const mapped = (ranking.items || []).map(normalizeVideo);
          if (mapped.length > 0) window.__Q.realVideos = mapped;
          setVideos(mapped.length > 0 ? mapped : allVideos());
          setStats(realtime);
          setHotTags(Array.isArray(tagPayload?.items) ? tagPayload.items : []);
        } catch (err) {
          if (!cancelled) {
            setError(err.message);
            setVideos(allVideos());
            setHotTags([]);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
      load();
      return () => {
        cancelled = true;
      };
    }, [range, type]);
    return {
      range,
      setRange,
      type,
      setType,
      videos,
      stats,
      hotTags,
      loading,
      error
    };
  }
  function useHallData() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      let cancelled = false;
      async function load() {
        setLoading(true);
        setError(null);
        try {
          const params = new URLSearchParams({
            range: 'all',
            sort: 'score',
            limit: '8'
          });
          const res = await fetch(`/api/ranking?${params.toString()}`);
          if (!res.ok) throw new Error(`ranking HTTP ${res.status}`);
          const payload = await res.json();
          if (cancelled) return;
          setVideos((payload.items || []).map(normalizeVideo));
        } catch (err) {
          if (!cancelled) {
            setError(err.message);
            setVideos([]);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
      load();
      return () => {
        cancelled = true;
      };
    }, []);
    return {
      videos,
      loading,
      error
    };
  }
  function DanmakuEngine() {
    useEffect(() => {
      const layer = document.getElementById('danmaku-layer');
      const texts = ['？？？？？', '？？？', '这是什么操作', '看不懂', '？？？？？？？？', '怎么做到的', '？', '？？', '真的假的', '离谱', '不理解', '什么鬼', '？？？？？？', 'hhhh？？？'];
      function spawn() {
        const el = document.createElement('div');
        el.className = 'dm';
        el.textContent = texts[Math.floor(Math.random() * texts.length)];
        el.style.top = `${Math.floor(Math.random() * 18) * 5 + 2}%`;
        el.style.right = '-300px';
        const dur = 8 + Math.random() * 10;
        el.style.animationDuration = `${dur}s`;
        el.style.fontSize = `${13 + Math.random() * 12}px`;
        const cols = ['#00e5ff', '#fb7299', '#ffffff', '#00A1D6', '#ffd700'];
        const c = cols[Math.floor(Math.random() * cols.length)];
        el.style.color = c;
        el.style.textShadow = `0 0 15px ${c}88`;
        layer.appendChild(el);
        setTimeout(() => {
          if (layer.contains(el)) layer.removeChild(el);
        }, dur * 1000 + 100);
      }
      const iv = setInterval(spawn, 600);
      for (let i = 0; i < 5; i++) setTimeout(spawn, i * 300);
      return () => clearInterval(iv);
    }, []);
    return null;
  }
  function FloatingQs() {
    useEffect(() => {
      const els = [];
      for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.className = 'floatq';
        el.textContent = '?';
        el.style.left = `${Math.random() * 100}%`;
        el.style.bottom = `${Math.random() * -10}%`;
        el.style.fontSize = `${30 + Math.random() * 60}px`;
        el.style.animationDuration = `${10 + Math.random() * 15}s`;
        el.style.animationDelay = `${Math.random() * 10}s`;
        document.body.appendChild(el);
        els.push(el);
      }
      return () => els.forEach(e => {
        if (document.body.contains(e)) document.body.removeChild(e);
      });
    }, []);
    return null;
  }
  function GlobalCounter({
    stats,
    loading
  }) {
    const count = Number(stats?.totalQuestionCount || 0);
    const delta = Number(stats?.lastDeltaQuestionCount || 0);
    const fmt = n => n.toLocaleString('zh-CN');
    return React.createElement("div", {
      style: {
        width: '100%',
        background: 'linear-gradient(90deg,rgba(13,15,20,.78),rgba(13,15,20,.42))',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,229,255,.12)',
        borderRadius: 18,
        boxShadow: '0 12px 40px rgba(0,0,0,.18)',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        flexWrap: 'wrap',
        pointerEvents: 'auto'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--qc)',
        animation: 'pulse 1s infinite',
        boxShadow: '0 0 8px var(--qc)'
      }
    }), React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--muted)'
      }
    }, "\u603B\u5171\u7EDF\u8BA1\u95EE\u53F7\u5F39\u5E55"), React.createElement("span", {
      style: {
        fontSize: 20,
        fontWeight: 900,
        color: 'var(--qc)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: 1,
        textShadow: '0 0 20px rgba(0,229,255,.7)',
        display: 'inline-block'
      }
    }, loading ? '加载中' : fmt(count)), React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--muted)'
      }
    }, "\u4E2A \uFF1F")), React.createElement("div", {
      style: {
        width: 1,
        height: 16,
        background: 'var(--border)'
      }
    }), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16
      }
    }, [{
      l: '总共统计视频',
      v: fmt(stats?.videoCount || 0)
    }, {
      l: '总体疑问率',
      v: `${((stats?.questionRate || 0) * 100).toFixed(2)}%`
    }, {
      l: '最近新增问号',
      v: `+${fmt(delta)}`
    }].map(({
      l,
      v
    }) => React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        gap: 5,
        alignItems: 'center'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, l), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--pink)'
      }
    }, v)))));
  }
  function Cover({
    vid,
    style = {},
    durationStyle = {}
  }) {
    const paletteIndex = typeof vid.id === 'number' ? vid.id - 1 : Math.abs(String(vid.id || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0));
    const p = PALETTES[paletteIndex % PALETTES.length];
    const qs = '？'.repeat([3, 5, 8, 4, 6, 3][paletteIndex % 6]);
    return React.createElement("div", {
      style: {
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(circle at 30% 40%,${p[1]},${p[0]})`,
        ...style
      }
    }, vid.cover && React.createElement("img", {
      src: vid.cover,
      alt: "",
      referrerPolicy: "no-referrer",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: vid.cover ? 'linear-gradient(135deg,rgba(0,0,0,.15),rgba(0,0,0,.35))' : `linear-gradient(135deg,transparent 40%,${p[2]}22)`
      }
    }), !vid.cover && React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 42,
        fontWeight: 900,
        color: p[2],
        opacity: .3,
        letterSpacing: 4,
        userSelect: 'none'
      }
    }, qs), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        background: 'rgba(0,0,0,.6)',
        borderRadius: 4,
        padding: '2px 6px',
        fontSize: 11,
        color: '#fff',
        ...durationStyle
      }
    }, vid.duration));
  }
  function QBar({
    value
  }) {
    const p = value / 100;
    const c = p > .85 ? '#ff4757' : p > .65 ? '#ff6b35' : p > .45 ? '#ffa502' : '#00A1D6';
    const qs = p > .85 ? '？？？？？？？' : p > .65 ? '？？？？？' : p > .45 ? '？？？' : '？';
    return React.createElement("div", null, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
      }
    }, React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, "\u95EE\u53F7\u5BC6\u5EA6"), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: c
      }
    }, qs)), React.createElement("div", {
      style: {
        height: 6,
        borderRadius: 3,
        background: 'rgba(255,255,255,.08)',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        height: '100%',
        borderRadius: 3,
        width: `${p * 100}%`,
        background: `linear-gradient(90deg,#4a5270 0%,#888faa ${(1 - p) * 50}%,${c} 100%)`,
        boxShadow: `0 0 8px ${c}88`
      }
    })));
  }
  function Tags({
    tags
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4
      }
    }, tags.map(t => React.createElement("span", {
      key: t,
      style: {
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 10,
        background: 'rgba(251,114,153,.12)',
        border: '1px solid rgba(251,114,153,.25)',
        color: 'var(--pink)',
        fontWeight: 500
      }
    }, t)));
  }
  function Rank({
    n
  }) {
    const cols = {
      1: ['#ffd700', '#b8860b'],
      2: ['#c0c0c0', '#808080'],
      3: ['#cd7f32', '#8b4513']
    };
    const [a, b] = cols[n] || ['var(--muted)', 'var(--card2)'];
    return React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: `linear-gradient(135deg,${a},${b})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 13,
        color: n <= 3 ? '#000' : 'var(--txt2)',
        flexShrink: 0,
        boxShadow: n <= 3 ? `0 0 12px ${a}88` : 'none'
      }
    }, n);
  }
  function VideoCard({
    vid,
    rank,
    onSelect,
    animDelay = 0,
    onCompare,
    compareMode,
    inCompare
  }) {
    const [hov, setHov] = useState(false);
    const [dmItems, setDmItems] = useState([]);
    const qn = Math.max(1, Math.round(vid.questionIndex / 10));
    const dmTexts = ['？？？', '怎么了', '不懂啊', '？', '什么鬼', 'hhhh', '???', '离谱'];
    const p = vid.questionIndex / 100;
    const qc = p > .85 ? '#ff4757' : p > .65 ? '#ff6b35' : p > .45 ? '#ffa502' : '#00e5ff';
    useEffect(() => {
      if (!hov) {
        setDmItems([]);
        return;
      }
      let id = 0;
      const iv = setInterval(() => {
        setDmItems(prev => [...prev.slice(-8), {
          id: id++,
          text: dmTexts[Math.floor(Math.random() * dmTexts.length)],
          top: Math.random() * 70 + 5
        }]);
      }, 350);
      return () => clearInterval(iv);
    }, [hov]);
    return React.createElement("div", {
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      onClick: () => onSelect(vid),
      style: {
        background: inCompare ? 'rgba(0,229,255,.06)' : hov ? 'var(--hover)' : 'var(--card)',
        border: '1px solid ' + (inCompare ? 'rgba(0,229,255,.5)' : hov ? 'rgba(0,161,214,.35)' : 'var(--border)'),
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .25s',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? '0 16px 48px rgba(0,161,214,.18)' : '0 2px 12px rgba(0,0,0,.3)'
      }
    }, React.createElement("div", {
      style: {
        position: 'relative',
        paddingTop: '56.25%'
      }
    }, React.createElement(Cover, {
      vid: vid,
      style: {
        position: 'absolute',
        inset: 0
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        left: 10
      }
    }, React.createElement(Rank, {
      n: rank
    })), React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,.75)',
        border: '1px solid ' + qc + '66',
        borderRadius: 20,
        padding: '4px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        backdropFilter: 'blur(4px)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 900,
        color: qc
      }
    }, vid.questionIndex), React.createElement("span", {
      style: {
        fontSize: 9,
        color: 'rgba(255,255,255,.5)'
      }
    }, "\u7591\u95EE")), hov && React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'auto'
      }
    }, React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,.2)'
      }
    }), dmItems.map(item => React.createElement("div", {
      key: item.id,
      style: {
        position: 'absolute',
        top: item.top + '%',
        right: '-120px',
        fontSize: 13,
        fontWeight: 900,
        color: 'rgba(0,229,255,.9)',
        whiteSpace: 'nowrap',
        animation: 'dmfly 2.5s linear forwards',
        letterSpacing: 2,
        textShadow: '0 0 10px rgba(0,229,255,.6)',
        pointerEvents: 'none'
      }
    }, item.text)), React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }
    }, React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        openBilibiliVideo(vid);
      },
      title: "打开 B 站视频",
      style: {
        background: 'rgba(0,0,0,.65)',
        borderRadius: '50%',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        color: 'white',
        border: '1.5px solid rgba(255,255,255,.2)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        pointerEvents: 'auto'
      }
    }, "\u25B6"))), inCompare && React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        background: 'var(--qc)',
        borderRadius: 6,
        padding: '2px 8px',
        fontSize: 10,
        fontWeight: 700,
        color: '#000'
      }
    }, "\u5DF2\u9009"), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent)',
        pointerEvents: 'none'
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 10,
        left: 12,
        right: 12
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: 'white',
        lineHeight: 1.4,
        textShadow: '0 1px 4px rgba(0,0,0,.8)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, vid.title))), React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderTop: '1px solid var(--border)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: compareMode ? 8 : 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, "\u25B6 ", vid.plays), React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, "\uD83D\uDCAC ", vid.danmaku), React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--pink)',
        fontWeight: 600
      }
    }, "\uFF1F\u7387 ", vid.commentQuestionRate, "%")), compareMode && React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        onCompare(vid);
      },
      style: {
        width: '100%',
        background: inCompare ? 'rgba(0,229,255,.15)' : 'rgba(255,255,255,.04)',
        border: '1px solid ' + (inCompare ? 'var(--qc)' : 'var(--border)'),
        borderRadius: 8,
        padding: '5px',
        color: inCompare ? 'var(--qc)' : 'var(--muted)',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        marginTop: 6
      }
    }, inCompare ? '✓ 已选' : '+ 加入对比')));
  }
  function TrendCanvas({
    data,
    height = 80
  }) {
    const ref = useRef(null);
    useEffect(() => {
      const cv = ref.current;
      if (!cv) return;
      const ctx = cv.getContext('2d'),
        W = cv.width,
        H = cv.height;
      ctx.clearRect(0, 0, W, H);
      const safeData = (Array.isArray(data) && data.length > 0 ? data : [0, 0]).map(item => {
        const value = Number(item?.v ?? item ?? 0);
        return Number.isFinite(value) ? value : 0;
      });
      const max = Math.max(1, ...safeData);
      const denom = Math.max(1, safeData.length - 1);
      const pts = safeData.map((value, i) => ({
        x: i / denom * (W - 20) + 10,
        y: H - 20 - value / max * (H - 40)
      }));
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(0,161,214,.3)');
      g.addColorStop(1, 'rgba(0,161,214,0)');
      ctx.beginPath();
      ctx.moveTo(pts[0].x, H);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, H);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#00A1D6';
      ctx.lineWidth = 2;
      ctx.stroke();
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.fill();
      });
    }, [data]);
    return React.createElement("canvas", {
      ref: ref,
      width: 280,
      height: height,
      style: {
        width: '100%',
        height
      }
    });
  }
  function TrendPanel({
    vid,
    tags = []
  }) {
    const hotTags = tags;
    return React.createElement("aside", {
      style: {
        width: 220,
        flexShrink: 0,
        position: 'sticky',
        top: 80,
        alignSelf: 'flex-start'
      }
    }, React.createElement("div", {
      style: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 16
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--muted)',
        marginBottom: 10
      }
    }, "\uD83C\uDFF7\uFE0F \u70ED\u95E8\u6807\u7B7E"), React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, hotTags.length > 0 ? hotTags.map(t => React.createElement("span", {
      key: t.tag || t,
      title: t.videoCount ? `${t.videoCount} 个视频 · ${formatCompactNumber(t.questionCount)} 个问号` : undefined,
      style: {
        fontSize: 11,
        padding: '4px 10px',
        borderRadius: 12,
        background: 'rgba(0,161,214,.08)',
        border: '1px solid rgba(0,161,214,.2)',
        color: 'var(--blue)',
        cursor: 'pointer',
        transition: 'all .2s'
      }
    }, t.tag || t)) : React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--muted)',
        lineHeight: 1.7
      }
    }, "暂无真实标签数据，请先运行标签回填或新一轮爬虫。"), tags.length > 0 && React.createElement("div", {
      style: {
        width: '100%',
        marginTop: 10,
        fontSize: 10,
        color: 'var(--muted)'
      }
    }, "基于当前榜单周期真实标签统计"))));
  }
  function Navbar({
    page,
    setPage
  }) {
    const [sc, setSc] = useState(false);
    useEffect(() => {
      const fn = () => setSc(window.scrollY > 20);
      window.addEventListener('scroll', fn);
      return () => window.removeEventListener('scroll', fn);
    }, []);
    const tabs = [{
      k: 'home',
      l: '首页'
    }, {
      k: 'hall',
      l: '名人堂'
    }, {
      k: 'compare',
      l: '对比模式'
    }, {
      k: 'calc',
      l: '计算器'
    }, {
      k: 'detail',
      l: '详情页'
    }];
    return React.createElement("nav", {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: sc ? 'rgba(13,15,20,.95)' : 'transparent',
        backdropFilter: sc ? 'blur(20px)' : 'none',
        borderBottom: sc ? '1px solid rgba(0,161,214,.15)' : 'none',
        transition: 'all .3s',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        flexWrap: 'nowrap',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      onClick: () => setPage('home'),
      style: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        background: 'linear-gradient(135deg,#00A1D6,#FB7299)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 17,
        color: 'white',
        boxShadow: '0 0 20px rgba(0,161,214,.5)'
      }
    }, "?"), React.createElement("span", {
      style: {
        fontWeight: 900,
        fontSize: 17
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--blue)'
      }
    }, "\u95EE\u53F7"), React.createElement("span", {
      style: {
        color: 'var(--txt2)',
        fontSize: 13,
        marginLeft: 4
      }
    }, "\u6392\u884C\u699C"))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, tabs.map(({
      k,
      l
    }) => React.createElement("button", {
      key: k,
      onClick: () => setPage(k),
      style: {
        background: page === k ? 'rgba(0,161,214,.15)' : 'transparent',
        border: page === k ? '1px solid rgba(0,161,214,.4)' : '1px solid transparent',
        color: page === k ? 'var(--blue)' : 'var(--txt2)',
        padding: '4px 10px',
        borderRadius: 20,
        cursor: 'pointer',
        fontSize: 11,
        fontFamily: 'inherit',
        fontWeight: 600,
        transition: 'all .2s',
        whiteSpace: 'nowrap'
      }
    }, l))), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(255,71,87,.12)',
        border: '1px solid rgba(255,71,87,.3)',
        borderRadius: 20,
        padding: '4px 12px'
      }
    }, React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--red)',
        animation: 'pulse 1.5s infinite'
      }
    }), React.createElement("span", {
      style: {
        color: 'var(--red)',
        fontSize: 12,
        fontWeight: 700
      }
    }, "\u5B9E\u65F6\u66F4\u65B0")));
  }
  function Hero({
    vid,
    onSelect,
    onShare,
    stats,
    loading
  }) {
    const [cnt, setCnt] = useState(0);
    const [coverHover, setCoverHover] = useState(false);
    useEffect(() => {
      let n = 0;
      function s() {
        n += 3;
        if (n >= vid.questionIndex) {
          setCnt(vid.questionIndex);
          return;
        }
        setCnt(n);
        requestAnimationFrame(s);
      }
      requestAnimationFrame(s);
    }, [vid]);
    return React.createElement("div", {
      style: {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 0,
        marginTop: 0,
        height: "470.229px",
        gap: "20px",
        margin: "-90px 0px 0px"
      }
    }, React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 'clamp(80px,18vw,240px)',
        fontWeight: 900,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(0,161,214,.06)',
        letterSpacing: 20,
        lineHeight: 1,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        animation: 'floatY 6s ease-in-out infinite'
      }
    }, "\uFF1F\uFF1F\uFF1F\uFF1F\uFF1F")), React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 2,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        width: '100%',
        opacity: 1
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 18,
        flexWrap: 'wrap',
        animation: 'fadeInUp .6s ease both'
      }
    }, React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 999,
        background: 'linear-gradient(135deg,rgba(255,71,87,.22),rgba(255,107,53,.12))',
        border: '1px solid rgba(255,71,87,.28)',
        color: 'var(--red)',
        fontSize: 13,
        fontWeight: 900,
        boxShadow: '0 12px 30px rgba(255,71,87,.14)'
      }
    }, React.createElement("span", {
      style: {
        animation: 'pulse 1s infinite'
      }
    }, "🔥"), "今日最迷惑"), React.createElement("span", {
      style: {
        color: 'var(--muted)',
        fontSize: 12,
        marginRight: 6
      }
    }, "每小时更新"), React.createElement("div", {
      style: {
        flex: '1 1 320px',
        minWidth: 260,
        maxWidth: 760
      }
    }, React.createElement(GlobalCounter, {
      stats: stats,
      loading: loading
    }))), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(300px,480px) 1fr',
        gap: 40,
        alignItems: 'center',
        animation: 'fadeInUp .7s ease .1s both'
      }
    }, React.createElement("div", null, React.createElement("div", {
      onMouseEnter: () => setCoverHover(true),
      onMouseLeave: () => setCoverHover(false),
      onClick: () => onSelect(vid),
      style: {
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,161,214,.2),0 0 0 1px rgba(0,161,214,.15)',
        position: 'relative',
        cursor: 'pointer'
      }
    }, React.createElement("div", {
      style: {
        paddingTop: '62%',
        position: 'relative'
      }
    }, React.createElement(Cover, {
      vid: vid,
      style: {
        position: 'absolute',
        inset: 0
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: 'linear-gradient(to top,rgba(0,0,0,.8),transparent)',
        pointerEvents: 'none'
      }
    }), React.createElement("button", {
      onClick: event => {
        event.stopPropagation();
        openBilibiliVideo(vid);
      },
      title: "打开 B 站视频",
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 58,
        height: 58,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,.4)',
        background: 'rgba(0,0,0,.62)',
        color: '#fff',
        fontSize: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontFamily: 'inherit',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 10px 30px rgba(0,0,0,.35),0 0 24px rgba(0,229,255,.18)',
        zIndex: 3,
        opacity: coverHover ? 1 : 0,
        pointerEvents: coverHover ? 'auto' : 'none',
        transition: 'opacity .18s ease,transform .18s ease',
        transform: `translate(-50%,-50%) scale(${coverHover ? 1 : .92})`
      }
    }, "▶"), React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 3,
        color: 'rgba(255,255,255,.72)',
        background: 'rgba(0,0,0,.45)',
        border: '1px solid rgba(255,255,255,.16)',
        borderRadius: 999,
        padding: '4px 9px',
        fontSize: 10,
        pointerEvents: 'none',
        opacity: coverHover ? 1 : 0,
        transition: 'opacity .18s ease'
      }
    }, "点击封面看详情")), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'rgba(255,255,255,.6)',
        marginBottom: 4
      }
    }, "@", vid.uploader), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        fontSize: 12,
        color: 'rgba(255,255,255,.8)'
      }
    }, React.createElement("span", null, "\u25B6 ", vid.plays), React.createElement("span", null, "\u5F39 ", vid.danmaku)))), React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'flex',
        gap: 10
      }
    }, [{
      l: '疑问指数',
      v: `${cnt}🔥`,
      c: 'var(--red)'
    }, {
      l: '问号弹幕',
      v: vid.danmaku,
      c: 'var(--blue)'
    }, {
      l: '弹幕问号率',
      v: `${vid.commentQuestionRate}%`,
      c: 'var(--pink)'
    }].map(({
      l,
      v,
      c
    }) => React.createElement("div", {
      key: l,
      style: {
        flex: 1,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '10px 12px'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--muted)',
        marginBottom: 2
      }
    }, l), React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 900,
        color: c
      }
    }, v))))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--muted)',
        letterSpacing: 2
      }
    }, "No.1 \xB7 \u8FF7\u60D1\u89C6\u9891"), React.createElement("h1", {
      style: {
        fontSize: 'clamp(20px,2.5vw,32px)',
        fontWeight: 900,
        lineHeight: 1.45,
        textWrap: 'pretty'
      }
    }, vid.title), React.createElement(Tags, {
      tags: vid.tags
    }), React.createElement("div", {
      style: {
        fontSize: 'clamp(48px,8vw,96px)',
        fontWeight: 900,
        letterSpacing: 8,
        lineHeight: 1,
        background: 'linear-gradient(135deg,#00e5ff 0%,#00A1D6 35%,#fb7299 70%,#00e5ff 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shimmer 3s linear infinite,floatY 4s ease-in-out infinite',
        display: 'inline-block'
      }
    }, "\uFF1F\uFF1F\uFF1F\uFF1F\uFF1F\uFF1F"), React.createElement("p", {
      style: {
        color: 'var(--txt2)',
        fontSize: 14,
        lineHeight: 1.7
      }
    }, vid.description), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap'
      }
    }, React.createElement("button", {
      onClick: () => onSelect(vid),
      style: {
        background: 'linear-gradient(135deg,var(--blue),var(--blue-d))',
        border: 'none',
        borderRadius: 24,
        padding: '12px 28px',
        color: 'white',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: '0 8px 24px rgba(0,161,214,.35)'
      }
    }, "\uD83D\uDCCA \u67E5\u770B\u8FF7\u60D1\u65F6\u95F4\u8F74"), React.createElement("button", {
      onClick: () => onShare(vid),
      style: {
        background: 'transparent',
        border: '1px solid rgba(251,114,153,.4)',
        borderRadius: 24,
        padding: '12px 20px',
        color: 'var(--pink)',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, "\uD83C\uDCCF \u751F\u6210\u5206\u4EAB\u5361\u7247"))))), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        color: 'var(--muted)',
        fontSize: 11,
        animation: 'floatY 2s ease-in-out infinite',
        zIndex: 2
      }
    }, React.createElement("span", null, "\u5411\u4E0B\u6EDA\u52A8"), React.createElement("span", null, "\u2193")));
  }
  function CompactRow({
    vid,
    rank,
    onSelect,
    index
  }) {
    const [hov, setHov] = useState(false);
    const p = vid.questionIndex / 100;
    const c = p > .85 ? '#ff4757' : p > .65 ? '#ff6b35' : p > .45 ? '#ffa502' : '#00A1D6';
    const qn = Math.max(1, Math.round(vid.questionIndex / 20));
    const paletteIndex = typeof vid.id === 'number' ? vid.id - 1 : Math.abs(String(vid.id || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0));
    const PAL = PALETTES[paletteIndex % PALETTES.length];
    return React.createElement("div", {
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      onClick: () => onSelect(vid),
      style: {
        display: 'grid',
        gridTemplateColumns: '36px 72px 1fr auto auto auto',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        background: hov ? 'var(--hover)' : 'transparent',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'background .2s',
        opacity: 0,
        animation: `slideInCard .4s ease ${index * .05}s both`
      }
    }, React.createElement("div", {
      style: {
        fontWeight: 900,
        fontSize: 15,
        color: 'var(--muted)',
        textAlign: 'center'
      }
    }, rank), React.createElement(Cover, {
      vid: vid,
      style: {
        width: 72,
        height: 45,
        borderRadius: 8,
        flexShrink: 0,
        boxShadow: hov ? '0 8px 20px rgba(0,0,0,.25)' : 'none',
        transition: 'box-shadow .2s'
      },
      durationStyle: {
        right: 3,
        bottom: 3,
        borderRadius: 3,
        padding: '1px 4px',
        fontSize: 9,
        lineHeight: 1.2
      }
    }), React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: hov ? 'var(--blue)' : 'var(--txt)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        transition: 'color .2s'
      }
    }, vid.title), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 3,
        alignItems: 'center'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, "@", vid.uploader), vid.tags.slice(0, 1).map(t => React.createElement("span", {
      key: t,
      style: {
        fontSize: 9,
        padding: '1px 6px',
        borderRadius: 8,
        background: 'rgba(251,114,153,.1)',
        border: '1px solid rgba(251,114,153,.2)',
        color: 'var(--pink)'
      }
    }, t)))), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 900,
        color: c,
        letterSpacing: 2,
        textShadow: `0 0 10px ${c}88`,
        flexShrink: 0
      }
    }, '？'.repeat(qn)), React.createElement("div", {
      style: {
        width: 80,
        flexShrink: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        marginBottom: 2
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--muted)'
      }
    }, "\u7591\u95EE"), React.createElement("span", {
      style: {
        color: c,
        fontWeight: 700
      }
    }, vid.questionIndex)), React.createElement("div", {
      style: {
        height: 4,
        borderRadius: 2,
        background: 'rgba(255,255,255,.06)',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        height: '100%',
        borderRadius: 2,
        width: `${vid.questionIndex}%`,
        background: `linear-gradient(90deg,#4a5270,${c})`,
        boxShadow: `0 0 6px ${c}66`
      }
    }))), React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--muted)',
        flexShrink: 0,
        textAlign: 'right'
      }
    }, React.createElement("div", null, "\u25B6 ", vid.plays), React.createElement("div", {
      style: {
        color: 'var(--pink)',
        marginTop: 2
      }
    }, "\u5F39 ", vid.danmaku)));
  }
  function AnimatedCard({
    children,
    index
  }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(index === 0);
    useEffect(() => {
      const node = ref.current;
      if (!node || vis) return;
      if (!('IntersectionObserver' in window)) {
        setVis(true);
        return;
      }
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVis(true);
        return;
      }
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      }, {
        threshold: .01,
        rootMargin: '120px 0px'
      });
      obs.observe(node);
      return () => obs.disconnect();
    }, [vis]);
    return React.createElement("div", {
      ref: ref,
      style: {
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity .5s ease ${index * .08}s,transform .5s ease ${index * .08}s`
      }
    }, children);
  }
  const TIME_TABS = [{
    id: 'day',
    l: '日榜'
  }, {
    id: 'week',
    l: '周榜'
  }, {
    id: 'month',
    l: '月榜'
  }, {
    id: 'all',
    l: '总榜'
  }];
  const TYPE_TABS = [{
    id: '综合',
    l: '综合疑惑榜'
  }, {
    id: '问号',
    l: '问号总量榜'
  }, {
    id: '浓度',
    l: '疑问浓度榜'
  }];
  function Leaderboard({
    onSelect,
    compareMode,
    onCompare,
    compareList,
    homeData
  }) {
    const time = homeData?.range || 'week';
    const setTime = homeData?.setRange || (() => {});
    const type = homeData?.type || '综合';
    const setType = homeData?.setType || (() => {});
    const vids = homeData?.videos || allVideos();
    const sorted = [...vids];
    const subtitle = {
      综合: '综合疑问指数排序',
      问号: '弹幕问号总量排序',
      浓度: '弹幕问号率排序'
    };
    return React.createElement("section", {
      style: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: "6px 24px 0px"
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }
    }, React.createElement("div", null, React.createElement("h2", {
      style: {
        fontSize: 26,
        fontWeight: 900,
        marginBottom: 4
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--qc)'
      }
    }, "\uFF1F"), " \u95EE\u53F7\u6392\u884C\u699C"), React.createElement("p", {
      style: {
        color: 'var(--muted)',
        fontSize: 13
      }
    }, TIME_TABS.find(t => t.id === time)?.l, " \xB7 ", TYPE_TABS.find(t => t.id === type)?.l, " \xB7 ", subtitle[type])), homeData?.loading && React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--qc)',
        background: 'rgba(0,229,255,.08)',
        border: '1px solid rgba(0,229,255,.2)',
        borderRadius: 20,
        padding: '6px 14px'
      }
    }, "\u6B63\u5728\u8FDE\u63A5\u771F\u5B9E\u540E\u7AEF\u2026"), homeData?.error && React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--pink)',
        background: 'rgba(251,114,153,.08)',
        border: '1px solid rgba(251,114,153,.2)',
        borderRadius: 20,
        padding: '6px 14px'
      }
    }, "\u540E\u7AEF\u6570\u636E\u52A0\u8F7D\u5931\u8D25\uFF0C\u5F53\u524D\u4F7F\u7528\u515C\u5E95\u6570\u636E\uFF1A", homeData.error), compareMode && React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--qc)',
        background: 'rgba(0,229,255,.08)',
        border: '1px solid rgba(0,229,255,.2)',
        borderRadius: 20,
        padding: '6px 14px'
      }
    }, "\u5BF9\u6BD4\u6A21\u5F0F\u5DF2\u5F00\u542F \xB7 \u5DF2\u9009 ", compareList.length, "/2 \u4E2A\u89C6\u9891")), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 10,
        flexWrap: 'wrap'
      }
    }, TIME_TABS.map(t => React.createElement("button", {
      key: t.id,
      onClick: () => setTime(t.id),
      style: {
        background: time === t.id ? 'var(--card2)' : 'transparent',
        border: '1px solid ' + (time === t.id ? 'rgba(255,255,255,.15)' : 'transparent'),
        borderRadius: 20,
        padding: '6px 16px',
        color: time === t.id ? 'var(--txt)' : 'var(--muted)',
        fontSize: 13,
        fontWeight: time === t.id ? 700 : 400,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all .2s'
      }
    }, t.l))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 24,
        flexWrap: 'wrap',
        paddingLeft: 2
      }
    }, TYPE_TABS.map(t => React.createElement("button", {
      key: t.id,
      onClick: () => setType(t.id),
      style: {
        background: type === t.id ? 'linear-gradient(135deg,var(--blue),var(--blue-d))' : 'var(--card)',
        border: '1px solid ' + (type === t.id ? 'transparent' : 'var(--border)'),
        borderRadius: 24,
        padding: '7px 18px',
        color: type === t.id ? 'white' : 'var(--txt2)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: type === t.id ? '0 4px 16px rgba(0,161,214,.3)' : 'none',
        transition: 'all .2s'
      }
    }, t.l))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start'
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
        gap: 18,
        marginBottom: 28
      }
    }, sorted.slice(0, 6).map((v, i) => React.createElement(AnimatedCard, {
      key: v.id + '-' + time + '-' + type,
      index: i
    }, React.createElement(VideoCard, {
      vid: v,
      rank: i + 1,
      onSelect: onSelect,
      compareMode: compareMode,
      onCompare: onCompare,
      inCompare: compareList.includes(v.id)
    })))), sorted.length > 6 && React.createElement("div", {
      style: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--txt2)'
      }
    }, "\u66F4\u591A\u4E0A\u699C\u89C6\u9891"), React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)',
        background: 'rgba(255,255,255,.05)',
        borderRadius: 10,
        padding: '2px 8px'
      }
    }, "\u7B2C 7 \u2014 ", sorted.length, " \u540D")), sorted.slice(6).map((v, i) => React.createElement(CompactRow, {
      key: v.id + '-' + time + '-' + type,
      vid: v,
      rank: i + 7,
      onSelect: onSelect,
      index: i
    })))), React.createElement(TrendPanel, {
      vid: sorted[0],
      tags: homeData?.hotTags || []
    })));
  }
  function Waveform({
    tl = [],
    peaks = [],
    color = '#00A1D6'
  }) {
    const safeTl = (Array.isArray(tl) && tl.length > 0 ? tl : [{
      t: 0,
      v: 0
    }, {
      t: 30,
      v: 0
    }]).map((item, index) => {
      const t = Number(item?.t ?? item?.time ?? index * 30);
      const v = Number(item?.v ?? item?.value ?? 0);
      return {
        t: Number.isFinite(t) ? t : index * 30,
        v: Number.isFinite(v) ? v : 0
      };
    });
    const ref = useRef(null);
    useEffect(() => {
      const cv = ref.current;
      if (!cv) return;
      const ctx = cv.getContext('2d'),
        W = cv.width,
        H = cv.height;
      ctx.clearRect(0, 0, W, H);
      const max = Math.max(1, ...safeTl.map(d => d.v));
      const bw = W / Math.max(1, safeTl.length);
      safeTl.forEach((d, i) => {
        const value = Number.isFinite(d.v) ? d.v : 0;
        const h = value / max * (H - 20),
          x = i * bw,
          p = value / max;
        if (p > .7) {
          ctx.shadowColor = 'rgba(255,71,87,.6)';
          ctx.shadowBlur = 12;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        const g = ctx.createLinearGradient(0, H - h - 10, 0, H - 10);
        g.addColorStop(0, p > .7 ? '#ff4757' : p > .4 ? '#ff6b35' : color);
        g.addColorStop(1, p > .7 ? 'rgba(255,71,87,.3)' : p > .4 ? 'rgba(255,107,53,.3)' : `${color}44`);
        ctx.fillStyle = g;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x + 1, H - h - 10, bw - 2, h, 2);else ctx.rect(x + 1, H - h - 10, Math.max(1, bw - 2), h);
        ctx.fill();
      });
    }, [safeTl, color]);
    const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    return React.createElement("div", null, React.createElement("canvas", {
      ref: ref,
      width: 800,
      height: 100,
      style: {
        width: '100%',
        height: 100
      }
    }), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 4,
        fontSize: 10,
        color: 'var(--muted)'
      }
    }, [0, .25, .5, .75, 1].map(p => React.createElement("span", {
      key: p
    }, fmt(Math.round(p * (safeTl[safeTl.length - 1]?.t || 0)))))), peaks && peaks.length > 0 && React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--muted)',
        marginBottom: 8
      }
    }, "\uD83D\uDCA5 \u8FF7\u60D1\u77AC\u95F4"), peaks.map((m, i) => React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--card2)',
        borderRadius: 10,
        padding: '8px 12px',
        border: '1px solid var(--border)',
        marginBottom: 6,
        cursor: 'pointer'
      }
    }, React.createElement("div", {
      style: {
        background: 'rgba(0,161,214,.15)',
        border: '1px solid rgba(0,161,214,.3)',
        borderRadius: 8,
        padding: '3px 8px',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--blue)',
        flexShrink: 0
      }
    }, m.time), React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 900,
        color: 'var(--qc)',
        letterSpacing: 2
      }
    }, m.label), React.createElement("div", {
      style: {
        marginLeft: 'auto',
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, "\u5BC6\u5EA6 ", React.createElement("span", {
      style: {
        color: 'var(--red)',
        fontWeight: 700
      }
    }, m.count)), React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--blue)'
      }
    }, "\u2192 \u8DF3\u8F6C")))));
  }
  function ComparePage({
    videos
  }) {
    const vids = videos?.length ? videos : allVideos();
    const [sel, setSel] = useState([]);
    const [stage, setStage] = useState('pick');
    const [animating, setAnimating] = useState(false);
    const [winner, setWinner] = useState(null);
    const [scores, setScores] = useState([0, 0]);
    const [barW, setBarW] = useState([50, 50]);
    function toggleSel(vid) {
      setSel(prev => {
        if (prev.find(v => v.id === vid.id)) return prev.filter(v => v.id !== vid.id);
        if (prev.length >= 2) return [prev[1], vid];
        return [...prev, vid];
      });
    }
    function startBattle() {
      if (sel.length < 2) return;
      setStage('battle');
      setAnimating(true);
      setWinner(null);
      setScores([0, 0]);
      setBarW([50, 50]);
      let frame = 0;
      const a = sel[0].questionIndex,
        b = sel[1].questionIndex,
        total = a + b;
      const iv = setInterval(() => {
        frame += 3;
        setScores([Math.min(a, Math.round(a * (frame / 100))), Math.min(b, Math.round(b * (frame / 100)))]);
        setBarW([Math.round(a / total * 100), Math.round(b / total * 100)]);
        if (frame >= 100) {
          clearInterval(iv);
          setScores([a, b]);
          setBarW([Math.round(a / total * 100), Math.round(b / total * 100)]);
          setTimeout(() => {
            setWinner(a >= b ? sel[0] : sel[1]);
            setAnimating(false);
            setStage('result');
          }, 600);
        }
      }, 20);
    }
    function reset() {
      setSel([]);
      setStage('pick');
      setWinner(null);
      setScores([0, 0]);
      setBarW([50, 50]);
    }
    if (stage === 'pick') {
      return React.createElement("div", {
        style: {
          maxWidth: 1100,
          margin: '0 auto',
          padding: '28px 24px 60px'
        }
      }, React.createElement("div", {
        style: {
          textAlign: 'center',
          marginBottom: 36
        }
      }, React.createElement("div", {
        style: {
          fontSize: 40,
          marginBottom: 10,
          animation: 'floatY 3s ease-in-out infinite'
        }
      }, "\u2694\uFE0F"), React.createElement("h2", {
        style: {
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 8
        }
      }, "\u8FF7\u60D1\u5BF9\u51B3"), React.createElement("p", {
        style: {
          color: 'var(--muted)',
          fontSize: 14
        }
      }, "\u9009\u62E9 2 \u4E2A\u89C6\u9891\uFF0C\u770B\u770B\u54EA\u4E2A\u66F4\u8FF7\u60D1")), React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 32
        }
      }, [0, 1].map(i => React.createElement("div", {
        key: i,
        style: {
          width: 200,
          height: 130,
          borderRadius: 16,
          border: '2px dashed ' + (sel[i] ? i === 0 ? 'rgba(0,161,214,.6)' : 'rgba(251,114,153,.6)' : 'rgba(255,255,255,.1)'),
          background: sel[i] ? 'var(--card)' : 'rgba(255,255,255,.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all .3s',
          position: 'relative',
          overflow: 'hidden'
        }
      }, sel[i] ? React.createElement(React.Fragment, null, React.createElement(Cover, {
        vid: sel[i],
        style: {
          position: 'absolute',
          inset: 0
        }
      }), React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: 10
        }
      }, React.createElement("div", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.4
        }
      }, sel[i].title.slice(0, 24), "\u2026"), React.createElement("div", {
        style: {
          fontSize: 22,
          fontWeight: 900,
          color: i === 0 ? '#00e5ff' : '#fb7299'
        }
      }, "\u7591\u95EE ", sel[i].questionIndex)), React.createElement("button", {
        onClick: e => {
          e.stopPropagation();
          toggleSel(sel[i]);
        },
        style: {
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,.7)',
          border: 'none',
          borderRadius: '50%',
          width: 22,
          height: 22,
          color: 'white',
          fontSize: 11,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2
        }
      }, "\u2715")) : React.createElement(React.Fragment, null, React.createElement("div", {
        style: {
          fontSize: 28,
          color: 'rgba(255,255,255,.1)',
          marginBottom: 6
        }
      }, "\uFF1F"), React.createElement("div", {
        style: {
          fontSize: 12,
          color: 'var(--muted)'
        }
      }, "\u9009\u62E9\u89C6\u9891 ", i + 1), React.createElement("div", {
        style: {
          fontSize: 10,
          color: i === 0 ? 'rgba(0,161,214,.5)' : 'rgba(251,114,153,.5)',
          marginTop: 4
        }
      }, i === 0 ? '视频 A' : '视频 B')))), React.createElement("div", {
        style: {
          fontSize: 24,
          fontWeight: 900,
          color: 'var(--muted)',
          flexShrink: 0
        }
      }, "VS")), React.createElement("div", {
        style: {
          textAlign: 'center',
          marginBottom: 36
        }
      }, React.createElement("button", {
        onClick: startBattle,
        disabled: sel.length < 2,
        style: {
          background: sel.length >= 2 ? 'linear-gradient(135deg,var(--red),var(--orange))' : 'var(--card2)',
          border: 'none',
          borderRadius: 24,
          padding: '13px 36px',
          color: sel.length >= 2 ? 'white' : 'var(--muted)',
          fontSize: 15,
          fontWeight: 700,
          cursor: sel.length >= 2 ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit',
          boxShadow: sel.length >= 2 ? '0 8px 24px rgba(255,71,87,.3)' : 'none',
          transition: 'all .3s'
        }
      }, sel.length < 2 ? '还需选 ' + (2 - sel.length) + ' 个视频' : '🔥 开始对决！')), React.createElement("div", {
        style: {
          fontSize: 13,
          color: 'var(--muted)',
          marginBottom: 14,
          textAlign: 'center'
        }
      }, "\u4ECE\u4E0B\u65B9\u9009\u62E9\u53C2\u8D5B\u89C6\u9891"), React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))',
          gap: 14
        }
      }, vids.map(v => {
        const isSel = sel.find(s => s.id === v.id);
        const selIdx = sel.findIndex(s => s.id === v.id);
        return React.createElement("div", {
          key: v.id,
          onClick: () => toggleSel(v),
          style: {
            background: isSel ? selIdx === 0 ? 'rgba(0,161,214,.08)' : 'rgba(251,114,153,.08)' : 'var(--card)',
            border: '2px solid ' + (isSel ? selIdx === 0 ? 'rgba(0,161,214,.5)' : 'rgba(251,114,153,.5)' : 'var(--border)'),
            borderRadius: 12,
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all .2s',
            transform: isSel ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: isSel ? selIdx === 0 ? '0 8px 24px rgba(0,161,214,.2)' : '0 8px 24px rgba(251,114,153,.2)' : 'none'
          }
        }, React.createElement("div", {
          style: {
            paddingTop: '56.25%',
            position: 'relative'
          }
        }, React.createElement(Cover, {
          vid: v,
          style: {
            position: 'absolute',
            inset: 0
          }
        }), isSel && React.createElement("div", {
          style: {
            position: 'absolute',
            top: 7,
            right: 7,
            background: selIdx === 0 ? 'var(--blue)' : 'var(--pink)',
            borderRadius: 20,
            padding: '2px 9px',
            fontSize: 10,
            fontWeight: 700,
            color: 'white'
          }
        }, selIdx === 0 ? 'A' : 'B')), React.createElement("div", {
          style: {
            padding: '10px 12px'
          }
        }, React.createElement("div", {
          style: {
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: 4,
            color: isSel ? selIdx === 0 ? 'var(--blue)' : 'var(--pink)' : 'var(--txt)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }, v.title), React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--muted)'
          }
        }, React.createElement("span", {
          style: {
            color: 'var(--red)',
            fontWeight: 700
          }
        }, "\u7591\u95EE ", v.questionIndex), React.createElement("span", null, v.plays))));
      })));
    }
    const va = sel[0],
      vb = sel[1];
    const aWins = winner && winner.id === va.id;
    const bWins = winner && winner.id === vb.id;
    return React.createElement("div", {
      style: {
        maxWidth: 1000,
        margin: '0 auto',
        padding: '28px 24px 60px'
      }
    }, React.createElement("div", {
      style: {
        textAlign: 'center',
        marginBottom: 28
      }
    }, React.createElement("h2", {
      style: {
        fontSize: 26,
        fontWeight: 900,
        marginBottom: 6
      }
    }, "\u2694\uFE0F \u8FF7\u60D1\u5BF9\u51B3"), animating && React.createElement("p", {
      style: {
        color: 'var(--muted)',
        fontSize: 13,
        animation: 'pulse 1s infinite'
      }
    }, "\u6B63\u5728\u8BA1\u7B97\u7591\u95EE\u6307\u6570\u2026"), stage === 'result' && React.createElement("p", {
      style: {
        color: 'var(--gold)',
        fontSize: 14,
        fontWeight: 700,
        animation: 'fadeInUp .5s ease both'
      }
    }, "\uD83C\uDFC6 \u5224\u5B9A\u5B8C\u6210\uFF01")), React.createElement("div", {
      style: {
        marginBottom: 24,
        background: 'var(--card)',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        height: 12
      }
    }, React.createElement("div", {
      style: {
        width: barW[0] + '%',
        background: 'linear-gradient(90deg,var(--blue),#0088bb)',
        transition: 'width 1.2s ease',
        boxShadow: '2px 0 12px rgba(0,161,214,.5)'
      }
    }), React.createElement("div", {
      style: {
        flex: 1,
        background: 'linear-gradient(90deg,#bb0055,var(--pink))',
        boxShadow: '-2px 0 12px rgba(251,114,153,.5)'
      }
    })), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        padding: '10px 18px',
        alignItems: 'center'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--blue)'
      }
    }, va.uploader, " ", React.createElement("span", {
      style: {
        fontSize: 22,
        fontWeight: 900
      }
    }, scores[0])), React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: 'var(--muted)',
        padding: '0 18px'
      }
    }, "VS"), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--pink)',
        textAlign: 'right'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 22,
        fontWeight: 900
      }
    }, scores[1]), " ", vb.uploader))), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 24
      }
    }, [va, vb].map((vid, si) => {
      const isWinner = stage === 'result' && winner && winner.id === vid.id;
      return React.createElement("div", {
        key: vid.id,
        style: {
          background: 'var(--card)',
          border: '2px solid ' + (isWinner ? 'var(--gold)' : si === 0 ? 'rgba(0,161,214,.4)' : 'rgba(251,114,153,.4)'),
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: isWinner ? '0 0 40px rgba(255,215,0,.3)' : 'none',
          transition: 'all .5s'
        }
      }, React.createElement("div", {
        style: {
          paddingTop: '56.25%',
          position: 'relative'
        }
      }, React.createElement(Cover, {
        vid: vid,
        style: {
          position: 'absolute',
          inset: 0
        }
      }), isWinner && React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,215,0,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, React.createElement("div", {
        style: {
          fontSize: 52,
          animation: 'qExplode .6s ease'
        }
      }, "\uD83C\uDFC6")), React.createElement("div", {
        style: {
          position: 'absolute',
          top: 10,
          left: 10,
          background: si === 0 ? 'var(--blue)' : 'var(--pink)',
          borderRadius: 8,
          padding: '3px 10px',
          fontSize: 11,
          fontWeight: 700,
          color: 'white'
        }
      }, "\u89C6\u9891", si === 0 ? 'A' : 'B')), React.createElement("div", {
        style: {
          padding: 16
        }
      }, React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1.5,
          marginBottom: 10
        }
      }, vid.title.length > 40 ? vid.title.slice(0, 40) + '…' : vid.title), vid.timeline && vid.timeline.length > 0 && React.createElement(Waveform, {
        tl: vid.timeline,
        color: si === 0 ? '#00A1D6' : '#fb7299'
      }), React.createElement("div", {
        style: {
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8
        }
      }, [{
        l: '疑问指数',
        v: vid.questionIndex,
        c: si === 0 ? 'var(--blue)' : 'var(--pink)'
      }, {
        l: '弹幕问号率',
        v: vid.commentQuestionRate + '%',
        c: 'var(--txt)'
      }, {
        l: '播放量',
        v: vid.plays,
        c: 'var(--muted)'
      }].map(({
        l,
        v,
        c
      }) => React.createElement("div", {
        key: l,
        style: {
          background: 'var(--card2)',
          borderRadius: 8,
          padding: '8px'
        }
      }, React.createElement("div", {
        style: {
          fontSize: 9,
          color: 'var(--muted)',
          marginBottom: 2
        }
      }, l), React.createElement("div", {
        style: {
          fontSize: 15,
          fontWeight: 900,
          color: c
        }
      }, v))))));
    })), stage === 'result' && winner && React.createElement("div", {
      style: {
        background: 'linear-gradient(135deg,rgba(255,215,0,.08),rgba(255,107,53,.08))',
        border: '1px solid rgba(255,215,0,.3)',
        borderRadius: 16,
        padding: 24,
        textAlign: 'center',
        animation: 'fadeInUp .6s ease both',
        marginBottom: 24
      }
    }, React.createElement("div", {
      style: {
        fontSize: 30,
        marginBottom: 8
      }
    }, "\uD83C\uDFC6"), React.createElement("div", {
      style: {
        fontSize: 14,
        color: 'var(--muted)',
        marginBottom: 4
      }
    }, "\u66F4\u8FF7\u60D1\u7684\u89C6\u9891\u662F"), React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 900,
        color: 'var(--gold)',
        textShadow: '0 0 20px rgba(255,215,0,.5)',
        marginBottom: 6
      }
    }, winner.title.length > 40 ? winner.title.slice(0, 40) + '…' : winner.title), React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--txt2)',
        marginBottom: 12
      }
    }, "\u7591\u95EE\u6307\u6570 ", React.createElement("span", {
      style: {
        color: 'var(--gold)',
        fontWeight: 900,
        fontSize: 20
      }
    }, winner.questionIndex), " \u5206 \xB7 @", winner.uploader), React.createElement("div", {
      style: {
        fontSize: 32,
        fontWeight: 900,
        letterSpacing: 6,
        background: 'linear-gradient(90deg,var(--qc),var(--pink),var(--qc))',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shimmer 2s linear infinite'
      }
    }, "\uFF1F\uFF1F\uFF1F\uFF1F\uFF1F\uFF1F")), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 12
      }
    }, React.createElement("button", {
      onClick: reset,
      style: {
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '10px 24px',
        color: 'var(--muted)',
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, "\u91CD\u65B0\u9009\u62E9"), stage === 'result' && React.createElement("button", {
      onClick: startBattle,
      style: {
        background: 'linear-gradient(135deg,var(--red),var(--orange))',
        border: 'none',
        borderRadius: 20,
        padding: '10px 24px',
        color: 'white',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, "\u518D\u6B21\u5BF9\u51B3 \uD83D\uDD25")));
  }
  function HallOfFame({
    onBack,
    videos,
    onSelect,
    loading,
    error
  }) {
    const hall = videos?.length ? videos.slice(0, 8).map(v => ({
      ...v,
      date: v.uploadTime
    })) : [];
    const cols = [['#1a0533', '#5c1a8a'], ['#0d1b2a', '#1b4332'], ['#1a0a00', '#6b2d00'], ['#0a0a2e', '#1a1a6e']];
    return React.createElement("div", {
      style: {
        maxWidth: 1000,
        margin: '0 auto',
        padding: '28px 24px 60px'
      }
    }, React.createElement("button", {
      onClick: onBack,
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--muted)',
        cursor: 'pointer',
        fontSize: 13,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'inherit',
        padding: 0
      }
    }, "← 返回"), React.createElement("div", {
      style: {
        textAlign: 'center',
        marginBottom: 48
      }
    }, React.createElement("div", {
      style: {
        fontSize: 48,
        fontWeight: 900,
        marginBottom: 8,
        animation: 'floatY 3s ease-in-out infinite'
      }
    }, React.createElement("span", {
      style: {
        background: 'linear-gradient(135deg,#ffd700,#ffaa00)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }, "🏆")), React.createElement("h2", {
      style: {
        fontSize: 32,
        fontWeight: 900,
        marginBottom: 8
      }
    }, React.createElement("span", {
      style: {
        background: 'linear-gradient(135deg,#ffd700,#ff6b35)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }, "迷惑名人堂")), React.createElement("p", {
      style: {
        color: 'var(--muted)',
        fontSize: 14
      }
    }, "总榜中综合疑惑分最高的传奇视频"), loading && React.createElement("div", {
      style: {
        marginTop: 12,
        color: 'var(--qc)',
        fontSize: 12
      }
    }, "正在读取真实总榜…"), error && React.createElement("div", {
      style: {
        marginTop: 12,
        color: 'var(--pink)',
        fontSize: 12
      }
    }, "名人堂数据加载失败：", error)), hall.length > 0 ? React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
        gap: 20
      }
    }, hall.map((v, i) => React.createElement("div", {
      key: v.id,
      onClick: () => onSelect?.(v),
      style: {
        background: 'var(--card)',
        border: '1px solid rgba(255,215,0,.25)',
        borderRadius: 18,
        overflow: 'hidden',
        animation: 'goldGlow 3s ease-in-out infinite',
        animationDelay: `${i * .5}s`,
        cursor: 'pointer',
        position: 'relative'
      }
    }, React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg,#ffd700,#ff6b35,#ffd700)'
      }
    }), React.createElement("div", {
      style: {
        position: 'relative',
        paddingTop: '56.25%',
        background: `linear-gradient(135deg,${cols[i % 4][0]},${cols[i % 4][1]})`
      }
    }, React.createElement(Cover, {
      vid: v,
      style: {
        position: 'absolute',
        inset: 0
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top,rgba(0,0,0,.82),rgba(0,0,0,.08) 58%,rgba(0,0,0,.2))'
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'linear-gradient(135deg,#ffd700,#ff9f1a)',
        color: '#2b1600',
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 900,
        boxShadow: '0 4px 14px rgba(255,215,0,.35)'
      }
    }, "🏆 总榜 #", i + 1), React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        openBilibiliVideo(v);
      },
      title: "打开 B 站视频",
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 46,
        height: 46,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,.35)',
        background: 'rgba(0,0,0,.62)',
        color: '#fff',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontFamily: 'inherit',
        backdropFilter: 'blur(4px)'
      }
    }, "▶"), React.createElement("div", {
      style: {
        position: 'absolute',
        right: 12,
        bottom: 10,
        fontSize: 28,
        fontWeight: 900,
        color: '#ffd700',
        textShadow: '0 0 22px rgba(255,215,0,.75)'
      }
    }, v.questionIndex)), React.createElement("div", {
      style: {
        padding: 16
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#ffd700',
        fontWeight: 800,
        letterSpacing: 1
      }
    }, "LEGEND #", i + 1), React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'rgba(255,255,255,.55)'
      }
    }, v.duration)), React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.5,
        marginBottom: 10,
        color: 'var(--txt)'
      }
    }, v.title), React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'rgba(255,255,255,.5)',
        marginBottom: 8
      }
    }, "@", v.uploader), React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 12
      }
    }, v.tags.map(t => React.createElement("span", {
      key: t,
      style: {
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 10,
        background: 'rgba(255,215,0,.12)',
        border: '1px solid rgba(255,215,0,.25)',
        color: '#ffd700'
      }
    }, t))), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        color: 'rgba(255,255,255,.5)'
      }
    }, React.createElement("span", null, "▶ ", v.plays), React.createElement("span", null, v.date)), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        fontSize: 80,
        fontWeight: 900,
        color: 'rgba(255,215,0,.05)',
        userSelect: 'none',
        lineHeight: 1
      }
    }, "？"))))), React.createElement("div", {
      style: {
        marginTop: 48,
        background: 'var(--card)',
        border: '1px solid rgba(255,215,0,.15)',
        borderRadius: 16,
        padding: 24,
        textAlign: 'center'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        color: 'var(--muted)',
        marginBottom: 8
      }
    }, "目前共有 ", React.createElement("span", {
      style: {
        color: '#ffd700',
        fontWeight: 700
      }
    }, hall.length), " 个视频荣登名人堂"))) : React.createElement("div", {
      style: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 28,
        textAlign: 'center',
        color: 'var(--muted)'
      }
    }, loading ? "正在加载名人堂…" : "暂无真实名人堂数据，请先完成一轮弹幕统计"));
  }
  function ConfusionCalc() {
    const [input, setInput] = useState('');
    const [stage, setStage] = useState('idle');
    const [score, setScore] = useState(0);
    const [calcResult, setCalcResult] = useState(null);
    const [error, setError] = useState('');
    const [logs, setLogs] = useState([]);
    const [qExplosion, setQExplosion] = useState(false);
    const scanMessages = ['读取 BV 号…', '获取视频基础信息…', '拉取弹幕 XML…', '统计问号弹幕…', '分析疑问时间轴…', '抽样评论疑问词…', '生成最终结果…'];
    const extractBvid = value => {
      const text = String(value || '').trim();
      const match = text.match(/BV[0-9A-Za-z]{6,}/i);
      return match ? match[0].replace(/^bv/i, 'BV') : '';
    };
    const isValidBvid = value => /^BV[0-9A-Za-z]{6,}$/i.test(value);
    const buildScore = data => {
      const questionCount = Number(data?.danmaku?.questionCount || 0);
      const danmakuCount = Number(data?.danmaku?.danmakuCount || 0);
      const view = Number(data?.view || 0);
      const effectiveRate = questionCount / (danmakuCount + 50);
      const rateBoost = 1 + 2 * (1 - Math.exp(-5 * effectiveRate));
      const rawScore = Math.sqrt(questionCount) * Math.log10(view + 10) * rateBoost;
      const mapped = 100 * (1 - Math.exp(-rawScore / 3000));
      return Math.max(1, Math.min(100, Math.round(mapped)));
    };
    async function runAnalysis(bvid) {
      try {
        const res = await fetch(`/api/video/${encodeURIComponent(bvid)}/analysis`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const raw = buildScore(data);
        setCalcResult(data);
        setScore(raw);
        setStage('result');
        if (raw >= 80) {
          setQExplosion(true);
          setTimeout(() => setQExplosion(false), 1000);
        }
      } catch (err) {
        setStage('idle');
        setError('分析失败：请确认 BV 号正确，或稍后重试');
      }
    }
    function calculate() {
      const bvid = extractBvid(input);
      if (!bvid) return;
      if (!isValidBvid(bvid)) {
        setError('请输入正确的 BV 号或 B 站视频网址，例如 BV1xx411c7mD');
        return;
      }
      setInput(bvid);
      setStage('scanning');
      setError('');
      setLogs([]);
      setScore(0);
      setCalcResult(null);
      let i = 0;
      const iv = setInterval(() => {
        if (i < scanMessages.length) {
          setLogs(l => [...l, scanMessages[i]]);
          i++;
        } else {
          clearInterval(iv);
          runAnalysis(bvid);
        }
      }, 280);
    }
    const getLabel = s => s >= 90 ? '🔥 极度迷惑' : s >= 75 ? '😵 非常迷惑' : s >= 55 ? '🤔 中度迷惑' : s >= 35 ? '🙄 轻度迷惑' : '😐 普通视频';
    const getColor = s => s >= 90 ? 'var(--red)' : s >= 75 ? 'var(--orange)' : s >= 55 ? 'var(--gold)' : s >= 35 ? 'var(--blue)' : 'var(--muted)';
    const questionCount = Number(calcResult?.danmaku?.questionCount || 0);
    const danmakuCount = Number(calcResult?.danmaku?.danmakuCount || 0);
    const questionRate = Number(calcResult?.danmaku?.questionRate || 0);
    const commentRate = Number(calcResult?.comments?.questionRate || 0);
    return React.createElement("div", {
      style: {
        maxWidth: 700,
        margin: '0 auto',
        padding: '28px 24px 60px'
      }
    }, React.createElement("div", {
      style: {
        textAlign: 'center',
        marginBottom: 40
      }
    }, React.createElement("div", {
      style: {
        fontSize: 40,
        marginBottom: 12,
        animation: 'floatY 3s ease-in-out infinite'
      }
    }, "\uD83E\uDDEE"), React.createElement("h2", {
      style: {
        fontSize: 28,
        fontWeight: 900,
        marginBottom: 8
      }
    }, "\u8FF7\u60D1\u6307\u6570\u8BA1\u7B97\u5668"), React.createElement("p", {
      style: {
        color: 'var(--muted)',
        fontSize: 14
      }
    }, "输入 BV 号或 B 站视频网址，直接统计弹幕和评论里的疑问信号")), React.createElement("div", {
      style: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 28,
        marginBottom: 24
      }
    }, React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, React.createElement("input", {
      value: input,
      onChange: e => {
        setInput(e.target.value.trim());
        setError('');
      },
      onKeyDown: e => {
        if (e.key === 'Enter') calculate();
      },
      placeholder: "输入 BV 号或视频网址，例如：https://www.bilibili.com/video/BV1xx411c7mD",
      style: {
        width: '100%',
        background: 'var(--card2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '14px 16px',
        color: 'var(--txt)',
        fontSize: 15,
        fontFamily: 'inherit',
        height: 48,
        outline: 'none',
        lineHeight: 1.6
      }
    }), error && React.createElement("div", {
      style: {
        marginTop: 10,
        color: 'var(--red)',
        fontSize: 12
      }
    }, error)), React.createElement("button", {
      onClick: calculate,
      disabled: stage === 'scanning' || !input.trim(),
      style: {
        width: '100%',
        background: 'linear-gradient(135deg,var(--blue),var(--blue-d))',
        border: 'none',
        borderRadius: 14,
        padding: '14px',
        color: 'white',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        opacity: stage === 'scanning' || !input.trim() ? .5 : 1,
        boxShadow: '0 6px 20px rgba(0,161,214,.3)'
      }
    }, stage === 'scanning' ? '分析中…' : '🧮 开始分析')), stage === 'scanning' && React.createElement("div", {
      style: {
        background: 'var(--card)',
        border: '1px solid rgba(0,229,255,.2)',
        borderRadius: 16,
        padding: 20
      }
    }, React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--qc)',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--qc)',
        animation: 'pulse .8s infinite'
      }
    }), "实时分析中"), logs.map((l, i) => React.createElement("div", {
      key: i,
      style: {
        fontSize: 12,
        color: 'var(--txt2)',
        padding: '4px 0',
        borderBottom: '1px solid var(--border)',
        animation: 'fadeInUp .3s ease both',
        animationDelay: `${i * .05}s`
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--qc)',
        marginRight: 8
      }
    }, "\u203A"), l)), React.createElement("div", {
      style: {
        position: 'relative',
        height: 3,
        background: 'rgba(0,229,255,.1)',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 12
      }
    }, React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '30%',
        background: 'linear-gradient(90deg,transparent,var(--qc),transparent)',
        animation: 'shimmer 1s linear infinite'
      }
    }))), stage === 'result' && React.createElement("div", {
      style: {
        background: 'var(--card)',
        border: `1px solid ${getColor(score)}44`,
        borderRadius: 20,
        padding: 28,
        textAlign: 'center',
        animation: 'fadeInUp .5s ease',
        position: 'relative',
        overflow: 'hidden'
      }
    }, qExplosion && [...Array(8)].map((_, i) => React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 900,
        color: 'var(--qc)',
        animation: 'qExplode .8s ease forwards',
        left: `${10 + i * 10}%`,
        top: `${20 + Math.sin(i) * 30}%`,
        animationDelay: `${i * .05}s`,
        opacity: .8
      }
    }, "\uFF1F")), React.createElement("div", {
      style: {
        fontSize: 72,
        fontWeight: 900,
        color: getColor(score),
        textShadow: `0 0 30px ${getColor(score)}88`,
        animation: 'floatY 2s ease-in-out infinite',
        lineHeight: 1,
        marginBottom: 8
      }
    }, score), React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: getColor(score),
        marginBottom: 12
      }
    }, getLabel(score)), React.createElement(QBar, {
      value: score
    }), React.createElement("div", {
      style: {
        marginTop: 16,
        fontSize: 13,
        color: 'var(--txt2)',
        lineHeight: 1.7
      }
    }, "「", calcResult?.title || input, "」", React.createElement("br", null), "疑问指数为 ", React.createElement("span", {
      style: {
        color: getColor(score),
        fontWeight: 700
      }
    }, score, "/100"), React.createElement("br", null), "问号弹幕 ", questionCount.toLocaleString(), " 条 · 弹幕疑问率 ", (questionRate * 100).toFixed(2), "%", React.createElement("br", null), "总弹幕 ", danmakuCount.toLocaleString(), " 条 · 评论疑问率 ", (commentRate * 100).toFixed(2), "%"), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        marginTop: 20
      }
    }, React.createElement("button", {
      onClick: () => {
        setStage('idle');
        setInput('');
        setCalcResult(null);
        setError('');
      },
      style: {
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '8px 18px',
        color: 'var(--muted)',
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, "\u518D\u7B97\u4E00\u6B21"))));
  }
  function DetailPage({
    vid,
    onBack,
    onShare
  }) {
    const [tab, setTab] = useState('timeline');
    const [analysis, setAnalysis] = useState(null);
    useEffect(() => {
      if (!vid?.bvid) {
        setAnalysis(null);
        return;
      }
      let cancelled = false;
      fetch(`/api/video/${vid.bvid}/analysis`).then(res => res.ok ? res.json() : null).then(data => {
        if (!cancelled) setAnalysis(data);
      }).catch(() => {
        if (!cancelled) setAnalysis(null);
      });
      return () => {
        cancelled = true;
      };
    }, [vid?.bvid]);
    if (!vid) return null;
    const fallbackVid = {
      title: '未知视频',
      uploader: '未知 UP',
      uploadTime: '未知',
      tags: [],
      questionIndex: 1,
      plays: '0',
      danmaku: '0',
      commentQuestionRate: 0,
      duration: '--:--',
      timeline: [],
      peaks: [],
      comments: [],
      trend: [1, 1, 1],
      src: {
        d: 100,
        c: 0,
        t: 0
      },
      ...vid
    };
    const analysisTimeline = analysis?.danmaku?.timeline || [];
    const analysisComments = analysis?.comments?.samples || [];
    const detailVid = {
      ...fallbackVid,
      timeline: analysisTimeline.length > 0 ? analysisTimeline.map(item => ({
        t: Number(item.start || 0),
        v: Number(item.questionCount || 0)
      })) : fallbackVid.timeline,
      peaks: analysisTimeline.length > 0 ? analysisTimeline.slice(0, 5).map(item => ({
        time: `${Math.floor(Number(item.start || 0) / 60)}:${String(Number(item.start || 0) % 60).padStart(2, '0')}`,
        label: '？'.repeat(Math.max(1, Math.min(12, Number(item.questionCount || 0)))),
        count: Number(item.questionCount || 0)
      })) : fallbackVid.peaks,
      comments: analysisComments.length > 0 ? analysisComments.map(item => ({
        user: item.uname || '匿名用户',
        text: item.message || '',
        likes: Number(item.like || 0)
      })) : fallbackVid.comments,
      trend: Array.isArray(fallbackVid.trend) && fallbackVid.trend.length > 0 ? fallbackVid.trend : [1, 1, Number(fallbackVid.questionIndex || 1)],
      tags: parseVideoTags(analysis?.tags).length > 0 ? parseVideoTags(analysis.tags) : Array.isArray(fallbackVid.tags) ? fallbackVid.tags.slice(0, 3) : [],
      src: fallbackVid.src || {
        d: 100,
        c: 0,
        t: 0
      }
    };
    return React.createElement("div", {
      style: {
        minHeight: '100vh',
        paddingTop: 28,
        paddingBottom: 60
      }
    }, React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px'
      }
    }, React.createElement("button", {
      onClick: onBack,
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--muted)',
        cursor: 'pointer',
        fontSize: 13,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'inherit',
        padding: 0
      }
    }, "\u2190 \u8FD4\u56DE"), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(280px,360px) 1fr',
        gap: 28,
        marginBottom: 32
      }
    }, React.createElement("div", {
      style: {
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,.4)'
      }
    }, React.createElement("div", {
      style: {
        paddingTop: '62%',
        position: 'relative'
      }
    }, React.createElement(Cover, {
      vid: detailVid,
      style: {
        position: 'absolute',
        inset: 0
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,.2)'
      }
    }, React.createElement("button", {
      onClick: () => openBilibiliVideo(detailVid),
      title: "打开 B 站视频",
      style: {
        width: 54,
        height: 54,
        borderRadius: '50%',
        background: 'rgba(0,0,0,.7)',
        border: '2px solid rgba(255,255,255,.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: 'white',
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, "\u25B6")))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, React.createElement("h1", {
      style: {
        fontSize: 'clamp(15px,2vw,24px)',
        fontWeight: 900,
        lineHeight: 1.5,
        textWrap: 'pretty'
      }
    }, detailVid.title), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,var(--blue),var(--pink))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 900,
        color: 'white'
      }
    }, (detailVid.uploader || 'U')[0]), React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, detailVid.uploader), React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, detailVid.uploadTime))), React.createElement(Tags, {
      tags: detailVid.tags
    }), React.createElement("div", {
      style: {
        background: 'linear-gradient(135deg,rgba(255,71,87,.08),rgba(255,107,53,.08))',
        border: '1px solid rgba(255,71,87,.2)',
        borderRadius: 14,
        padding: 14
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--muted)',
        marginBottom: 4
      }
    }, "\u7591\u95EE\u6307\u6570"), React.createElement("div", {
      style: {
        fontSize: 44,
        fontWeight: 900,
        color: 'var(--red)',
        lineHeight: 1
      }
    }, detailVid.questionIndex, React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "\uD83D\uDD25")), React.createElement(QBar, {
      value: detailVid.questionIndex
    })), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8
      }
    }, [{
      l: '播放量',
      v: detailVid.plays
    }, {
      l: '弹幕量',
      v: detailVid.danmaku
    }, {
      l: '弹幕问号率',
      v: `${detailVid.commentQuestionRate}%`
    }].map(({
      l,
      v
    }) => React.createElement("div", {
      key: l,
      style: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '9px 10px'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--muted)',
        marginBottom: 2
      }
    }, l), React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700
      }
    }, v)))), React.createElement("button", {
      onClick: () => onShare(vid),
      style: {
        background: 'linear-gradient(135deg,var(--pink),#e05585)',
        border: 'none',
        borderRadius: 22,
        padding: '9px 20px',
        color: 'white',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        alignSelf: 'flex-start',
        boxShadow: '0 6px 20px rgba(251,114,153,.3)'
      }
    }, "\uD83C\uDCCF \u751F\u6210\u5206\u4EAB\u5361\u7247"))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        marginBottom: 16,
        borderBottom: '1px solid var(--border)'
      }
    }, [{
      id: 'timeline',
      l: '疑问时间轴'
    }, {
      id: 'comments',
      l: '评论分析'
    }, {
      id: 'stats',
      l: '数据详情'
    }].map(t => React.createElement("button", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        background: 'none',
        border: 'none',
        padding: '9px 16px',
        color: tab === t.id ? 'var(--blue)' : 'var(--muted)',
        borderBottom: tab === t.id ? '2px solid var(--blue)' : '2px solid transparent',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, t.l))), React.createElement("div", {
      style: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 22
      }
    }, tab === 'timeline' && React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--qc)'
      }
    }, "\u3030\uFE0F"), " \u5F39\u5E55\u95EE\u53F7\u6CE2\u5F62\u56FE ", React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)',
        fontWeight: 400
      }
    }, "\u7EA2\u8272=\u95EE\u53F7\u7206\u53D1\u533A\u95F4")), React.createElement(Waveform, {
      tl: detailVid.timeline,
      peaks: detailVid.peaks
    })), tab === 'comments' && React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 14
      }
    }, "\uD83D\uDCAC \u6700\u8FF7\u60D1\u8BC4\u8BBA"), (detailVid.comments || []).length === 0 && React.createElement("div", {
      style: {
        color: 'var(--muted)',
        fontSize: 13,
        padding: 14,
        background: 'var(--card2)',
        borderRadius: 12,
        border: '1px solid var(--border)'
      }
    }, "\u6682\u65E0\u7591\u95EE\u8BC4\u8BBA\u6837\u672C\uFF0C\u53EF\u80FD\u662F\u8BC4\u8BBA\u63A5\u53E3\u672A\u8FD4\u56DE\u6216\u8BE5\u89C6\u9891\u8BC4\u8BBA\u8F83\u5C11\u3002"), (detailVid.comments || []).map((c, i) => React.createElement("div", {
      key: i,
      style: {
        background: 'var(--card2)',
        borderRadius: 12,
        padding: 14,
        border: '1px solid var(--border)',
        marginBottom: 10
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 7
      }
    }, React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: i === 0 ? 'linear-gradient(135deg,#00A1D6,#0066aa)' : i === 1 ? 'linear-gradient(135deg,#fb7299,#d44474)' : 'linear-gradient(135deg,#ffd700,#aa8800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 900,
        color: 'white'
      }
    }, (c.user || '匿')[0]), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600
      }
    }, c.user), React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, "\uD83D\uDC4D ", (c.likes / 1000).toFixed(1), "k")), React.createElement("div", {
      style: {
        fontSize: 14,
        lineHeight: 1.7
      }
    }, c.text)))), tab === 'stats' && React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 14
      }
    }, "\uD83D\uDCC8 \u7591\u95EE\u6307\u6570\u8D8B\u52BF"), React.createElement(TrendCanvas, {
      data: (detailVid.trend || [1, 1, detailVid.questionIndex]).map(v => ({
        v
      })),
      height: 120
    }), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        color: 'var(--muted)',
        marginTop: 4,
        marginBottom: 20
      }
    }, React.createElement("span", null, "\u4E0A\u7EBF\u65F6"), React.createElement("span", null, "\u73B0\u5728")), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
        gap: 10
      }
    }, [{
      l: '疑问指数',
      v: `${detailVid.questionIndex}/100`,
      c: 'var(--red)'
    }, {
      l: '播放量',
      v: detailVid.plays,
      c: 'var(--blue)'
    }, {
      l: '弹幕量',
      v: detailVid.danmaku,
      c: 'var(--qc)'
    }, {
      l: '弹幕问号率',
      v: `${detailVid.commentQuestionRate}%`,
      c: 'var(--pink)'
    }, {
      l: '时长',
      v: detailVid.duration,
      c: 'var(--gold)'
    }, {
      l: '上传时间',
      v: detailVid.uploadTime,
      c: 'var(--txt2)'
    }].map(({
      l,
      v,
      c
    }) => React.createElement("div", {
      key: l,
      style: {
        background: 'var(--card2)',
        borderRadius: 12,
        padding: 12,
        border: '1px solid var(--border)'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--muted)',
        marginBottom: 3
      }
    }, l), React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 900,
        color: c
      }
    }, v))))))));
  }
  function ShareCard({
    vid,
    onClose
  }) {
    const qs = '？'.repeat(Math.max(1, Math.round(vid.questionIndex / 12)));
    return React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)'
      },
      onClick: onClose
    }, React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        width: 380,
        background: 'var(--card)',
        borderRadius: 24,
        border: '1px solid rgba(0,161,214,.3)',
        boxShadow: '0 30px 80px rgba(0,0,0,.5)',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        height: 8,
        background: 'linear-gradient(90deg,var(--blue),var(--pink),var(--qc))'
      }
    }), React.createElement("div", {
      style: {
        padding: 26
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 18
      }
    }, React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 9,
        background: 'linear-gradient(135deg,var(--blue),var(--pink))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 15,
        color: 'white'
      }
    }, "?"), React.createElement("span", {
      style: {
        fontWeight: 900,
        fontSize: 14,
        color: 'var(--blue)'
      }
    }, "\u95EE\u53F7\u6392\u884C\u699C")), React.createElement("div", {
      style: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,.3)'
      }
    }, React.createElement("div", {
      style: {
        paddingTop: '54%',
        position: 'relative'
      }
    }, React.createElement(Cover, {
      vid: vid,
      style: {
        position: 'absolute',
        inset: 0
      }
    }))), React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 34,
        fontWeight: 900,
        letterSpacing: 4,
        color: 'var(--qc)',
        textShadow: '0 0 30px rgba(0,229,255,.5)',
        marginBottom: 10,
        animation: 'floatY 3s ease-in-out infinite'
      }
    }, qs), React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 14,
        lineHeight: 1.5
      }
    }, vid.title), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
        marginBottom: 16
      }
    }, [{
      l: '疑问指数',
      v: `${vid.questionIndex}🔥`,
      c: 'var(--red)'
    }, {
      l: '播放量',
      v: vid.plays,
      c: 'var(--blue)'
    }, {
      l: '弹幕问号率',
      v: `${vid.commentQuestionRate}%`,
      c: 'var(--pink)'
    }].map(({
      l,
      v,
      c
    }) => React.createElement("div", {
      key: l,
      style: {
        background: 'var(--bg)',
        borderRadius: 9,
        padding: '9px 7px',
        textAlign: 'center',
        border: '1px solid var(--border)'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 900,
        color: c
      }
    }, v), React.createElement("div", {
      style: {
        fontSize: 9,
        color: 'var(--muted)',
        marginTop: 2
      }
    }, l)))), React.createElement(Tags, {
      tags: vid.tags
    }), React.createElement("div", {
      style: {
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--muted)'
      }
    }, "\u8FD9\u89C6\u9891\u95EE\u53F7\u7206\u4E86 \uFF1F\uFF1F\uFF1F"), React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--blue)',
        background: 'rgba(0,161,214,.08)',
        borderRadius: 6,
        padding: '3px 8px',
        border: '1px solid rgba(0,161,214,.2)'
      }
    }, "qlist.app")))), React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 36,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,.35)',
        fontSize: 12
      }
    }, "\u70B9\u51FB\u7A7A\u767D\u5904\u5173\u95ED"));
  }
  function App() {
    const {
      TweaksPanel,
      TweakSection,
      TweakToggle,
      TweakRadio,
      TweakColor,
      useTweaks
    } = window;
    const TWEAK_DEFAULTS = {
      "accentColor": "#00A1D6",
      "showDanmaku": true,
      "heroIdx": "0"
    };
    const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [page, setPage] = useState('home');
    const [selVid, setSelVid] = useState(null);
    const [shareVid, setShareVid] = useState(null);
    const [compareList, setCompareList] = useState([]);
    const [compareMode, setCompareMode] = useState(false);
    const homeData = useHomeData();
    const hallData = useHallData();
    const vids = homeData.videos;
    const heroVid = vids[parseInt(tweaks.heroIdx) || 0] || vids[0];
    const goDetail = useCallback(v => {
      setSelVid(v);
      setPage('detail');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, []);
    const goHome = useCallback(() => {
      setPage('home');
      window.scrollTo({
        top: 0
      });
    }, []);
    const openShare = useCallback(v => setShareVid(v), []);
    const toggleCompare = useCallback(vid => {
      setCompareList(prev => {
        if (prev.includes(vid.id)) return prev.filter(id => id !== vid.id);
        if (prev.length >= 2) return [prev[1], vid.id];
        return [...prev, vid.id];
      });
    }, []);
    const handleNavPage = useCallback(p => {
      setPage(p);
      if (p === 'compare') setCompareMode(true);else setCompareMode(false);
      window.scrollTo({
        top: 0
      });
    }, []);
    return React.createElement("div", {
      style: {
        minHeight: '100vh',
        position: 'relative'
      }
    }, React.createElement(DanmakuEngine, null), tweaks.showDanmaku && React.createElement(FloatingQs, null), React.createElement(Navbar, {
      page: page,
      setPage: handleNavPage
    }), React.createElement("main", {
      style: {
        position: 'relative',
        zIndex: 1,
        paddingTop: 92
      }
    }, page === 'home' && React.createElement(React.Fragment, null, React.createElement(Hero, {
      vid: heroVid,
      onSelect: goDetail,
      onShare: openShare,
      stats: homeData.stats,
      loading: homeData.loading
    }), React.createElement(Leaderboard, {
      onSelect: goDetail,
      compareMode: false,
      onCompare: () => {},
      compareList: [],
      homeData: homeData
    }), React.createElement("div", {
      style: {
        height: 80
      }
    })), page === 'detail' && React.createElement(DetailPage, {
      vid: selVid || vids[0],
      onBack: () => setPage('home'),
      onShare: openShare
    }), page === 'hall' && React.createElement(HallOfFame, {
      onBack: () => setPage('home'),
      videos: hallData.videos,
      onSelect: goDetail,
      loading: hallData.loading,
      error: hallData.error
    }), page === 'compare' && React.createElement(ComparePage, {
      videos: vids
    }), page === 'calc' && React.createElement(ConfusionCalc, null)), shareVid && React.createElement(ShareCard, {
      vid: shareVid,
      onClose: () => setShareVid(null)
    }), React.createElement(TweaksPanel, null, React.createElement(TweakSection, {
      title: "\u5916\u89C2"
    }, React.createElement(TweakColor, {
      id: "accentColor",
      label: "\u4E3B\u8272\u8C03",
      value: tweaks.accentColor,
      onChange: v => setTweak('accentColor', v)
    }), React.createElement(TweakToggle, {
      id: "showDanmaku",
      label: "\u6D6E\u52A8\u95EE\u53F7\u80CC\u666F",
      value: tweaks.showDanmaku,
      onChange: v => setTweak('showDanmaku', v)
    })), React.createElement(TweakSection, {
      title: "Hero \u89C6\u9891"
    }, React.createElement(TweakRadio, {
      id: "heroIdx",
      label: "\u9009\u62E9\u89C6\u9891",
      value: tweaks.heroIdx,
      options: vids.map((v, i) => ({
        value: String(i),
        label: `视频 ${i + 1}`
      })),
      onChange: v => setTweak('heroIdx', v)
    }))));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
})();

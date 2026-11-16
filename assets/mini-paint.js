(() => {
  'use strict';

  const LANG_STORAGE_KEY = 'aderion-language';

  const I18N = {
    tr: {
      title: 'Çizim Stüdyosu — Aderion Studios',
      brandAria: 'Aderion Studios ana sayfa',
      eyebrow: 'STÜDYO TUVALİ',
      studioHeading: 'Çizim <em>stüdyosu.</em>',
      bgGroupAria: 'Tuval Arka Planı',
      bgLight: 'Açık',
      bgLightTitle: 'Açık Arka Plan',
      bgDark: 'Koyu',
      bgDarkTitle: 'Koyu Arka Plan',
      bgTransparent: 'Şeffaf',
      bgTransparentTitle: 'Şeffaf Damalı',
      undo: '↶ Geri Al',
      undoTitle: 'Geri Al (Ctrl+Z)',
      redo: '↷ İleri Al',
      redoTitle: 'İleri Al (Ctrl+Y / Ctrl+Shift+Z)',
      clear: '✕ Temizle',
      clearTitle: 'Tuvali Temizle',
      exportPng: '⬇ PNG İndir',
      exportPngTitle: 'PNG Olarak İndir',
      themeLight: 'Açık',
      themeDark: 'Koyu',
      themeToLight: 'Açık temaya geç',
      themeToDark: 'Koyu temaya geç',
      langToggleAria: 'Dili İngilizce olarak değiştir',
      toolDockAria: 'Çizim Araçları',
      toolPen: 'Kalem',
      toolPenTitle: 'Kalem (B)',
      toolSoft: 'Yumuşak',
      toolSoftTitle: 'Yumuşak Fırça',
      toolCalligraphy: 'Kaligrafi',
      toolCalligraphyTitle: 'Kaligrafi (Eğim / Tilt Destekli)',
      toolEraser: 'Silgi',
      toolEraserTitle: 'Silgi (E)',
      toolLine: 'Çizgi',
      toolLineTitle: 'Çizgi',
      toolRect: 'Kare',
      toolRectTitle: 'Dikdörtgen',
      toolCircle: 'Daire',
      toolCircleTitle: 'Daire / Elips',
      toolFill: 'Doldur',
      toolFillTitle: 'Boya Kovası / Doldur (G)',
      toolEyedropper: 'Damlalık',
      toolEyedropperTitle: 'Damlalık / Renk Seç (I)',
      stageHint: 'Kısayollar: <b>Ctrl+Z</b> Geri Al · <b>Ctrl+Y</b> İleri Al · <b>[ / ]</b> Boyut · Kalem arkasını çevirince otomatik <b>Silgi</b> aktif olur',
      panelTelemetry: 'Tablet Telemetrisi',
      statusReady: 'Hazır',
      statusDrawing: 'Çiziliyor',
      statusEraser: 'Kalem Arkası Silgi',
      hudPointerLabel: 'İşaretçi',
      hudTiltLabel: 'Eğim (X° / Y°)',
      hudPressureLabel: 'Basınç',
      hudEffectiveSizeLabel: 'Etkin Boyut',
      panelBrush: 'Fırça Ayarları',
      brushSize: 'Boyut',
      brushOpacity: 'Opaklık',
      brushSmoothing: 'Yumuşatma',
      pressureSize: 'Basınç → Boyut',
      pressureOpacity: 'Basınç → Opaklık',
      pressureCurve: 'Basınç Eğrisi',
      curveSoft: 'Yumuşak',
      curveLinear: 'Doğrusal',
      curveFirm: 'Sert',
      panelPalette: 'Renk Paleti',
      colorPickerAria: 'Renk Seçici'
    },
    en: {
      title: 'Drawing Studio — Aderion Studios',
      brandAria: 'Aderion Studios home',
      eyebrow: 'STUDIO CANVAS',
      studioHeading: 'Drawing <em>studio.</em>',
      bgGroupAria: 'Canvas Background',
      bgLight: 'Light',
      bgLightTitle: 'Light Background',
      bgDark: 'Dark',
      bgDarkTitle: 'Dark Background',
      bgTransparent: 'Transparent',
      bgTransparentTitle: 'Transparent Checkerboard',
      undo: '↶ Undo',
      undoTitle: 'Undo (Ctrl+Z)',
      redo: '↷ Redo',
      redoTitle: 'Redo (Ctrl+Y / Ctrl+Shift+Z)',
      clear: '✕ Clear',
      clearTitle: 'Clear Canvas',
      exportPng: '⬇ Export PNG',
      exportPngTitle: 'Download as PNG',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeToLight: 'Switch to light theme',
      themeToDark: 'Switch to dark theme',
      langToggleAria: 'Switch language to Turkish',
      toolDockAria: 'Drawing Tools',
      toolPen: 'Pen',
      toolPenTitle: 'Pen (B)',
      toolSoft: 'Soft',
      toolSoftTitle: 'Soft Brush',
      toolCalligraphy: 'Calligraphy',
      toolCalligraphyTitle: 'Calligraphy (Tilt Supported)',
      toolEraser: 'Eraser',
      toolEraserTitle: 'Eraser (E)',
      toolLine: 'Line',
      toolLineTitle: 'Line',
      toolRect: 'Rect',
      toolRectTitle: 'Rectangle',
      toolCircle: 'Circle',
      toolCircleTitle: 'Circle / Ellipse',
      toolFill: 'Fill',
      toolFillTitle: 'Paint Bucket / Fill (G)',
      toolEyedropper: 'Picker',
      toolEyedropperTitle: 'Eyedropper / Color Picker (I)',
      stageHint: 'Shortcuts: <b>Ctrl+Z</b> Undo · <b>Ctrl+Y</b> Redo · <b>[ / ]</b> Size · Flipping the stylus automatically activates <b>Eraser</b>',
      panelTelemetry: 'Tablet Telemetry',
      statusReady: 'Ready',
      statusDrawing: 'Drawing',
      statusEraser: 'Stylus Eraser',
      hudPointerLabel: 'Pointer',
      hudTiltLabel: 'Tilt (X° / Y°)',
      hudPressureLabel: 'Pressure',
      hudEffectiveSizeLabel: 'Effective Size',
      panelBrush: 'Brush Settings',
      brushSize: 'Size',
      brushOpacity: 'Opacity',
      brushSmoothing: 'Smoothing',
      pressureSize: 'Pressure → Size',
      pressureOpacity: 'Pressure → Opacity',
      pressureCurve: 'Pressure Curve',
      curveSoft: 'Soft',
      curveLinear: 'Linear',
      curveFirm: 'Firm',
      panelPalette: 'Color Palette',
      colorPickerAria: 'Color Picker'
    }
  };

  function detectBrowserLocale() {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'tr' || saved === 'en') {
        return saved;
      }
    } catch (_) {}

    const navLang = (Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || '';
    return /^tr(?:-|$)/i.test(navLang) ? 'tr' : 'en';
  }

  let currentLang = detectBrowserLocale();

  // Theme Sync (matches assets/theme-init.js & assets/main.js)
  const rootEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const langToggleBtn = document.getElementById('langToggle');
  const langOptEls = document.querySelectorAll('[data-lang-opt]');

  function syncThemeUI(theme) {
    const isDark = theme === 'dark';
    const t = I18N[currentLang];
    rootEl.dataset.theme = isDark ? 'dark' : 'light';
    rootEl.style.colorScheme = isDark ? 'dark' : 'light';
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#101824' : '#f8f9fc');
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', String(isDark));
      const actionText = isDark ? t.themeToLight : t.themeToDark;
      themeToggleBtn.setAttribute('aria-label', actionText);
      themeToggleBtn.title = actionText;
    }
    if (themeLabel) {
      themeLabel.textContent = isDark ? t.themeDark : t.themeLight;
    }
  }

  themeToggleBtn?.addEventListener('click', () => {
    const next = rootEl.dataset.theme === 'dark' ? 'light' : 'dark';
    syncThemeUI(next);
    try {
      localStorage.setItem('aderion-theme', next);
    } catch (_) {}
  });

  // Canvas & Contexts
  const frame = document.getElementById('canvas-frame');
  const paintCanvas = document.getElementById('paint-canvas');
  const strokeCanvas = document.getElementById('stroke-canvas');
  const previewCanvas = document.getElementById('preview-canvas');

  const paintCtx = paintCanvas.getContext('2d', { willReadFrequently: true });
  const strokeCtx = strokeCanvas.getContext('2d');
  const previewCtx = previewCanvas.getContext('2d');

  const CANVAS_W = paintCanvas.width;
  const CANVAS_H = paintCanvas.height;

  // State
  const state = {
    tool: 'pen',
    activeDrawTool: 'pen',
    color: '#1e293b',
    size: 12,
    opacity: 1.0,
    stabilizer: 25,
    pressureSize: true,
    pressureOpacity: false,
    pressureCurve: 'linear',
    bgMode: 'light',
    isDrawing: false,
    activePointerId: null,
    isInvertedEraser: false,
    lastX: 0,
    lastY: 0,
    smoothX: 0,
    smoothY: 0,
    startX: 0,
    startY: 0,
    lastRadius: 6,
    history: [],
    historyIndex: -1,
    maxHistory: 40
  };

  const SWATCHES = [
    '#0f172a', '#1e293b', '#64748b', '#cbd5e1', '#ffffff', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#78350f'
  ];

  // UI Elements
  const toolButtons = document.querySelectorAll('.tool-btn[data-tool]');
  const bgButtons = document.querySelectorAll('[data-bg]');
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  const btnClear = document.getElementById('btn-clear');
  const btnExport = document.getElementById('btn-export');

  const ctrlSize = document.getElementById('ctrl-size');
  const ctrlOpacity = document.getElementById('ctrl-opacity');
  const ctrlStabilizer = document.getElementById('ctrl-stabilizer');
  const ctrlPressureSize = document.getElementById('ctrl-pressure-size');
  const ctrlPressureOpacity = document.getElementById('ctrl-pressure-opacity');
  const curveButtons = document.querySelectorAll('[data-curve]');
  const ctrlColor = document.getElementById('ctrl-color');

  const valSize = document.getElementById('val-size');
  const valOpacity = document.getElementById('val-opacity');
  const valStabilizer = document.getElementById('val-stabilizer');
  const valColor = document.getElementById('val-color');
  const swatchGrid = document.getElementById('swatch-grid');

  const hudPointer = document.getElementById('hud-pointer');
  const hudTilt = document.getElementById('hud-tilt');
  const hudPressure = document.getElementById('hud-pressure');
  const hudPressureBar = document.getElementById('hud-pressure-bar');
  const hudEffectiveSize = document.getElementById('hud-effective-size');
  const hudMode = document.getElementById('hud-mode');

  // Initialize Swatches
  function renderSwatches() {
    swatchGrid.innerHTML = '';
    for (const hex of SWATCHES) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch' + (hex.toLowerCase() === state.color.toLowerCase() ? ' active' : '');
      btn.style.background = hex;
      btn.title = hex.toUpperCase();
      btn.addEventListener('click', () => setColor(hex));
      swatchGrid.appendChild(btn);
    }
  }

  function setColor(hex) {
    state.color = hex;
    ctrlColor.value = hex;
    valColor.textContent = hex.toUpperCase();
    renderSwatches();
  }

  function setTool(tool) {
    state.tool = tool;
    toolButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
  }

  // History Management (40 steps)
  function pushHistory() {
    const snapshot = paintCtx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    if (state.historyIndex < state.history.length - 1) {
      state.history = state.history.slice(0, state.historyIndex + 1);
    }
    state.history.push(snapshot);
    if (state.history.length > state.maxHistory) {
      state.history.shift();
    } else {
      state.historyIndex++;
    }
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
  }

  function undo() {
    if (state.historyIndex <= 0) return;
    state.historyIndex--;
    paintCtx.putImageData(state.history[state.historyIndex], 0, 0);
    updateHistoryButtons();
  }

  function redo() {
    if (state.historyIndex >= state.history.length - 1) return;
    state.historyIndex++;
    paintCtx.putImageData(state.history[state.historyIndex], 0, 0);
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    btnUndo.disabled = state.historyIndex <= 0;
    btnRedo.disabled = state.historyIndex >= state.history.length - 1;
  }

  // Coordinate & Stylus Helpers
  function getCanvasPoint(e) {
    const rect = paintCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return { x: 0, y: 0 };
    }
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function isPenEraserEvent(e) {
    return e.pointerType === 'pen' && ((e.buttons & 32) !== 0 || e.button === 5);
  }

  const PRESSURE_CURVES = {
    soft: (p) => Math.pow(p, 0.65),
    linear: (p) => p,
    firm: (p) => Math.pow(p, 1.65)
  };

  function applyPressureCurve(p) {
    const clamped = Math.max(0, Math.min(1, p));
    const curveFn = PRESSURE_CURVES[state.pressureCurve] || PRESSURE_CURVES.linear;
    return curveFn(clamped);
  }

  function getEffectivePressure(e) {
    if (e.pointerType === 'pen') {
      if (e.buttons > 0) {
        return applyPressureCurve(Math.max(0.03, Math.min(1, e.pressure || 0.03)));
      }
      return applyPressureCurve(Math.max(0, Math.min(1, e.pressure || 0)));
    }
    // Fallback for mouse/touch where pressure is constant
    return e.buttons > 0 ? applyPressureCurve(1.0) : 0.0;
  }

  function syncHudMode() {
    const t = I18N[currentLang];
    if (state.isInvertedEraser) {
      hudMode.textContent = t.statusEraser;
      hudMode.classList.add('eraser-active');
    } else {
      hudMode.textContent = state.isDrawing ? t.statusDrawing : t.statusReady;
      hudMode.classList.remove('eraser-active');
    }
  }

  function setLanguage(lang, persist = false) {
    currentLang = lang === 'tr' ? 'tr' : 'en';
    const t = I18N[currentLang];
    rootEl.setAttribute('lang', currentLang);
    document.title = t.title;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const val = t[el.dataset.i18n];
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const val = t[el.dataset.i18nHtml];
      if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const val = t[el.dataset.i18nTitle];
      if (val !== undefined) el.title = val;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const val = t[el.dataset.i18nAria];
      if (val !== undefined) el.setAttribute('aria-label', val);
    });

    langOptEls.forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.langOpt === currentLang);
    });

    if (langToggleBtn) {
      langToggleBtn.setAttribute('aria-label', t.langToggleAria);
      langToggleBtn.title = t.langToggleAria;
    }

    syncThemeUI(rootEl.dataset.theme === 'dark' ? 'dark' : 'light');
    syncHudMode();

    if (persist) {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, currentLang);
      } catch (_) {}
    }
  }

  langToggleBtn?.addEventListener('click', () => {
    setLanguage(currentLang === 'tr' ? 'en' : 'tr', true);
  });

  function updateTelemetry(e, invertedEraser) {
    const pType = e.pointerType || 'mouse';
    const rawPressure = typeof e.pressure === 'number' ? e.pressure : 0;
    const tx = Math.round(e.tiltX || 0);
    const ty = Math.round(e.tiltY || 0);

    hudPointer.textContent = pType;
    hudTilt.textContent = `${tx}° / ${ty}°`;
    hudPressure.textContent = rawPressure.toFixed(2);
    hudPressureBar.style.width = `${Math.round(Math.max(0, Math.min(1, rawPressure)) * 100)}%`;

    const isActive = e.buttons > 0 || (pType === 'pen' && rawPressure > 0);
    if (isActive) {
      const effPressure = getEffectivePressure(e);
      const effWidth = getDynamicRadius(effPressure) * 2;
      hudEffectiveSize.textContent = `${effWidth.toFixed(1)} px`;
    } else {
      hudEffectiveSize.textContent = '--';
    }

    state.isInvertedEraser = Boolean(invertedEraser);
    syncHudMode();

    const eraserBtn = document.querySelector('.tool-btn[data-tool="eraser"]');
    if (eraserBtn) {
      eraserBtn.classList.toggle('temp-eraser', Boolean(invertedEraser));
    }
  }

  // Brush Cursor Preview on #preview-canvas
  function drawCursorPreview(x, y, tool, e) {
    previewCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    if (tool === 'fill' || tool === 'eyedropper') {
      previewCtx.save();
      previewCtx.strokeStyle = 'rgba(59, 108, 255, 0.9)';
      previewCtx.lineWidth = 1.5;
      previewCtx.beginPath();
      previewCtx.moveTo(x - 8, y);
      previewCtx.lineTo(x + 8, y);
      previewCtx.moveTo(x, y - 8);
      previewCtx.lineTo(x, y + 8);
      previewCtx.stroke();
      previewCtx.restore();
      return;
    }

    const radius = Math.max(1, state.size / 2);
    previewCtx.save();
    previewCtx.strokeStyle = state.bgMode === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.75)';
    previewCtx.lineWidth = 1.25;
    previewCtx.beginPath();

    if (tool === 'calligraphy') {
      const { angle, flatRatio } = getCalligraphyMetrics(e);
      previewCtx.ellipse(x, y, radius, Math.max(1.5, radius * flatRatio), angle, 0, Math.PI * 2);
    } else {
      previewCtx.arc(x, y, radius, 0, Math.PI * 2);
    }
    previewCtx.stroke();

    // Subtle outer contrast ring
    previewCtx.strokeStyle = state.bgMode === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.65)';
    previewCtx.lineWidth = 0.8;
    previewCtx.stroke();
    previewCtx.restore();
  }

  function getCalligraphyMetrics(e) {
    const tx = e ? (e.tiltX || 0) : 0;
    const ty = e ? (e.tiltY || 0) : 0;
    const hasTilt = Math.abs(tx) > 2 || Math.abs(ty) > 2;
    const angle = hasTilt ? Math.atan2(ty, tx) : -Math.PI / 4;
    const tiltMag = hasTilt ? Math.min(1, Math.hypot(tx, ty) / 60) : 0.35;
    const flatRatio = Math.max(0.18, 0.42 - tiltMag * 0.2);
    return { angle, flatRatio };
  }

  // Freehand Drawing Engines
  function getDynamicRadius(pressure) {
    const base = state.size / 2;
    if (!state.pressureSize) return base;
    return Math.max(0.5, base * (0.12 + 0.88 * pressure));
  }

  function getDynamicAlpha(pressure) {
    if (!state.pressureOpacity) return 1.0;
    return Math.max(0.08, Math.min(1.0, 0.1 + 0.9 * pressure));
  }

  function stampPenSegment(ctx, x0, y0, x1, y1, r0, r1, color, alpha, isEraser) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / Math.max(0.8, Math.min(r0, r1) * 0.35)));

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
    }
    ctx.globalAlpha = alpha;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const r = r0 + (r1 - r0) * t;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function stampSoftSegment(ctx, x0, y0, x1, y1, r0, r1, color, alpha) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / Math.max(1.2, Math.min(r0, r1) * 0.25)));

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const r = Math.max(1.5, r0 + (r1 - r0) * t);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, hexToRgba(color, 0.28 * alpha));
      grad.addColorStop(0.5, hexToRgba(color, 0.12 * alpha));
      grad.addColorStop(1, hexToRgba(color, 0));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function stampCalligraphySegment(ctx, x0, y0, x1, y1, r0, r1, color, alpha, e) {
    const { angle, flatRatio } = getCalligraphyMetrics(e);
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / 1.5));

    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const r = Math.max(1, r0 + (r1 - r0) * t);
      ctx.beginPath();
      ctx.ellipse(x, y, r, Math.max(1, r * flatRatio), angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Shape Drawing
  function drawShape(ctx, tool, x0, y0, x1, y1, isPreview) {
    ctx.save();
    ctx.strokeStyle = state.color;
    ctx.lineWidth = state.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = isPreview ? state.opacity : state.opacity;

    ctx.beginPath();
    if (tool === 'line') {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    } else if (tool === 'rect') {
      ctx.rect(x0, y0, x1 - x0, y1 - y0);
    } else if (tool === 'circle') {
      const rx = Math.abs(x1 - x0) / 2;
      const ry = Math.abs(y1 - y0) / 2;
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Scanline Flood Fill
  function floodFill(startX, startY, fillHex) {
    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    if (sx < 0 || sx >= CANVAS_W || sy < 0 || sy >= CANVAS_H) return;

    const imgData = paintCtx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    const data = imgData.data;
    const fillRgb = hexToRgb(fillHex);
    const fillAlpha = Math.round(state.opacity * 255);

    const startIdx = (sy * CANVAS_W + sx) * 4;
    const tr = data[startIdx];
    const tg = data[startIdx + 1];
    const tb = data[startIdx + 2];
    const ta = data[startIdx + 3];

    if (
      Math.abs(tr - fillRgb.r) <= 2 &&
      Math.abs(tg - fillRgb.g) <= 2 &&
      Math.abs(tb - fillRgb.b) <= 2 &&
      Math.abs(ta - fillAlpha) <= 2
    ) {
      return;
    }

    const tolerance = 28;
    const visited = new Uint8Array(CANVAS_W * CANVAS_H);
    const stack = [sx, sy];

    function matches(pixelPos) {
      const idx = pixelPos * 4;
      return (
        Math.abs(data[idx] - tr) <= tolerance &&
        Math.abs(data[idx + 1] - tg) <= tolerance &&
        Math.abs(data[idx + 2] - tb) <= tolerance &&
        Math.abs(data[idx + 3] - ta) <= tolerance
      );
    }

    function setPixel(pixelPos) {
      const idx = pixelPos * 4;
      data[idx] = fillRgb.r;
      data[idx + 1] = fillRgb.g;
      data[idx + 2] = fillRgb.b;
      data[idx + 3] = fillAlpha;
    }

    while (stack.length > 0) {
      const y = stack.pop();
      const x = stack.pop();
      let currX = x;
      let pos = y * CANVAS_W + currX;

      if (visited[pos] || !matches(pos)) continue;

      while (currX > 0 && !visited[pos - 1] && matches(pos - 1)) {
        currX--;
        pos--;
      }

      let spanAbove = false;
      let spanBelow = false;

      while (currX < CANVAS_W && !visited[pos] && matches(pos)) {
        visited[pos] = 1;
        setPixel(pos);

        if (y > 0) {
          const upPos = pos - CANVAS_W;
          const upMatch = !visited[upPos] && matches(upPos);
          if (!spanAbove && upMatch) {
            stack.push(currX, y - 1);
            spanAbove = true;
          } else if (spanAbove && !upMatch) {
            spanAbove = false;
          }
        }

        if (y < CANVAS_H - 1) {
          const downPos = pos + CANVAS_W;
          const downMatch = !visited[downPos] && matches(downPos);
          if (!spanBelow && downMatch) {
            stack.push(currX, y + 1);
            spanBelow = true;
          } else if (spanBelow && !downMatch) {
            spanBelow = false;
          }
        }

        currX++;
        pos++;
      }
    }

    paintCtx.putImageData(imgData, 0, 0);
    pushHistory();
  }

  // Eyedropper
  function pickColorAt(x, y) {
    const px = Math.max(0, Math.min(CANVAS_W - 1, Math.floor(x)));
    const py = Math.max(0, Math.min(CANVAS_H - 1, Math.floor(y)));
    const pixel = paintCtx.getImageData(px, py, 1, 1).data;

    if (pixel[3] === 0) {
      if (state.bgMode === 'light') setColor('#ffffff');
      else if (state.bgMode === 'dark') setColor('#181a20');
      else setColor('#64748b');
      return;
    }
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setColor(hex);
  }

  // Color Utils
  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  }

  // Pointer Event Handlers
  paintCanvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.button !== 5 && e.pointerType === 'mouse') return;
    e.preventDefault();

    const inverted = isPenEraserEvent(e);
    state.isInvertedEraser = inverted;
    state.activeDrawTool = inverted ? 'eraser' : state.tool;

    updateTelemetry(e, inverted);
    const pt = getCanvasPoint(e);

    if (state.activeDrawTool === 'eyedropper') {
      pickColorAt(pt.x, pt.y);
      return;
    }

    if (state.activeDrawTool === 'fill') {
      floodFill(pt.x, pt.y, state.color);
      return;
    }

    paintCanvas.setPointerCapture(e.pointerId);
    state.isDrawing = true;
    state.activePointerId = e.pointerId;
    state.startX = pt.x;
    state.startY = pt.y;
    state.lastX = pt.x;
    state.lastY = pt.y;
    state.smoothX = pt.x;
    state.smoothY = pt.y;

    const pressure = getEffectivePressure(e);
    const radius = getDynamicRadius(pressure);
    const alpha = getDynamicAlpha(pressure);
    state.lastRadius = radius;

    if (state.activeDrawTool === 'pen' || state.activeDrawTool === 'soft' || state.activeDrawTool === 'calligraphy') {
      strokeCanvas.style.opacity = String(state.opacity);
      strokeCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      if (state.activeDrawTool === 'pen') {
        stampPenSegment(strokeCtx, pt.x, pt.y, pt.x, pt.y, radius, radius, state.color, alpha, false);
      } else if (state.activeDrawTool === 'soft') {
        stampSoftSegment(strokeCtx, pt.x, pt.y, pt.x, pt.y, radius, radius, state.color, alpha);
      } else {
        stampCalligraphySegment(strokeCtx, pt.x, pt.y, pt.x, pt.y, radius, radius, state.color, alpha, e);
      }
    } else if (state.activeDrawTool === 'eraser') {
      stampPenSegment(paintCtx, pt.x, pt.y, pt.x, pt.y, radius, radius, '#000', state.opacity, true);
    }

    updateTelemetry(e, inverted);
  });

  paintCanvas.addEventListener('pointermove', (e) => {
    const inverted = isPenEraserEvent(e);
    const hoverTool = inverted ? 'eraser' : state.tool;
    updateTelemetry(e, inverted);

    const pt = getCanvasPoint(e);
    if (!state.isDrawing || e.pointerId !== state.activePointerId) {
      drawCursorPreview(pt.x, pt.y, hoverTool, e);
      return;
    }

    const coalesced = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : null;
    const events = coalesced && coalesced.length > 0 ? coalesced : [e];

    const drawTool = state.activeDrawTool;
    const smoothAlpha = 1 - (state.stabilizer / 100) * 0.88;

    for (const ev of events) {
      const p = getCanvasPoint(ev);
      state.smoothX += (p.x - state.smoothX) * smoothAlpha;
      state.smoothY += (p.y - state.smoothY) * smoothAlpha;

      const x = state.smoothX;
      const y = state.smoothY;
      const pressure = getEffectivePressure(ev);
      const radius = getDynamicRadius(pressure);
      const alpha = getDynamicAlpha(pressure);

      if (drawTool === 'pen') {
        stampPenSegment(strokeCtx, state.lastX, state.lastY, x, y, state.lastRadius, radius, state.color, alpha, false);
      } else if (drawTool === 'soft') {
        stampSoftSegment(strokeCtx, state.lastX, state.lastY, x, y, state.lastRadius, radius, state.color, alpha);
      } else if (drawTool === 'calligraphy') {
        stampCalligraphySegment(strokeCtx, state.lastX, state.lastY, x, y, state.lastRadius, radius, state.color, alpha, ev);
      } else if (drawTool === 'eraser') {
        stampPenSegment(paintCtx, state.lastX, state.lastY, x, y, state.lastRadius, radius, '#000', state.opacity, true);
      } else if (drawTool === 'line' || drawTool === 'rect' || drawTool === 'circle') {
        previewCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        drawShape(previewCtx, drawTool, state.startX, state.startY, p.x, p.y, true);
      }

      state.lastX = x;
      state.lastY = y;
      state.lastRadius = radius;
    }

    if (drawTool !== 'line' && drawTool !== 'rect' && drawTool !== 'circle') {
      drawCursorPreview(state.lastX, state.lastY, drawTool, e);
    }
  });

  function finishPointer(e, isCancel) {
    if (!state.isDrawing || e.pointerId !== state.activePointerId) return;

    if (paintCanvas.hasPointerCapture(e.pointerId)) {
      paintCanvas.releasePointerCapture(e.pointerId);
    }

    const drawTool = state.activeDrawTool;
    if (!isCancel) {
      if (drawTool === 'pen' || drawTool === 'soft' || drawTool === 'calligraphy') {
        paintCtx.save();
        paintCtx.globalAlpha = state.opacity;
        paintCtx.drawImage(strokeCanvas, 0, 0);
        paintCtx.restore();
        strokeCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        pushHistory();
      } else if (drawTool === 'eraser') {
        pushHistory();
      } else if (drawTool === 'line' || drawTool === 'rect' || drawTool === 'circle') {
        const pt = getCanvasPoint(e);
        drawShape(paintCtx, drawTool, state.startX, state.startY, pt.x, pt.y, false);
        pushHistory();
      }
    } else {
      strokeCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    }

    previewCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    state.isDrawing = false;
    state.activePointerId = null;
    state.isInvertedEraser = false;
    updateTelemetry(e, false);
  }

  paintCanvas.addEventListener('pointerup', (e) => finishPointer(e, false));
  paintCanvas.addEventListener('pointercancel', (e) => finishPointer(e, true));
  paintCanvas.addEventListener('pointerleave', () => {
    if (!state.isDrawing) {
      previewCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      hudEffectiveSize.textContent = '--';
    }
  });
  paintCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

  // UI Bindings
  toolButtons.forEach((btn) => {
    btn.addEventListener('click', () => setTool(btn.dataset.tool));
  });

  bgButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.bgMode = btn.dataset.bg;
      bgButtons.forEach((b) => b.classList.toggle('active', b === btn));
      frame.classList.remove('bg-light', 'bg-dark', 'bg-transparent');
      frame.classList.add(`bg-${state.bgMode}`);
    });
  });

  ctrlSize.addEventListener('input', () => {
    state.size = Number(ctrlSize.value);
    valSize.textContent = `${state.size} px`;
  });

  ctrlOpacity.addEventListener('input', () => {
    const pct = Number(ctrlOpacity.value);
    state.opacity = pct / 100;
    valOpacity.textContent = `${pct}%`;
  });

  ctrlStabilizer.addEventListener('input', () => {
    state.stabilizer = Number(ctrlStabilizer.value);
    valStabilizer.textContent = `${state.stabilizer}%`;
  });

  ctrlPressureSize.addEventListener('change', () => {
    state.pressureSize = ctrlPressureSize.checked;
  });

  ctrlPressureOpacity.addEventListener('change', () => {
    state.pressureOpacity = ctrlPressureOpacity.checked;
  });

  curveButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.pressureCurve = btn.dataset.curve || 'linear';
      curveButtons.forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  ctrlColor.addEventListener('input', () => setColor(ctrlColor.value));

  btnUndo.addEventListener('click', undo);
  btnRedo.addEventListener('click', redo);

  btnClear.addEventListener('click', () => {
    paintCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    pushHistory();
  });

  btnExport.addEventListener('click', () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = CANVAS_W;
    exportCanvas.height = CANVAS_H;
    const exCtx = exportCanvas.getContext('2d');

    if (state.bgMode === 'light') {
      exCtx.fillStyle = '#ffffff';
      exCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    } else if (state.bgMode === 'dark') {
      exCtx.fillStyle = '#181a20';
      exCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    exCtx.drawImage(paintCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = `mini-paint-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
      return;
    }
    if (e.target.tagName === 'INPUT') return;

    const k = e.key.toLowerCase();
    if (k === 'b') setTool('pen');
    else if (k === 'e') setTool('eraser');
    else if (k === 'g') setTool('fill');
    else if (k === 'i') setTool('eyedropper');
    else if (k === '[') {
      state.size = Math.max(1, state.size - 3);
      ctrlSize.value = String(state.size);
      valSize.textContent = `${state.size} px`;
    } else if (k === ']') {
      state.size = Math.min(80, state.size + 3);
      ctrlSize.value = String(state.size);
      valSize.textContent = `${state.size} px`;
    }
  });

  // Startup
  setLanguage(currentLang, false);
  renderSwatches();
  setColor(state.color);
  pushHistory();
})();

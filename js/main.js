// ============================================================
// 个人简历网站 · 主逻辑 main.js
// ============================================================

(function () {
  'use strict';

  // ── DOM 引用 ──────────────────────────────────────────────
  const modalOverlay = document.getElementById('modal-overlay');
  const modalPanel   = document.getElementById('modal-panel');
  const modalBody    = document.getElementById('modal-body');
  const modalClose   = document.getElementById('modal-close');
  const darkOverlay  = document.getElementById('dark-overlay');
  const lampGlow     = document.getElementById('lamp-glow');
  const darkQuote    = document.getElementById('dark-quote');
  const inkTrail     = document.getElementById('ink-trail');
  const inkPath      = document.getElementById('ink-path');

  let currentModalType = null;
  let notebookSpread   = 0;
  let isDarkMode       = false;

  // ── 桌面物品点击 ──────────────────────────────────────────
  document.querySelectorAll('.desk-item').forEach(item => {
    item.addEventListener('click', () => {
      const modalType = item.dataset.modal;
      if (modalType === 'lamp') {
        toggleDarkMode();
        return;
      }
      if (modalType === 'pen') {
        animatePen(item, () => openModal(modalType));
        return;
      }
      openModal(modalType);
    });
  });

  // ── 弹窗关闭 ──────────────────────────────────────────────
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── 打开弹窗 ──────────────────────────────────────────────
  function openModal(type) {
    currentModalType = type;
    notebookSpread = 0;
    modalBody.innerHTML = '';
    modalPanel.className = 'modal-panel';

    const sizeMap = {
      calendar:     'size-calendar',
      photoframe:   'size-photoframe',
      pen:          'size-pen',
      phone:        'size-phone',
      businesscard: 'size-businesscard',
      notebook:     'size-notebook'
    };
    if (sizeMap[type]) modalPanel.classList.add(sizeMap[type]);

    switch (type) {
      case 'calendar':     buildCalendar(); break;
      case 'photoframe':   buildPhotoFrame(); break;
      case 'pen':          buildPen(); break;
      case 'phone':        buildPhone(); break;
      case 'businesscard': buildBusinessCard(); break;
      case 'notebook':     buildNotebook(); break;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentModalType = null;
    setTimeout(() => {
      if (!modalOverlay.classList.contains('active')) {
        modalBody.innerHTML = '';
      }
    }, 400);
  }

  // ══════════════════════════════════════════════════════════
  // 弹窗内容构建
  // ══════════════════════════════════════════════════════════

  function buildCalendar() {
    const data = APP_DATA.experiences;
    let html = '<h3 class="timeline-header">工作 / 实习经历</h3><ul class="timeline-list">';
    data.forEach(exp => {
      html += `<li class="timeline-item">
        <div class="timeline-year">${esc(exp.year)}</div>
        <div class="timeline-detail">
          <h4>${esc(exp.title)}</h4>
          <p>${esc(exp.desc)}</p>
          <div class="timeline-tags">${exp.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </div></li>`;
    });
    html += '</ul>';
    modalBody.innerHTML = html;
  }

  function buildPhotoFrame() {
    const d = APP_DATA.about;
    let html = `<div class="about-bio"><p>${esc(d.bio)}</p></div>`;
    html += '<h4 class="about-timeline-title">个人时间轴</h4><ul class="about-timeline">';
    d.timeline.forEach(tl => {
      html += `<li class="about-tl-item">
        <span class="about-tl-year">${esc(tl.year)}</span>
        <span class="about-tl-dot"></span>
        <span class="about-tl-event">${esc(tl.event)}</span></li>`;
    });
    html += '</ul>';
    modalBody.innerHTML = html;
  }

  function buildPen() {
    const data = APP_DATA.skills;
    const icons = ['🎬', '📱', '📊', '🤖', '🌍'];
    let html = '<h3 class="skills-header">我的技能树</h3><ul class="skills-list">';
    data.forEach((s, i) => {
      html += `<li class="skill-item">
        <span class="skill-icon">${icons[i] || '✨'}</span>
        <div class="skill-info"><h4>${esc(s.name)}</h4><p>${esc(s.description)}</p></div></li>`;
    });
    html += '</ul>';
    modalBody.innerHTML = html;
  }

  function buildPhone() {
    const d = APP_DATA.personalAccounts;
    let html = '<h3 class="phone-header">个人自媒体账号</h3><div class="phone-cards">';

    html += `<div class="platform-card xiaohongshu">
      <div class="platform-icon">📕</div><h4>${esc(d.xiaohongshu.name)}</h4>
      <p class="platform-desc">${esc(d.xiaohongshu.description)}</p>
      <div class="platform-works">${d.xiaohongshu.works.map(w => `<a href="${esc(w.url)}" target="_blank" rel="noopener">📎 ${esc(w.title)}</a>`).join('')}</div>
      <a href="${esc(d.xiaohongshu.url)}" class="platform-action-btn" target="_blank" rel="noopener">前往主页</a></div>`;

    html += `<div class="platform-card douyin">
      <div class="platform-icon">🎵</div><h4>${esc(d.douyin.name)}</h4>
      <p class="platform-desc">${esc(d.douyin.description)}</p>
      <div class="platform-works">${d.douyin.works.map(w => `<a href="${esc(w.url)}" target="_blank" rel="noopener">📎 ${esc(w.title)}</a>`).join('')}</div>
      <button class="platform-action-btn btn-qr" data-platform="douyin">扫码查看</button>
      <div class="qr-popup" id="qr-douyin"><img src="${esc(d.douyin.qrCode)}" alt="抖音二维码" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><p class="qr-fallback" style="display:none;">请使用抖音 App 扫码</p></div></div>`;

    html += `<div class="platform-card wechat">
      <div class="platform-icon">💬</div><h4>${esc(d.wechat.name)}</h4>
      <p class="platform-desc">${esc(d.wechat.description)}</p>
      <div class="platform-works">${d.wechat.works.map(w => `<a href="${esc(w.url)}" target="_blank" rel="noopener">📎 ${esc(w.title)}</a>`).join('')}</div>
      <button class="platform-action-btn btn-qr" data-platform="wechat">扫码查看</button>
      <div class="qr-popup" id="qr-wechat"><img src="${esc(d.wechat.qrCode)}" alt="公众号二维码" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><p class="qr-fallback" style="display:none;">请使用微信扫码关注</p></div></div>`;

    html += '</div>';
    modalBody.innerHTML = html;

    modalBody.querySelectorAll('.btn-qr').forEach(btn => {
      btn.addEventListener('click', () => {
        const qrEl = document.getElementById('qr-' + btn.dataset.platform);
        if (qrEl) {
          const open = qrEl.classList.contains('show');
          modalBody.querySelectorAll('.qr-popup').forEach(q => q.classList.remove('show'));
          if (!open) qrEl.classList.add('show');
        }
      });
    });
  }

  function buildBusinessCard() {
    const d = APP_DATA.contact;
    let html = '<h3 class="contact-header">联系我</h3>';
    html += `<div class="contact-item"><span class="contact-icon">📧</span><div><div class="contact-label">邮箱</div><div class="contact-value">${esc(d.email)}</div></div><button class="contact-copy" data-copy="${esc(d.email)}">复制</button></div>`;
    html += `<div class="contact-item"><span class="contact-icon">📱</span><div><div class="contact-label">手机号</div><div class="contact-value">${esc(d.phone)}</div></div><button class="contact-copy" data-copy="${esc(d.phone)}">复制</button></div>`;
    modalBody.innerHTML = html;

    modalBody.querySelectorAll('.contact-copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta);
        }
        btn.textContent = '已复制 ✓'; btn.classList.add('copied');
        setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
      });
    });
  }

  function buildNotebook() {
    notebookSpread = 0;
    renderSpread();
  }

  function renderSpread() {
    const data = APP_DATA.portfolio;
    const spread = data[notebookSpread];
    const total = data.length;
    const isFirst = notebookSpread === 0;
    const isLast  = notebookSpread === total - 1;

    let html = '<div class="notebook-container">';
    html += '<h3 class="book-header">品牌运营作品集</h3>';
    html += '<div class="book-spread-wrapper"><div class="book-spine-shadow"></div><div class="book-spread active-spread">';

    html += `<div class="book-page left"><h4>${esc(spread.account.name)}</h4>
      <p class="page-subtitle">${esc(spread.account.platform)}`;
    if (spread.account.avatar) html += ` <img src="${esc(spread.account.avatar)}" alt="avatar" style="width:20px;height:20px;border-radius:50%;vertical-align:middle;">`;
    html += `</p><div class="page-stats">${esc(spread.account.stats)}</div></div>`;
    html += '<div style="background:linear-gradient(90deg,rgba(0,0,0,0.03),rgba(0,0,0,0.06),rgba(0,0,0,0.03));"></div>';
    html += '<div class="book-page right"><h4>代表作品</h4><div class="works-grid">';

    spread.works.forEach(w => {
      html += '<div class="work-card">';
      if (w.cover) {
        html += `<img src="${esc(w.cover)}" alt="${esc(w.title)}" class="work-card-img" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`;
        html += `<div class="work-card-img-placeholder" style="display:none;">📷 ${esc(w.title)}</div>`;
      } else {
        html += `<div class="work-card-img-placeholder">📷 ${esc(w.title)}</div>`;
      }
      html += '<div class="work-card-info">';
      html += `<h5>${esc(w.title)}</h5><div class="work-type">${esc(w.type)}</div>`;
      if (w.stats) html += `<div class="work-stats">${esc(w.stats)}</div>`;
      if (w.desc)  html += `<div class="work-desc">${esc(w.desc)}</div>`;
      html += '</div></div>';
    });

    html += '</div></div></div></div>'; // close grids and spread and wrapper

    html += '<div class="book-nav">';
    html += `<button class="book-nav-btn prev" ${isFirst ? 'disabled' : ''}>← 上一页</button>`;
    html += `<span class="book-page-indicator">${notebookSpread + 1} / ${total}</span>`;
    html += `<button class="book-nav-btn next" ${isLast ? 'disabled' : ''}>下一页 →</button>`;
    html += '</div></div>';

    modalBody.innerHTML = html;

    modalBody.querySelector('.book-nav-btn.prev').addEventListener('click', () => {
      if (notebookSpread > 0) { notebookSpread--; flipRender(); }
    });
    modalBody.querySelector('.book-nav-btn.next').addEventListener('click', () => {
      if (notebookSpread < total - 1) { notebookSpread++; flipRender(); }
    });
  }

  function flipRender() {
    const spread = modalBody.querySelector('.active-spread');
    if (!spread) { renderSpread(); return; }
    spread.style.transition = 'opacity 300ms ease-in-out, transform 300ms ease-in-out';
    spread.style.opacity = '0';
    spread.style.transform = 'rotateY(-15deg) scale(0.96)';
    setTimeout(() => {
      renderSpread();
      requestAnimationFrame(() => {
        const ns = modalBody.querySelector('.active-spread');
        if (ns) {
          ns.style.opacity = '0';
          ns.style.transform = 'rotateY(10deg) scale(0.96)';
          requestAnimationFrame(() => {
            ns.style.transition = 'opacity 400ms ease-out, transform 400ms ease-out';
            ns.style.opacity = '1';
            ns.style.transform = 'rotateY(0) scale(1)';
          });
        }
      });
    }, 320);
  }

  // ── 台灯 → 暗黑/暖光模式 ──────────────────────────────────
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);

    // 引文浮现/消失
    if (isDarkMode) {
      darkQuote.classList.add('show');
    } else {
      darkQuote.classList.remove('show');
    }

    const lamp = document.getElementById('item-lamp');
    if (lamp) {
      lamp.style.transition = 'transform 300ms ease';
      lamp.style.transform = 'scale(1.15)';
      setTimeout(() => { lamp.style.transform = ''; }, 300);
    }
    updateGlow();
  }

  function updateGlow() {
    const lamp = document.getElementById('item-lamp');
    if (!lamp) return;
    const r = lamp.getBoundingClientRect();
    // 光晕中心定位到台灯灯泡位置（灯罩下方）
    lampGlow.style.left = (r.left + r.width / 2) + 'px';
    lampGlow.style.top  = (r.top + r.height * 0.35) + 'px';
  }

  // ── 圆珠笔动画 ────────────────────────────────────────────
  function animatePen(item, cb) {
    item.classList.add('pen-animating');
    setTimeout(() => drawInk(item, () => {
      item.classList.remove('pen-animating');
      cb();
    }), 250);
  }

  function drawInk(item, cb) {
    const r = item.getBoundingClientRect();
    const tx = r.left + r.width * 0.15;
    const ty = r.top + r.height / 2;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const d = `M ${tx} ${ty} Q ${(tx+cx)/2} ${ty-80}, ${cx} ${cy}`;
    inkPath.setAttribute('d', d);
    inkPath.style.strokeDasharray = '2000';
    inkPath.style.strokeDashoffset = '2000';
    inkTrail.classList.add('active');
    requestAnimationFrame(() => inkPath.classList.add('draw'));
    setTimeout(() => {
      inkTrail.classList.remove('active');
      inkPath.classList.remove('draw');
      cb();
    }, 520);
  }

  // ── resize ────────────────────────────────────────────────
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (isDarkMode) updateGlow(); }, 200);
  });

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  updateGlow();
})();

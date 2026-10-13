// 楊梅高中分機一覽表 - 互動網頁主控腳本
// 包含檢索搜尋、分類篩選、一鍵複製、電話直撥、我的最愛、虛擬撥號盤與無障礙放大

document.addEventListener('DOMContentLoaded', () => {
  // DOM 元素引用
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchStatus = document.getElementById('searchStatus');
  const categoryPills = document.getElementById('categoryPills');
  const deptJumpLinks = document.getElementById('deptJumpLinks');
  const directoryGrid = document.getElementById('directoryGrid');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const fontSizeBtn = document.getElementById('fontSizeBtn');
  const printBtn = document.getElementById('printBtn');
  const pdfViewBtn = document.getElementById('pdfViewBtn');
  const dialpadFab = document.getElementById('dialpadFab');
  const dialpadModal = document.getElementById('dialpadModal');
  const pdfModal = document.getElementById('pdfModal');
  const toastContainer = document.getElementById('toastContainer');

  // 撥號盤元素
  const dialDisplay = document.getElementById('dialDisplay');
  const dialLookup = document.getElementById('dialLookup');
  const dialpadKeys = document.querySelectorAll('.dial-key');
  const dialDelBtn = document.getElementById('dialDelBtn');
  const dialCallBtn = document.getElementById('dialCallBtn');

  // 狀態管理
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let favorites = JSON.parse(localStorage.getItem('ymsh_favorites') || '[]');
  let dialInputString = '';

  // 字體大小設定 (normal, large, xlarge)
  const fontSizes = ['normal', 'large', 'xlarge'];
  const fontSizeLabels = {
    'normal': '標準字體 A',
    'large': '大字體 A+',
    'xlarge': '特大字 A++'
  };
  let currentFontSize = localStorage.getItem('ymsh_font_size') || 'normal';
  applyFontSize(currentFontSize);

  // 初始化音效按鈕狀態
  updateSoundButtonUI();

  // 初始化全域分機號碼反查字典 (以利撥號盤即時反查)
  const extensionLookupMap = {};
  DIRECTORY_SECTIONS.forEach(sec => {
    sec.items.forEach(it => {
      it.ext.forEach(extNum => {
        extensionLookupMap[extNum] = {
          dept: sec.title,
          category: sec.categoryName,
          title: it.title,
          name: it.name || '',
          color: sec.color
        };
      });
    });
  });

  // ----------------------------------------------------
  // 1. 渲染處室跳轉捷徑 (Jump Nav)
  // ----------------------------------------------------
  function renderJumpLinks() {
    deptJumpLinks.innerHTML = DIRECTORY_SECTIONS.map(s => `
      <a href="#dept-${s.id}" class="jump-item" data-id="${s.id}">
        ${s.title}
      </a>
    `).join('');

    deptJumpLinks.querySelectorAll('.jump-item').forEach(link => {
      link.addEventListener('click', (e) => {
        window.soundMgr.playClick();
      });
    });
  }

  // ----------------------------------------------------
  // 2. 核心渲染卡片列表 (支援即時檢索、高亮與分類篩選)
  // ----------------------------------------------------
  function renderCards() {
    const query = currentSearchQuery.trim().toLowerCase();
    const isFavOnly = currentCategory === 'favorites';

    let totalMatchedSections = 0;
    let totalMatchedItems = 0;

    const cardsHtml = DIRECTORY_SECTIONS.map(section => {
      // 分類過濾 (非全選且非最愛時)
      if (currentCategory !== 'all' && currentCategory !== 'favorites' && section.category !== currentCategory) {
        return '';
      }

      // 檢查此處室內的項目是否有匹配搜尋字詞或最愛
      const matchedItems = section.items.filter((item, itemIdx) => {
        const itemKey = `${section.id}_${itemIdx}_${item.ext.join('_')}`;
        const isStarred = favorites.includes(itemKey);

        if (isFavOnly && !isStarred) return false;
        if (!query) return true;

        // 搜尋比對：處室名稱、職稱、姓名、分機、直撥電話
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchName = (item.name || '').toLowerCase().includes(query);
        const matchExt = item.ext.some(e => e.includes(query));
        const matchSection = section.title.toLowerCase().includes(query);
        const matchDeptPhone = (section.directPhone || '').includes(query);
        const matchFax = (section.fax || '').includes(query);

        return matchTitle || matchName || matchExt || matchSection || matchDeptPhone || matchFax;
      });

      if (matchedItems.length === 0) {
        return '';
      }

      totalMatchedSections++;
      totalMatchedItems += matchedItems.length;

      // 渲染卡片項目清單
      const itemsHtml = matchedItems.map((item) => {
        const itemOrigIdx = section.items.indexOf(item);
        const itemKey = `${section.id}_${itemOrigIdx}_${item.ext.join('_')}`;
        const isStarred = favorites.includes(itemKey);

        const highlightedTitle = highlightText(item.title, query);
        const highlightedName = item.name ? highlightText(item.name, query) : '';

        // 渲染分機按鈕膠囊
        const extPillsHtml = item.ext.map(extNum => {
          const highlightedExt = highlightText(extNum, query);
          return `
            <button class="ext-pill" data-ext="${extNum}" data-dept="${section.title}" data-title="${item.title}" data-name="${item.name || ''}" title="點擊複製分機 ${extNum}">
              <span class="ext-icon">📞</span>
              <span class="ext-num">${highlightedExt}</span>
            </button>
          `;
        }).join('');

        return `
          <li class="dept-item-row" data-item-key="${itemKey}">
            <div class="item-left">
              <span class="item-title">${highlightedTitle}</span>
              ${item.name ? `<span class="item-name"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${highlightedName}</span>` : ''}
            </div>
            <div class="item-right">
              ${extPillsHtml}
              <button class="star-btn ${isStarred ? 'starred' : ''}" data-key="${itemKey}" title="${isStarred ? '取消收藏' : '加入常用最愛'}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isStarred ? '#f59e0b' : 'none'}" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            </div>
          </li>
        `;
      }).join('');

      // 直撥專線與傳真標籤列
      let directLinesHtml = '';
      if (section.directPhone || section.fax) {
        directLinesHtml = `
          <div class="dept-direct-lines">
            ${section.directPhone ? `
              <span class="direct-line-badge phone" title="直撥電話">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                直撥: <strong>${highlightText(section.directPhone, query)}</strong>
              </span>
            ` : ''}
            ${section.fax ? `
              <span class="direct-line-badge fax" title="傳真電話">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="12" y2="16"/></svg>
                傳真: <strong>${highlightText(section.fax, query)}</strong>
              </span>
            ` : ''}
          </div>
        `;
      }

      return `
        <article class="dept-card" id="dept-${section.id}" style="--dept-color: ${section.color}; --dept-light: ${section.lightColor}; --dept-border: ${section.borderColor};">
          <div class="dept-card-header">
            <div class="dept-head-left">
              <div class="dept-icon-box">
                ${getCategoryIconSvg(section.icon)}
              </div>
              <div class="dept-title-group">
                <h2>${highlightText(section.title, query)}</h2>
                <span class="dept-cat-tag">${section.categoryName}</span>
              </div>
            </div>
            <div class="dept-head-right">
              <span class="pill-count" title="項目數量">${matchedItems.length} 項</span>
            </div>
          </div>
          ${directLinesHtml}
          <ul class="dept-items-list">
            ${itemsHtml}
          </ul>
        </article>
      `;
    }).join('');

    if (totalMatchedSections === 0) {
      directoryGrid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </div>
          <h3>${isFavOnly ? '目前尚無收藏的常用分機' : '查無符合條件的分機或單位'}</h3>
          <p>${isFavOnly ? '您可以點擊任何分機右側的「星號 ☆」將其加入常用分機，方便快速查閱！' : `搜尋「${escapeHtml(query)}」未找到相關資料，請嘗試不同關鍵字或切換分類。`}</p>
          <button class="btn-pill primary" id="resetFilterBtn">顯示全部分機</button>
        </div>
      `;
      document.getElementById('resetFilterBtn')?.addEventListener('click', () => {
        window.soundMgr.playClick();
        searchInput.value = '';
        currentSearchQuery = '';
        currentCategory = 'all';
        updatePillsUI();
        renderCards();
      });
    } else {
      directoryGrid.innerHTML = cardsHtml;
    }

    // 更新搜尋統計狀態文字
    if (query || isFavOnly) {
      searchStatus.textContent = `找到 ${totalMatchedSections} 個處室、共 ${totalMatchedItems} 筆分機項目`;
    } else {
      searchStatus.textContent = `顯示全部 ${totalMatchedSections} 個處所設施、共 ${totalMatchedItems} 筆分機`;
    }

    // 綁定動態事件 (分機複製、撥號、星號收藏)
    bindCardActions();
  }

  // ----------------------------------------------------
  // 3. 關鍵字高亮工具函式
  // ----------------------------------------------------
  function highlightText(text, query) {
    if (!text || !query) return escapeHtml(text || '');
    const cleanQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQuery})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark class="highlight">$1</mark>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ----------------------------------------------------
  // 4. 卡片項目互動事件綁定 (點擊分機複製與撥打、收藏)
  // ----------------------------------------------------
  function bindCardActions() {
    // 點擊分機膠囊 -> 複製分機 + 發音效 + 彈出浮動提示
    document.querySelectorAll('.ext-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ext = btn.getAttribute('data-ext');
        const dept = btn.getAttribute('data-dept');
        const title = btn.getAttribute('data-title');
        const name = btn.getAttribute('data-name');

        copyToClipboard(ext, `${dept} ${title} ${name ? '('+name+')' : ''}`);
        window.soundMgr.playSuccess();
      });
    });

    // 點擊星號收藏
    document.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-key');
        toggleFavorite(key);
      });
    });
  }

  // ----------------------------------------------------
  // 5. 複製到剪貼簿與通知 Toast
  // ----------------------------------------------------
  function copyToClipboard(text, desc) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`已複製分機號碼 ${text}`, desc);
      }).catch(() => {
        fallbackCopy(text, desc);
      });
    } else {
      fallbackCopy(text, desc);
    }
  }

  function fallbackCopy(text, desc) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(`已複製分機號碼 ${text}`, desc);
    } catch (err) {
      showToast(`分機號碼：${text}`, '請手動複製');
    }
    document.body.removeChild(textarea);
  }

  function showToast(message, subMessage = '') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <div>
        <div>${escapeHtml(message)}</div>
        ${subMessage ? `<div style="font-size: 0.82rem; color: #94a3b8; font-weight: 500;">${escapeHtml(subMessage)}</div>` : ''}
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fadeout');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // ----------------------------------------------------
  // 6. 我的最愛管理
  // ----------------------------------------------------
  function toggleFavorite(key) {
    const idx = favorites.indexOf(key);
    if (idx > -1) {
      favorites.splice(idx, 1);
      window.soundMgr.playClick();
      showToast('已從常用分機移除');
    } else {
      favorites.push(key);
      window.soundMgr.playStar();
      showToast('已加為常用分機 ⭐');
    }
    localStorage.setItem('ymsh_favorites', JSON.stringify(favorites));
    updateFavPillCount();
    renderCards();
  }

  function updateFavPillCount() {
    const favCountEl = document.getElementById('favCount');
    if (favCountEl) {
      favCountEl.textContent = favorites.length;
    }
  }

  // ----------------------------------------------------
  // 7. 分類標籤切換
  // ----------------------------------------------------
  categoryPills.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      window.soundMgr.playClick();
      const cat = pill.getAttribute('data-cat');
      currentCategory = cat;
      updatePillsUI();
      renderCards();
    });
  });

  function updatePillsUI() {
    categoryPills.querySelectorAll('.cat-pill').forEach(pill => {
      if (pill.getAttribute('data-cat') === currentCategory) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // ----------------------------------------------------
  // 8. 搜尋輸入處理
  // ----------------------------------------------------
  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    if (currentSearchQuery.trim()) {
      searchClearBtn.style.display = 'flex';
    } else {
      searchClearBtn.style.display = 'none';
    }
    renderCards();
  });

  searchClearBtn.addEventListener('click', () => {
    window.soundMgr.playClick();
    searchInput.value = '';
    currentSearchQuery = '';
    searchClearBtn.style.display = 'none';
    searchInput.focus();
    renderCards();
  });

  // 鍵盤快捷鍵：按 `/` 聚焦搜尋，按 `Escape` 清除
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !dialpadModal.classList.contains('open')) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === 'Escape') {
      if (dialpadModal.classList.contains('open')) {
        closeDialpad();
      } else if (pdfModal.classList.contains('open')) {
        closePdfModal();
      } else if (searchInput.value) {
        searchInput.value = '';
        currentSearchQuery = '';
        searchClearBtn.style.display = 'none';
        renderCards();
      }
    }
  });

  // ----------------------------------------------------
  // 9. 總機撥號與複製捷徑按鈕
  // ----------------------------------------------------
  document.querySelectorAll('.copy-sw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-num');
      const label = btn.getAttribute('data-label');
      copyToClipboard(num, `總機 ${label}`);
      window.soundMgr.playSuccess();
    });
  });

  // ----------------------------------------------------
  // 10. 音效開關控制
  // ----------------------------------------------------
  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = window.soundMgr.toggleSound();
    updateSoundButtonUI();
    showToast(isEnabled ? '已開啟互動音效 🔊' : '已關閉音效 (靜音模式) 🔇');
  });

  function updateSoundButtonUI() {
    const isEnabled = window.soundMgr.enabled;
    const soundText = document.getElementById('soundBtnText');
    const soundIcon = document.getElementById('soundBtnIcon');
    if (isEnabled) {
      soundToggleBtn.classList.add('active');
      soundText.textContent = '音效開啟';
      soundIcon.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    } else {
      soundToggleBtn.classList.remove('active');
      soundText.textContent = '靜音模式';
      soundIcon.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
    }
  }

  // ----------------------------------------------------
  // 11. 字體大小無障礙縮放控制 (避免字體太小)
  // ----------------------------------------------------
  fontSizeBtn.addEventListener('click', () => {
    window.soundMgr.playClick();
    const currIdx = fontSizes.indexOf(currentFontSize);
    const nextIdx = (currIdx + 1) % fontSizes.length;
    currentFontSize = fontSizes[nextIdx];
    localStorage.setItem('ymsh_font_size', currentFontSize);
    applyFontSize(currentFontSize);
    showToast(`已切換至：${fontSizeLabels[currentFontSize]}`);
  });

  function applyFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    const labelSpan = document.getElementById('fontSizeText');
    if (labelSpan) {
      labelSpan.textContent = fontSizeLabels[size];
    }
  }

  // ----------------------------------------------------
  // 12. 互動虛擬電話撥號盤 (DTMF 雙音多頻模擬器)
  // ----------------------------------------------------
  dialpadFab.addEventListener('click', openDialpad);
  document.getElementById('openDialpadNavBtn')?.addEventListener('click', openDialpad);

  function openDialpad() {
    window.soundMgr.playClick();
    dialpadModal.classList.add('open');
    updateDialpadDisplay();
  }

  function closeDialpad() {
    window.soundMgr.playClick();
    dialpadModal.classList.remove('open');
  }

  document.getElementById('closeDialpadBtn')?.addEventListener('click', closeDialpad);
  dialpadModal.addEventListener('click', (e) => {
    if (e.target === dialpadModal) closeDialpad();
  });

  dialpadKeys.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      window.soundMgr.playDTMF(key);
      if (dialInputString.length < 8) {
        dialInputString += key;
        updateDialpadDisplay();
      }
    });
  });

  dialDelBtn.addEventListener('click', () => {
    window.soundMgr.playClick();
    if (dialInputString.length > 0) {
      dialInputString = dialInputString.slice(0, -1);
      updateDialpadDisplay();
    }
  });

  dialCallBtn.addEventListener('click', () => {
    if (!dialInputString) {
      showToast('請先輸入分機號碼');
      return;
    }
    window.soundMgr.playRingback();
    const match = extensionLookupMap[dialInputString];
    if (match) {
      showToast(`模擬呼叫分機 ${dialInputString}`, `${match.dept} - ${match.title} ${match.name}`);
    } else {
      showToast(`模擬撥打 ${dialInputString}`, '楊梅高中語音總機');
    }

    // 手機裝置點擊後可喚起系統撥號
    setTimeout(() => {
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = `tel:03-4789618,${dialInputString}`;
      }
    }, 600);
  });

  function updateDialpadDisplay() {
    dialDisplay.textContent = dialInputString || '____';

    if (!dialInputString) {
      dialLookup.textContent = '請點選數字撥號鍵輸入分機';
      dialLookup.className = 'dialpad-lookup-info';
      return;
    }

    const match = extensionLookupMap[dialInputString];
    if (match) {
      dialLookup.innerHTML = `✨ <strong>${match.dept}</strong> · ${match.title} ${match.name ? `(${match.name})` : ''}`;
      dialLookup.className = 'dialpad-lookup-info found';
    } else {
      dialLookup.textContent = `查無此精確分機 (可按呼叫試撥總機)`;
      dialLookup.className = 'dialpad-lookup-info';
    }
  }

  // 實體鍵盤撥號支援 (當撥號盤開啟時)
  document.addEventListener('keydown', (e) => {
    if (!dialpadModal.classList.contains('open')) return;

    if ('0123456789*#'.includes(e.key)) {
      e.preventDefault();
      window.soundMgr.playDTMF(e.key);
      if (dialInputString.length < 8) {
        dialInputString += e.key;
        updateDialpadDisplay();
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (dialInputString.length > 0) {
        dialInputString = dialInputString.slice(0, -1);
        updateDialpadDisplay();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      dialCallBtn.click();
    }
  });

  // ----------------------------------------------------
  // 13. PDF 原表對照檢視彈窗
  // ----------------------------------------------------
  pdfViewBtn.addEventListener('click', () => {
    window.soundMgr.playClick();
    pdfModal.classList.add('open');
  });

  document.getElementById('closePdfBtn')?.addEventListener('click', closePdfModal);
  pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) closePdfModal();
  });

  function closePdfModal() {
    window.soundMgr.playClick();
    pdfModal.classList.remove('open');
  }

  // ----------------------------------------------------
  // 14. 列印與輸出
  // ----------------------------------------------------
  printBtn.addEventListener('click', () => {
    window.soundMgr.playClick();
    window.print();
  });

  // ----------------------------------------------------
  // 15. SVG 圖示產生輔助工具
  // ----------------------------------------------------
  function getCategoryIconSvg(iconName) {
    switch(iconName) {
      case 'award':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
      case 'users':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
      case 'badge-check':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`;
      case 'calculator':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/></svg>`;
      case 'book-open':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
      case 'wrench':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
      case 'shopping-bag':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
      case 'cpu':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`;
      case 'activity':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
      case 'shield-alert':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
      case 'heart-handshake':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      case 'library':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="19.5" x2="4" y2="4.5"/><line x1="8" y1="19.5" x2="8" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="4.5"/><line x1="16" y1="19.5" x2="16" y2="4.5"/><line x1="20" y1="19.5" x2="20" y2="4.5"/><rect x="2" y="2" width="20" height="2.5"/><rect x="2" y="19.5" width="20" height="2.5"/></svg>`;
      case 'graduation-cap':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
      case 'briefcase':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
      case 'flask-conical':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><path d="M8.5 14h7"/></svg>`;
      case 'monitor':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      case 'layers':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
      case 'building':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`;
      case 'hammer':
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 3.26-6.36 6.36"/><path d="m16.5 7.5 3 3"/></svg>`;
      default:
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
  }

  // ----------------------------------------------------
  // 16. 初次載入與初始化
  // ----------------------------------------------------
  renderJumpLinks();
  updateFavPillCount();
  renderCards();

  console.log('楊梅高中分機一覽表 互動資訊網已順利就緒！');
});

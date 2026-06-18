(function() {
  // Page loader
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => { setTimeout(() => loader.classList.add('hidden'), 400); });
  setTimeout(() => loader && loader.classList.add('hidden'), 3000);

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('eco-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌓';
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('eco-theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌓';
      showToast(next === 'dark' ? 'Dark theme enabled' : 'Light theme enabled');
    });
  }

  // Toast
  window.showToast = function(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
  });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Smooth scroll for anchor links (used in index.html single-page)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // Counter animation
  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target.toLocaleString('ru-RU');
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

  // Tree map
  const treeGrid = document.getElementById('tree-grid');
  if (treeGrid) {
    const treeData = [];
    const species = ['Дуб', 'Сосна', 'Береза', 'Тополь', 'Ясень', 'Клен', 'Ива', 'Абрикос', 'Яблоня', 'Вишня'];
    const conditions = ['healthy','healthy','healthy','good','good','good','needs-care','young','young','young'];
    const conditionLabels = { healthy:'Здоровое', good:'Хорошее', 'needs-care':'Требует ухода', young:'Молодой саженец' };
    for (let i=1; i<=60; i++) {
      treeData.push({
        id: i,
        species: species[Math.floor(Math.random()*species.length)],
        condition: conditions[Math.floor(Math.random()*conditions.length)],
        date: `202${Math.floor(Math.random()*5)+1}-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`
      });
    }

    function renderTrees(filter) {
      if (!treeGrid) return;
      treeGrid.innerHTML = '';
      const filtered = filter === 'all' ? treeData : treeData.filter(t => t.condition === filter);
      filtered.forEach(tree => {
        const dot = document.createElement('div');
        dot.className = `tree-dot ${tree.condition}`;
        dot.innerHTML = `🌳<span class="tree-tooltip">№${tree.id} • ${tree.species}<br>${tree.date} • ${conditionLabels[tree.condition]}</span>`;
        dot.addEventListener('click', () => showToast(`Дерево №${tree.id}: ${tree.species} — ${conditionLabels[tree.condition]}`));
        treeGrid.appendChild(dot);
      });
      const statTotal = document.getElementById('stat-total');
      const statHealthy = document.getElementById('stat-healthy');
      const statGood = document.getElementById('stat-good');
      const statYoung = document.getElementById('stat-young');
      const statCare = document.getElementById('stat-care');
      if (statTotal) statTotal.textContent = treeData.length;
      if (statHealthy) statHealthy.textContent = treeData.filter(t => t.condition === 'healthy').length;
      if (statGood) statGood.textContent = treeData.filter(t => t.condition === 'good').length;
      if (statYoung) statYoung.textContent = treeData.filter(t => t.condition === 'young').length;
      if (statCare) statCare.textContent = treeData.filter(t => t.condition === 'needs-care').length;
    }
    renderTrees('all');
    document.querySelectorAll('.tree-map-filters button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tree-map-filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTrees(btn.getAttribute('data-filter'));
      });
    });
  }

  // Charts (if canvas exists)
  const chartGrowth = document.getElementById('chart-growth');
  if (chartGrowth) {
    function drawBarChart(canvasId, data, color) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);
      const padding=30, chartW=w-padding*2, chartH=h-padding*2;
      const maxVal=Math.max(...data);
      const barWidth=chartW/data.length-8;
      ctx.fillStyle='#ddd';
      ctx.fillRect(padding, h-padding-chartH, chartW, 1);
      data.forEach((val,i)=>{
        const barH=(val/maxVal)*chartH;
        const x=padding+i*(chartW/data.length)+4;
        const y=h-padding-barH;
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.roundRect(x,y,barWidth,barH,[4,4,0,0]); ctx.fill();
        ctx.fillStyle='#333'; ctx.font='10px Inter, sans-serif'; ctx.textAlign='center';
        ctx.fillText(val, x+barWidth/2, y-6);
      });
    }
    function drawLineChart(canvasId, data, color) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);
      const padding=30, chartW=w-padding*2, chartH=h-padding*2;
      const maxVal=Math.max(...data);
      ctx.strokeStyle=color; ctx.lineWidth=3; ctx.beginPath();
      data.forEach((val,i)=>{
        const x=padding+i*(chartW/(data.length-1));
        const y=h-padding-(val/maxVal)*chartH;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
      data.forEach((val,i)=>{
        const x=padding+i*(chartW/(data.length-1));
        const y=h-padding-(val/maxVal)*chartH;
        ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#333'; ctx.font='10px Inter'; ctx.textAlign='center';
        ctx.fillText(val, x, y-10);
      });
    }
    setTimeout(()=>{
      drawBarChart('chart-growth', [15,22,28,35,42,50,58,65], '#0B3B24');
      drawLineChart('chart-green-index', [45,52,58,63,70,75,80,85], '#2E7D32');
      drawBarChart('chart-water', [120,140,155,170,160,180,190,200], '#4CAF50');
    },300);
  }

  // News
  const newsGrid = document.getElementById('news-grid');
  if (newsGrid) {
    const newsData = [
      { title:'Посадили 200 новых деревьев!', date:'2025-03-15', cat:'Посадка', excerpt:'Ученики и волонтеры высадили 200 саженцев на территории школы.' },
      { title:'Эко-урок для начальных классов', date:'2025-03-10', cat:'Обучение', excerpt:'Провели интерактивный урок о важности переработки отходов.' },
      { title:'Субботник в городском парке', date:'2025-02-28', cat:'Акция', excerpt:'Более 100 участников очистили парк от мусора.' },
      { title:'Новый партнер — Green KG', date:'2025-02-20', cat:'Партнерство', excerpt:'Подписали соглашение о сотрудничестве с экологической организацией.' },
      { title:'Мастер-класс по компостированию', date:'2025-02-05', cat:'Обучение', excerpt:'Научились создавать компост из органических отходов.' },
      { title:'Акция «Чистый Ош»', date:'2025-01-25', cat:'Акция', excerpt:'Присоединились к общегородской экологической акции.' }
    ];
    const newsSearch = document.getElementById('news-search');
    const newsFilterCat = document.getElementById('news-filter-cat');

    function renderNews(searchTerm = '', catFilter = 'all') {
      if (!newsGrid) return;
      newsGrid.innerHTML = '';
      const filtered = newsData.filter(n => {
        const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = catFilter === 'all' || n.cat === catFilter;
        return matchSearch && matchCat;
      });
      if (filtered.length === 0) {
        newsGrid.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);grid-column:1/-1;">Новостей не найдено</p>';
        return;
      }
      filtered.forEach(n => {
        const card = document.createElement('div');
        card.className = 'card news-card reveal';
        card.innerHTML = `<div class="news-img-placeholder">🌿</div><div class="news-body"><span class="news-cat">${n.cat}</span> <span class="news-date">${n.date}</span><h4>${n.title}</h4><p style="font-size:0.9rem;color:var(--color-text-secondary);">${n.excerpt}</p></div>`;
        newsGrid.appendChild(card);
        revealObserver.observe(card);
      });
    }
    renderNews();
    if (newsSearch) newsSearch.addEventListener('input', () => renderNews(newsSearch.value, newsFilterCat.value));
    if (newsFilterCat) newsFilterCat.addEventListener('change', () => renderNews(newsSearch.value, newsFilterCat.value));
  }

  // Gallery
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    const galleryItems = [
      { emoji: '🌳', caption: 'Территория до проекта', cat: 'before' },
      { emoji: '🌱', caption: 'Посадка саженцев', cat: 'planting' },
      { emoji: '🏞️', caption: 'Эко-фестиваль 2024', cat: 'events' },
      { emoji: '🌳', caption: 'Пустырь до озеленения', cat: 'before' },
      { emoji: '🌱', caption: 'Ученики сажают деревья', cat: 'planting' },
      { emoji: '🎉', caption: 'День Земли', cat: 'events' },
      { emoji: '🌱', caption: 'Полив саженцев', cat: 'planting' },
      { emoji: '🎉', caption: 'Награждение волонтеров', cat: 'events' },
      { emoji: '🌳', caption: 'Старый двор школы', cat: 'before' },
      { emoji: '🌱', caption: 'Новая аллея', cat: 'planting' },
      { emoji: '🎉', caption: 'Субботник', cat: 'events' },
      { emoji: '🌳', caption: 'Заброшенный участок', cat: 'before' }
    ];
    let activeFilter = 'all';
    function renderGallery(filter) {
      galleryGrid.innerHTML = '';
      const filtered = filter === 'all' ? galleryItems : galleryItems.filter(g => g.cat === filter);
      filtered.forEach(g => {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal';
        item.innerHTML = `${g.emoji}<div class="gallery-overlay">🔍</div>`;
        item.addEventListener('click', () => openLightbox(g.emoji, g.caption));
        galleryGrid.appendChild(item);
        revealObserver.observe(item);
      });
    }
    renderGallery('all');
    document.querySelectorAll('.gallery-filters button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.gallery-filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.getAttribute('data-gallery-filter'));
      });
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      const lightboxEmoji = document.getElementById('lightbox-emoji');
      const lightboxCaption = document.getElementById('lightbox-caption');
      window.openLightbox = function(emoji, caption) {
        lightboxEmoji.textContent = emoji;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
      };
      document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.remove('active'));
      lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('active'); });
    }
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    window.handleContactSubmit = function(e) {
      e.preventDefault();
      showToast('✅ Сообщение отправлено! Мы свяжемся с вами.');
      e.target.reset();
    };
  }

  // Parallax hero
  const heroParallax = document.querySelector('.hero-parallax-bg');
  if (heroParallax) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroParallax.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    });
  }

  // Initial reveal check
  setTimeout(() => {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, 200);
})();
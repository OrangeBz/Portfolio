/* ==========================================================================
   1. CAMBIO DE VISTAS (NAVEGACIÓN PRINCIPAL CON ANIMACIÓN 3D)
   ========================================================================== */
function switchView(targetId, element) {
  const currentActive = document.querySelector('.page-view.active');
  const targetView = document.getElementById(targetId);

  if (!targetView || currentActive === targetView) return;

  // Controlar la visibilidad de la burbuja social
  const socialBubble = document.getElementById('socialBubble');
  if (socialBubble) {
    if (targetId === 'home') {
      socialBubble.classList.remove('visible', 'open');
    } else {
      socialBubble.classList.add('visible');
    }
  }

  // Transición 3D: remover exiting del destino y aplicarlo al actual
  targetView.classList.remove('exiting');
  
  if (currentActive) {
    currentActive.classList.remove('active');
    currentActive.classList.add('exiting');
    setTimeout(() => {
      currentActive.classList.remove('exiting');
    }, 500);
  }

  targetView.classList.add('active');

  // Scroll suave hacia arriba al cambiar de vista
  const viewContainer = document.querySelector('main.view-container');
  if (viewContainer) {
    viewContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Actualizar estados activos de los enlaces del menú
  document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
  if (element) {
    if (element.classList.contains('subnav-link')) {
      const portfolioBtn = element.closest('.portfolio-menu-wrapper')?.querySelector('.nav-link');
      if (portfolioBtn) portfolioBtn.classList.add('active');
    } else {
      element.classList.add('active');
    }
  }

  // Actualizar el atributo data-theme del body
  document.body.setAttribute('data-theme', targetId);
}

/* ==========================================================================
   2. PESTAÑAS DE MÚSICA (MY MUSIC / SCROBBLES)
   ========================================================================== */
function switchMusicPane(paneId, btn) {
  document.querySelectorAll('.music-subpane').forEach(pane => pane.classList.remove('active'));
  document.querySelectorAll('.music-tab-btn').forEach(b => b.classList.remove('active'));
  
  const target = document.getElementById(paneId);
  if (target) {
    target.classList.add('active');
  }
  if (btn) {
    btn.classList.add('active');
  }

  const viewContainer = document.querySelector('main.view-container');
  if (viewContainer) {
    viewContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ==========================================================================
   3. MENÚ FLOTANTE SOCIAL (SOCIAL BUBBLE TOGGLE)
   ========================================================================== */
function toggleSocialBubble() {
  const bubble = document.getElementById('socialBubble');
  if (bubble) {
    bubble.classList.toggle('open');
  }
}

// Cerrar la burbuja si se hace clic afuera
document.addEventListener('click', (e) => {
  const bubble = document.getElementById('socialBubble');
  if (bubble && !bubble.contains(e.target)) {
    bubble.classList.remove('open');
  }
});

/* ==========================================================================
   4. CARGA Y RENDERIZADO DE STATS DE LAST.FM (SCROBBLES.JSON)
   ========================================================================== */
function loadScrobbles() {
  fetch('scrobbles.json')
    .then(response => {
      if (!response.ok) throw new Error("No se pudo cargar scrobbles.json");
      return response.json();
    })
    .then(data => {
      // 1. Top Artistas
      const elArtistas = document.getElementById('top-artistas-list');
      if (elArtistas) {
        if (data.top_artistas_mes && data.top_artistas_mes.length > 0) {
          elArtistas.innerHTML = data.top_artistas_mes.map(item => `
            <li class="scrobbles-item">
              <div class="scrobbles-item-left">
                <span style="color: var(--text-muted); font-family: 'Nova Square'; width: 22px;">#${item.posicion}</span>
                <strong style="color: #fff;">${item.nombre}</strong>
              </div>
              <span>${item.reproducciones} plays</span>
            </li>
          `).join('');
        } else {
          elArtistas.innerHTML = '<li>Sin datos disponibles</li>';
        }
      }

      // 2. Top Álbumes
      const elAlbumes = document.getElementById('top-albumes-list');
      if (elAlbumes) {
        if (data.top_albumes_mes && data.top_albumes_mes.length > 0) {
          elAlbumes.innerHTML = data.top_albumes_mes.map(item => `
            <li class="scrobbles-item">
              <div class="scrobbles-item-left">
                <span style="color: var(--text-muted); font-family: 'Nova Square'; width: 22px;">#${item.posicion}</span>
                ${item.portada ? `<img src="${item.portada}" class="scrobbles-cover" alt="Cover" onerror="this.onerror=null; this.style.display='none'">` : ''}
                <div>
                  <strong style="color: #fff; display: block;">${item.nombre}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${item.artista}</span>
                </div>
              </div>
            </li>
          `).join('');
        } else {
          elAlbumes.innerHTML = '<li>Sin datos disponibles</li>';
        }
      }

      // 3. Top Canciones
      const elCanciones = document.getElementById('top-canciones-list');
      if (elCanciones) {
        if (data.top_canciones_mes && data.top_canciones_mes.length > 0) {
          elCanciones.innerHTML = data.top_canciones_mes.map(item => `
            <li class="scrobbles-item">
              <div class="scrobbles-item-left">
                <span style="color: var(--text-muted); font-family: 'Nova Square'; width: 22px;">#${item.posicion}</span>
                <div>
                  <strong style="color: #fff; display: block;">${item.nombre}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${item.artista}</span>
                </div>
              </div>
            </li>
          `).join('');
        } else {
          elCanciones.innerHTML = '<li>Sin datos disponibles</li>';
        }
      }

      // 4. Historial Reciente
      const elRecientes = document.getElementById('recientes-list');
      if (elRecientes) {
        if (data.recientes && data.recientes.length > 0) {
          elRecientes.innerHTML = data.recientes.slice(0, 8).map(item => `
            <li class="scrobbles-item">
              <div class="scrobbles-item-left">
                ${item.portada ? `<img src="${item.portada}" class="scrobbles-cover" alt="Cover" onerror="this.onerror=null; this.style.display='none'">` : ''}
                <div>
                  <strong style="color: #fff; display: block;">${item.cancion}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${item.artista}${item.album ? ` — ${item.album}` : ''}</span>
                </div>
              </div>
              <span style="font-size: 0.75rem; white-space: nowrap; color: var(--text-muted);">${item.fecha}</span>
            </li>
          `).join('');
        } else {
          elRecientes.innerHTML = '<li>Sin datos disponibles</li>';
        }
      }
    })
    .catch(err => {
      console.warn("No se pudieron cargar los scrobbles locales:", err);
      const scrobblesContainer = document.getElementById('listening-scrobbles');
      if (scrobblesContainer && !scrobblesContainer.querySelector('.scrobbles-container')) {
        scrobblesContainer.innerHTML = `
          <div class="project-card">
            <p style="color: var(--text-muted); font-size: 0.85rem;">
              No se pudieron cargar las estadísticas locales de reproducción.
            </p>
          </div>
        `;
      }
    });
}

/* ==========================================================================
   5. ARQUITECTURA DINÁMICA DE ASSETS Y REPRODUCTORES DE AUDIO (Zero-Touch & Zero-404)
   ========================================================================== */
let portfolioData = {
  images: [],
  models: [],
  audio: [],
  video: [],
  other: [],
  by_folder: {},
  all: []
};

const makeSvgPlaceholder = (text, bg = '%231a1a24', fg = '%23ffffff', w = 700, h = 500) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-family='sans-serif' font-size='18'>${encodeURIComponent(text)}</text></svg>`;

function findPortfolioAsset(key, category = null) {
  if (!portfolioData || !portfolioData.all || portfolioData.all.length === 0 || !key) return null;
  const lowerKey = key.toLowerCase();
  
  const pool = (category && portfolioData[category]) ? portfolioData[category] : portfolioData.all;
  return pool.find(item => {
    const itemKey = (item.key || '').toLowerCase();
    const itemName = (item.name || '').toLowerCase();
    const itemPath = (item.path || '').toLowerCase();
    return itemKey === lowerKey || itemKey.includes(lowerKey) || itemName.includes(lowerKey) || itemPath.includes(lowerKey);
  }) || null;
}

function initDynamicPortfolio() {
  fetch('portfolio_data.json')
    .then(res => {
      if (!res.ok) throw new Error("portfolio_data.json no disponible");
      return res.json();
    })
    .then(data => {
      portfolioData = Object.assign({ images: [], models: [], audio: [], video: [], other: [], by_folder: {}, all: [] }, data);
      renderDynamicSlots();
      bindDynamicAudio();
    })
    .catch(err => {
      console.info("Modo offline / assets locales por defecto:", err.message);
      renderDynamicSlots();
      bindDynamicAudio();
    });
}

function renderDynamicSlots() {
  const slots = document.querySelectorAll('.card-media-slot');
  slots.forEach(slot => {
    const type = slot.getAttribute('data-media-type') || 'image';
    const key = slot.getAttribute('data-media-key') || '';
    const title = slot.getAttribute('data-placeholder-title') || 'Media';
    const color = slot.getAttribute('data-placeholder-color') || '%231a1a24';

    if (type === 'image') {
      const asset = findPortfolioAsset(key, 'images');
      if (asset) {
        slot.innerHTML = `<img src="${asset.path}" alt="${title}" class="card-img" onerror="this.onerror=null; this.src='${makeSvgPlaceholder(title, color, '%23ffffff', 260, 180)}'">`;
      } else {
        slot.innerHTML = `<img src="${makeSvgPlaceholder(title, color, '%23ffffff', 260, 180)}" alt="${title}" class="card-img">`;
      }
    } else if (type === 'model') {
      const asset = findPortfolioAsset(key, 'models');
      if (asset) {
        slot.innerHTML = `<model-viewer src="${asset.path}" alt="${title}" auto-rotate camera-controls shadow-intensity="1" ar-status="not-presenting"></model-viewer>`;
      } else {
        slot.innerHTML = `<img src="${makeSvgPlaceholder(title, color, '%23ffffff', 260, 180)}" alt="${title}" class="card-img">`;
      }
    } else if (type === 'textile') {
      const assetFinal = findPortfolioAsset('textile1_final', 'images') || findPortfolioAsset('textile1', 'images');
      const assetOrig = findPortfolioAsset('textile1_original', 'images');
      if (assetFinal && assetOrig) {
        slot.innerHTML = `
          <div class="textile-card-wrapper" style="width:100%; height:180px; margin-bottom:12px; position:relative; overflow:hidden; border-radius:10px;">
            <img src="${assetFinal.path}" alt="Final" class="textile-img final">
            <img src="${assetOrig.path}" alt="Original" class="textile-img original">
          </div>
        `;
      } else {
        slot.innerHTML = `<img src="${makeSvgPlaceholder(title, '%232a1a34', '%23ffffff', 260, 180)}" alt="${title}" class="card-img">`;
      }
    }
  });
}

function bindDynamicAudio() {
  const players = document.querySelectorAll('.custom-audio-player');
  players.forEach(player => {
    const key = player.getAttribute('data-audio-key');
    const audio = player.querySelector('audio');
    if (!audio || !key) return;

    const asset = findPortfolioAsset(key, 'audio');
    if (asset && asset.path) {
      audio.src = asset.path;
      player.classList.remove('player-disabled');
    } else {
      audio.removeAttribute('src');
      player.classList.add('player-disabled');
    }
  });
}

function initCustomAudioPlayers() {
  const players = document.querySelectorAll('.custom-audio-player');
  const allAudios = [];

  players.forEach(player => {
    const audio = player.querySelector('audio');
    const toggleBtn = player.querySelector('.player-toggle-btn');
    const playIcon = player.querySelector('.play-icon');
    const pauseIcon = player.querySelector('.pause-icon');
    const timeline = player.querySelector('.player-timeline');
    const progress = player.querySelector('.player-progress');
    const currTime = player.querySelector('.player-curr-time');
    const durTime = player.querySelector('.player-dur-time');

    if (!audio || !toggleBtn) return;
    allAudios.push(audio);

    function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // Toggle Play / Pause
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!audio.src || audio.src === '' || audio.src === window.location.href) {
        return;
      }
      if (audio.paused) {
        allAudios.forEach(a => {
          if (a !== audio && !a.paused) {
            a.pause();
          }
        });
        audio.play().catch(err => console.log("Audio play preview note:", err));
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', () => {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
    });

    audio.addEventListener('pause', () => {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
    });

    audio.addEventListener('ended', () => {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (progress) progress.style.width = '0%';
      if (currTime) currTime.textContent = '0:00';
    });

    // Actualizar barra de progreso y tiempo
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        if (progress) progress.style.width = `${percent}%`;
        if (currTime) currTime.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (durTime) durTime.textContent = formatTime(audio.duration);
    });

    // Scrubbing en la barra de reproducción
    if (timeline) {
      timeline.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = timeline.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (audio.duration && width > 0) {
          audio.currentTime = (clickX / width) * audio.duration;
        }
      });
    }
  });
}

/* ==========================================================================
   6. SHOWCASE EXPANDIDO / 3D FLIP MODAL (Illustration, Animation, Modeling, Textile)
   ========================================================================== */
const showcaseData = [
  {
    id: 'portfolio-illustration',
    assetKey: 'illustration1',
    title: 'Character Assets',
    discipline: 'Illustration',
    year: '2024',
    software: 'Photoshop, Clip Studio Paint',
    technique: 'Concept Art & Character Design',
    description: 'Bocetos y diseño conceptual para "la Naranja". Desarrollo de siluetas, expresiones e iteraciones cromáticas para universo visual propio.',
    type: 'image',
    fallbackSrc: makeSvgPlaceholder('La Naranja', '%231a1a24')
  },
  {
    id: 'portfolio-animation',
    assetKey: 'storyboard1',
    title: 'Visual Scripts',
    discipline: 'Animation',
    year: '2024',
    software: 'After Effects, Premiere Pro, Toon Boom',
    technique: 'Storyboarding & 2D Animatic',
    description: 'Storyboards dinámicos y animatics sincronizados para los proyectos Scar y Feliz. Enfoque en ritmo visual, narrativa y actuación de personajes.',
    type: 'image',
    fallbackSrc: makeSvgPlaceholder('Animatic Preview', '%231a1a24')
  },
  {
    id: 'portfolio-modeling',
    assetKey: 'blockbench_model',
    title: '3D Prototypes',
    discipline: 'Modeling',
    year: '2024',
    software: 'Blockbench, Blender',
    technique: 'Low-Poly 3D Modeling & Texturing',
    description: 'Modelado tridimensional de personajes y entornos estilizados en Blockbench y Blender. Optimización de polígonos y texturizado pixel-art.',
    type: 'model',
    fallbackSrc: makeSvgPlaceholder('3D Prototype', '%2314141e')
  },
  {
    id: 'portfolio-textile',
    assetKey: 'textile1',
    title: 'Custom Garments',
    discipline: 'Textile Work',
    year: '2024',
    software: 'Sastrería manual, Tintes artesanales, Máquina de coser',
    technique: 'Upcycling, Patronaje & Custom Stitching',
    description: 'Modificación, sastrería y confección integral de prendas. Deconstrucción textil, aplicaciones personalizadas y acabados experimentales.',
    type: 'textile',
    fallbackFinal: makeSvgPlaceholder('Prenda Customized', '%232a1a34'),
    fallbackOriginal: makeSvgPlaceholder('Prenda Original', '%23141420', '%23a0a0b5')
  }
];

let currentShowcaseIndex = 0;

function openShowcase(disciplineId) {
  const foundIndex = showcaseData.findIndex(item => item.id === disciplineId);
  if (foundIndex !== -1) {
    currentShowcaseIndex = foundIndex;
  }
  renderShowcase(currentShowcaseIndex);

  const lightbox = document.getElementById('showcaseLightbox');
  if (lightbox) {
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // La bolita de socials no debe desaparecer al abrir el visualizador
  const socialBubble = document.getElementById('socialBubble');
  if (socialBubble) {
    socialBubble.classList.add('visible');
  }
}

function closeShowcase() {
  const lightbox = document.getElementById('showcaseLightbox');
  const flipCard = document.getElementById('showcaseFlipCard');
  if (lightbox) {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (flipCard) {
    flipCard.classList.remove('flipped');
  }

  // Si estamos en la vista 'home', restaurar visibilidad oculta de la burbuja
  const currentActive = document.querySelector('.page-view.active');
  if (currentActive && currentActive.id === 'home') {
    const socialBubble = document.getElementById('socialBubble');
    if (socialBubble) {
      socialBubble.classList.remove('visible', 'open');
    }
  }
}

function navigateShowcase(delta) {
  const flipCard = document.getElementById('showcaseFlipCard');
  if (flipCard) flipCard.classList.remove('flipped');

  currentShowcaseIndex = (currentShowcaseIndex + delta + showcaseData.length) % showcaseData.length;
  renderShowcase(currentShowcaseIndex);
}

function toggleCardFlip(event) {
  if (event) event.stopPropagation();
  const flipCard = document.getElementById('showcaseFlipCard');
  if (flipCard) {
    flipCard.classList.toggle('flipped');
  }
}

function renderShowcase(index) {
  const item = showcaseData[index];
  if (!item) return;

  const container = document.getElementById('showcaseMediaContainer');
  const tagEl = document.getElementById('showcaseDiscipline');
  const titleEl = document.getElementById('showcaseTitle');
  const yearEl = document.getElementById('showcaseYear');
  const softEl = document.getElementById('showcaseSoftware');
  const techEl = document.getElementById('showcaseTechnique');
  const descEl = document.getElementById('showcaseDesc');

  if (tagEl) tagEl.textContent = item.discipline;
  if (titleEl) titleEl.textContent = item.title;
  if (yearEl) yearEl.textContent = item.year;
  if (softEl) softEl.textContent = item.software;
  if (techEl) techEl.textContent = item.technique;
  if (descEl) descEl.textContent = item.description;

  if (container) {
    if (item.type === 'image') {
      const asset = findPortfolioAsset(item.assetKey, 'images');
      const src = asset ? asset.path : item.fallbackSrc;
      container.innerHTML = `
        <img src="${src}" alt="${item.title}" onerror="this.onerror=null; this.src='${item.fallbackSrc}'">
      `;
    } else if (item.type === 'model') {
      const asset = findPortfolioAsset(item.assetKey, 'models');
      if (asset) {
        container.innerHTML = `
          <model-viewer src="${asset.path}" alt="${item.title}" auto-rotate camera-controls shadow-intensity="1" ar-status="not-presenting"></model-viewer>
        `;
      } else {
        container.innerHTML = `
          <img src="${item.fallbackSrc}" alt="${item.title}">
        `;
      }
    } else if (item.type === 'textile') {
      const assetFinal = findPortfolioAsset('textile1_final', 'images');
      const assetOrig = findPortfolioAsset('textile1_original', 'images');
      if (assetFinal && assetOrig) {
        container.innerHTML = `
          <div class="textile-card-wrapper" style="width:100%; height:100%; min-height:420px; position:relative; overflow:hidden;">
            <img src="${assetFinal.path}" alt="${item.title} Final" class="textile-img final">
            <img src="${assetOrig.path}" alt="${item.title} Original" class="textile-img original">
          </div>
        `;
      } else {
        container.innerHTML = `
          <img src="${item.fallbackFinal}" alt="${item.title}">
        `;
      }
    }
  }
}

// Atajos de teclado para el showcase
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('showcaseLightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeShowcase();
    } else if (e.key === 'ArrowLeft') {
      navigateShowcase(-1);
    } else if (e.key === 'ArrowRight') {
      navigateShowcase(1);
    } else if (e.key === ' ' || e.key === 'Enter') {
      toggleCardFlip();
    }
  }
});

// Cerrar al hacer clic en el backdrop fuera de la tarjeta
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('showcaseLightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('showcase-content-wrapper')) {
        closeShowcase();
      }
    });
  }
});

/* ==========================================================================
   7. EMISOR DE PARTÍCULAS SUTILES DEL LOGO HACIA EL EXTERIOR (EXPANDIDAS)
   ========================================================================== */
function initLogoParticles() {
  const canvas = document.getElementById('logoParticlesCanvas');
  const avatar = document.querySelector('.hero-logo');
  if (!canvas || !avatar) return;

  const ctx = canvas.getContext('2d');
  let width, height, cx, cy, baseRadius;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width || 440;
    height = rect.height || 440;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    cx = width / 2;
    cy = height / 2;
    baseRadius = (avatar.offsetWidth || 140) / 2;
  }

  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 45;
  const particles = [];

  class Particle {
    constructor(initial = false) {
      this.reset(initial);
    }

    reset(initial = false) {
      this.angle = Math.random() * Math.PI * 2;
      const offset = (Math.random() - 0.5) * 8;
      this.dist = baseRadius + offset;
      if (initial) {
        this.dist += Math.random() * 90;
      }
      this.speed = 0.35 + Math.random() * 0.55; // Expansión fluida y elegante
      this.size = 1 + Math.random() * 1.5;
      this.maxLife = 110 + Math.random() * 130; // Mayor recorrido hacia el exterior
      this.life = initial ? Math.floor(Math.random() * this.maxLife) : 0;
      this.maxAlpha = 0.22 + Math.random() * 0.38; // Muy sutil
      this.hue = Math.random() > 0.45 ? '255, 255, 255' : '230, 238, 255';
    }

    update() {
      this.life++;
      this.dist += this.speed;

      if (this.life >= this.maxLife) {
        this.reset();
      }
    }

    draw() {
      const progress = this.life / this.maxLife;
      let alpha = 0;
      if (progress < 0.15) {
        alpha = (progress / 0.15) * this.maxAlpha;
      } else {
        alpha = (1 - (progress - 0.15) / 0.85) * this.maxAlpha;
      }

      const x = cx + Math.cos(this.angle) * this.dist;
      const y = cy + Math.sin(this.angle) * this.dist;

      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.hue}, ${alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = `rgba(${this.hue}, ${alpha * 0.8})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(true));
  }

  function animate() {
    const homeSection = document.getElementById('home');
    const isHomeActive = homeSection && homeSection.classList.contains('active');

    if (isHomeActive) {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   8. BANNER INTERACTIVO Y EXPANSIÓN DEL LOGO AL CENTRO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar arquitectura dinámica de portafolio y assets (Zero-Touch & Zero-404)
  initDynamicPortfolio();

  // Cargar estadísticas de Last.fm
  loadScrobbles();

  // Inicializar reproductores personalizados
  initCustomAudioPlayers();

  // Inicializar partículas sutiles del logo
  initLogoParticles();

  // Contador de caracteres del mensaje de contacto
  const contactMsg = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCounter');
  if (contactMsg && charCounter) {
    contactMsg.addEventListener('input', () => {
      charCounter.textContent = `${contactMsg.value.length} / 500`;
    });
  }

  // Crear capa de banner si no existe
  let overlay = document.querySelector('.banner-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('banner-overlay');
    document.body.appendChild(overlay);
  }

  const heroLogo = document.querySelector('.hero-logo');
  let timeoutId = null;
  let resetActiveId = null;

  if (heroLogo) {
    heroLogo.addEventListener('mouseenter', () => {
      if (heroLogo.classList.contains('expanded')) return;

      const rect = heroLogo.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const logoCenterX = rect.left + rect.width / 2;
      const logoCenterY = rect.top + rect.height / 2;

      const deltaX = viewportCenterX - logoCenterX;
      const deltaY = viewportCenterY - logoCenterY;

      heroLogo.style.setProperty('--logo-dx', `${deltaX}px`);
      heroLogo.style.setProperty('--logo-dy', `${deltaY}px`);

      overlay.style.setProperty('--banner-origin-x', `${logoCenterX}px`);
      overlay.style.setProperty('--banner-origin-y', `${logoCenterY}px`);

      if (resetActiveId) clearTimeout(resetActiveId);
      if (timeoutId) clearTimeout(timeoutId);

      heroLogo.classList.add('expanded');
      heroLogo.parentElement.classList.add('expanded-active');
      overlay.classList.add('active');

      timeoutId = setTimeout(() => {
        heroLogo.classList.remove('expanded');
        overlay.classList.remove('active');

        resetActiveId = setTimeout(() => {
          heroLogo.parentElement.classList.remove('expanded-active');
        }, 800);
      }, 1000);
    });
  }
});
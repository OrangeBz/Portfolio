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
const FALLBACK_PORTFOLIO_DATA = {
  "by_discipline": {
    "illustration": [
      { "name": "Cartoonish Jelly.jpg", "title": "Cartoonish Jelly", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "cartoonish jelly", "path": "media/visuals/illustration/Cartoonish Jelly.jpg", "alt_path": "../media/visuals/illustration/Cartoonish Jelly.jpg", "category": "images", "discipline": "illustration", "ext": "jpg", "folder": "media" },
      { "name": "Dino_2023.jpeg", "title": "Dino", "year": "2023", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "dino_2023", "path": "media/visuals/illustration/Dino_2023.jpeg", "alt_path": "../media/visuals/illustration/Dino_2023.jpeg", "category": "images", "discipline": "illustration", "ext": "jpeg", "folder": "media" },
      { "name": "Ihwia_2025.jpg", "title": "Ihwia", "year": "2025", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "ihwia_2025", "path": "media/visuals/illustration/Ihwia_2025.jpg", "alt_path": "../media/visuals/illustration/Ihwia_2025.jpg", "category": "images", "discipline": "illustration", "ext": "jpg", "folder": "media" },
      { "name": "SnowGolem.png", "title": "Snow Golem", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "snowgolem", "path": "media/visuals/illustration/SnowGolem.png", "alt_path": "../media/visuals/illustration/SnowGolem.png", "category": "images", "discipline": "illustration", "ext": "png", "folder": "media" },
      { "name": "What i deserve.jpg", "title": "What I Deserve", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "what i deserve", "path": "media/visuals/illustration/What i deserve.jpg", "alt_path": "../media/visuals/illustration/What i deserve.jpg", "category": "images", "discipline": "illustration", "ext": "jpg", "folder": "media" }
    ],
    "animation": [],
    "music": [
      { "name": "They Watch.ogg", "title": "They Watch", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "they watch", "path": "media/audio/They Watch.ogg", "alt_path": "../media/audio/They Watch.ogg", "category": "audio", "discipline": "music", "ext": "ogg", "folder": "media" },
      { "name": "They Watch.png", "title": "They Watch", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "they watch", "path": "media/visuals/music/They Watch.png", "alt_path": "../media/visuals/music/They Watch.png", "category": "images", "discipline": "music", "ext": "png", "folder": "media" }
    ],
    "modeling": [
      { "name": "Character.glb", "title": "Character", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "character", "path": "media/models/Character.glb", "alt_path": "../media/models/Character.glb", "category": "models", "discipline": "modeling", "ext": "glb", "folder": "media" },
      { "name": "ChibiOrange.gltf", "title": "Chibi Orange", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "chibiorange", "path": "media/models/ChibiOrange.gltf", "alt_path": "../media/models/ChibiOrange.gltf", "category": "models", "discipline": "modeling", "ext": "gltf", "folder": "media" }
    ],
    "textile": [
      { "name": "Pants 1.png", "title": "Pants 1", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "pants 1", "path": "media/visuals/textile/Pants 1.png", "alt_path": "../media/visuals/textile/Pants 1.png", "category": "images", "discipline": "textile", "ext": "png", "folder": "media" },
      { "name": "Pants 2.png", "title": "Pants 2", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "pants 2", "path": "media/visuals/textile/Pants 2.png", "alt_path": "../media/visuals/textile/Pants 2.png", "category": "images", "discipline": "textile", "ext": "png", "folder": "media" }
    ],
    "programming": [],
    "general": []
  },
  "images": [
    { "name": "Cartoonish Jelly.jpg", "title": "Cartoonish Jelly", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "cartoonish jelly", "path": "media/visuals/illustration/Cartoonish Jelly.jpg", "alt_path": "../media/visuals/illustration/Cartoonish Jelly.jpg", "category": "images", "discipline": "illustration", "ext": "jpg", "folder": "media" },
    { "name": "Dino_2023.jpeg", "title": "Dino", "year": "2023", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "dino_2023", "path": "media/visuals/illustration/Dino_2023.jpeg", "alt_path": "../media/visuals/illustration/Dino_2023.jpeg", "category": "images", "discipline": "illustration", "ext": "jpeg", "folder": "media" },
    { "name": "Ihwia_2025.jpg", "title": "Ihwia", "year": "2025", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "ihwia_2025", "path": "media/visuals/illustration/Ihwia_2025.jpg", "alt_path": "../media/visuals/illustration/Ihwia_2025.jpg", "category": "images", "discipline": "illustration", "ext": "jpg", "folder": "media" },
    { "name": "Pants 1.png", "title": "Pants 1", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "pants 1", "path": "media/visuals/textile/Pants 1.png", "alt_path": "../media/visuals/textile/Pants 1.png", "category": "images", "discipline": "textile", "ext": "png", "folder": "media" },
    { "name": "Pants 2.png", "title": "Pants 2", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "pants 2", "path": "media/visuals/textile/Pants 2.png", "alt_path": "../media/visuals/textile/Pants 2.png", "category": "images", "discipline": "textile", "ext": "png", "folder": "media" },
    { "name": "SnowGolem.png", "title": "Snow Golem", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "snowgolem", "path": "media/visuals/illustration/SnowGolem.png", "alt_path": "../media/visuals/illustration/SnowGolem.png", "category": "images", "discipline": "illustration", "ext": "png", "folder": "media" },
    { "name": "They Watch.png", "title": "They Watch", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "they watch", "path": "media/visuals/music/They Watch.png", "alt_path": "../media/visuals/music/They Watch.png", "category": "images", "discipline": "music", "ext": "png", "folder": "media" },
    { "name": "What i deserve.jpg", "title": "What I Deserve", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "what i deserve", "path": "media/visuals/illustration/What i deserve.jpg", "alt_path": "../media/visuals/illustration/What i deserve.jpg", "category": "images", "discipline": "illustration", "ext": "jpg", "folder": "media" }
  ],
  "models": [
    { "name": "Character.glb", "title": "Character", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "character", "path": "media/models/Character.glb", "alt_path": "../media/models/Character.glb", "category": "models", "discipline": "modeling", "ext": "glb", "folder": "media" },
    { "name": "ChibiOrange.gltf", "title": "Chibi Orange", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "chibiorange", "path": "media/models/ChibiOrange.gltf", "alt_path": "../media/models/ChibiOrange.gltf", "category": "models", "discipline": "modeling", "ext": "gltf", "folder": "media" }
  ],
  "audio": [
    { "name": "They Watch.ogg", "title": "They Watch", "year": "Desconocido", "software": "No especificado", "technique": "General / No especificado", "description": "", "key": "they watch", "path": "media/audio/They Watch.ogg", "alt_path": "../media/audio/They Watch.ogg", "category": "audio", "discipline": "music", "ext": "ogg", "folder": "media" }
  ],
  "video": [],
  "other": [],
  "by_folder": {},
  "all": []
};

let portfolioData = JSON.parse(JSON.stringify(FALLBACK_PORTFOLIO_DATA));

const makeSvgPlaceholder = (text, bg = '%231a1a24', fg = '%23ffffff', w = 700, h = 500) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-family='sans-serif' font-size='18'>${encodeURIComponent(text)}</text></svg>`;

function resolveMediaUrl(primaryPath, altPath) {
  if (!primaryPath) return altPath || '';
  if (typeof window !== 'undefined') {
    const loc = window.location.pathname.replace(/\\/g, '/');
    if (loc.includes('/root/') || loc.endsWith('/root') || (window.location.href.includes('/root/') && !primaryPath.startsWith('../'))) {
      return altPath || primaryPath;
    }
  }
  return primaryPath || altPath || '';
}

function handleTextileLensMove(e, wrapper) {
  if (!wrapper) return;
  const rect = wrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  wrapper.style.setProperty('--lens-x', `${x}px`);
  wrapper.style.setProperty('--lens-y', `${y}px`);
  wrapper.classList.add('lens-active');
}

function handleTextileLensTouch(e, wrapper) {
  if (!wrapper || !e.touches || e.touches.length === 0) return;
  const touch = e.touches[0];
  const rect = wrapper.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  wrapper.style.setProperty('--lens-x', `${x}px`);
  wrapper.style.setProperty('--lens-y', `${y}px`);
  wrapper.classList.add('lens-active');
}

function handleTextileLensLeave(wrapper) {
  if (!wrapper) return;
  wrapper.classList.remove('lens-active');
}

let modelPointerStartX = 0;
let modelPointerStartY = 0;
let modelPointerMoved = false;

function handleModelPointerDown(e) {
  modelPointerStartX = e.clientX;
  modelPointerStartY = e.clientY;
  modelPointerMoved = false;
}

function handleModelPointerMove(e) {
  if (Math.hypot(e.clientX - modelPointerStartX, e.clientY - modelPointerStartY) > 6) {
    modelPointerMoved = true;
  }
}

function handleModelViewerClick(e, disciplineId, idx) {
  if (modelPointerMoved) {
    e.stopPropagation();
    e.preventDefault();
    modelPointerMoved = false;
    return;
  }
  openShowcase(disciplineId, idx);
}

function handleModelCardClick(e, disciplineId, idx) {
  if (modelPointerMoved) {
    modelPointerMoved = false;
    return;
  }
  openShowcase(disciplineId, idx);
}

function groupTextileItems(textileList) {
  if (!textileList || textileList.length === 0) return [];
  
  const groups = {};
  textileList.forEach(item => {
    const cleanTitle = (item.title || item.name || 'Prenda')
      .replace(/\s*(final|original|after|before|despues|antes|_1|_2|\b1\b|\b2\b)/i, '')
      .replace(/\.(png|jpg|jpeg|webp)$/i, '')
      .trim();
    const groupKey = cleanTitle.toLowerCase();
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: cleanTitle || item.title || 'Prenda',
        year: item.year || 'Desconocido',
        software: item.software || 'No especificado',
        technique: item.technique || 'General / No especificado',
        description: item.description || '',
        discipline: 'Textile Work',
        final: null,
        original: null,
        items: []
      };
    }
    groups[groupKey].items.push(item);

    const isOrig = /orig|before|antes|_1|\b1\b|1\.png|1\.jpg/i.test(item.name);
    const isFinal = /final|after|despues|_2|\b2\b|2\.png|2\.jpg/i.test(item.name);

    if (isOrig && !groups[groupKey].original) {
      groups[groupKey].original = item;
    } else if (isFinal && !groups[groupKey].final) {
      groups[groupKey].final = item;
    }
  });

  return Object.values(groups).map(g => {
    if (g.items.length >= 2) {
      if (!g.final) g.final = g.items.find(it => it !== g.original) || g.items[0];
      if (!g.original) g.original = g.items.find(it => it !== g.final) || g.items[1];
    } else {
      if (!g.final && g.items.length > 0) g.final = g.items[0];
      if (!g.original && g.items.length > 0) g.original = g.items[0];
    }
    const hasPair = !!(g.final && g.original && g.final !== g.original);
    return {
      title: g.title,
      year: g.final ? g.final.year : g.year,
      software: g.final ? g.final.software : g.software,
      technique: g.final ? g.final.technique : g.technique,
      description: g.final ? g.final.description : g.description,
      discipline: 'Textile Work',
      hasPair: hasPair,
      finalItem: g.final,
      origItem: g.original || g.final
    };
  });
}

function groupMusicItems() {
  const musicImages = (portfolioData.by_discipline && portfolioData.by_discipline.music) 
    ? portfolioData.by_discipline.music.filter(item => item.category === 'images') 
    : [];
  const musicAudio = (portfolioData.audio && portfolioData.audio.length > 0) 
    ? portfolioData.audio 
    : ((portfolioData.by_discipline && portfolioData.by_discipline.music) 
      ? portfolioData.by_discipline.music.filter(item => item.category === 'audio') 
      : []);

  const cleanKey = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const musicCards = [];
  const matchedAudioSet = new Set();

  // 1. Procesar todas las carátulas en media/visuals/music/
  musicImages.forEach(img => {
    const imgKey = cleanKey(img.title) || cleanKey(img.key) || cleanKey(img.name);
    
    // Buscar audio coincidente por nombre/clave
    const matchedAudio = musicAudio.find(aud => {
      const audKey = cleanKey(aud.title) || cleanKey(aud.key) || cleanKey(aud.name);
      return audKey === imgKey || (audKey && imgKey && (audKey.includes(imgKey) || imgKey.includes(audKey)));
    });

    if (matchedAudio) {
      matchedAudioSet.add(matchedAudio);
    }

    musicCards.push({
      title: img.title || (matchedAudio ? matchedAudio.title : 'Producción Musical'),
      year: img.year !== 'Desconocido' ? img.year : (matchedAudio && matchedAudio.year !== 'Desconocido' ? matchedAudio.year : 'Desconocido'),
      software: img.software !== 'No especificado' ? img.software : (matchedAudio && matchedAudio.software !== 'No especificado' ? matchedAudio.software : 'No especificado'),
      technique: img.technique !== 'General / No especificado' ? img.technique : (matchedAudio && matchedAudio.technique !== 'General / No especificado' ? matchedAudio.technique : 'General / No especificado'),
      description: (img.description && img.description.trim()) ? img.description : (matchedAudio && matchedAudio.description && matchedAudio.description.trim() ? matchedAudio.description : 'Álbum conceptual / Producción e instrumental.'),
      imageItem: img,
      audioItem: matchedAudio || null
    });
  });

  // 2. Procesar pistas de audio que no tengan carátula de imagen
  musicAudio.forEach(aud => {
    if (matchedAudioSet.has(aud)) return;
    musicCards.push({
      title: aud.title || 'Pista de Audio',
      year: aud.year || 'Desconocido',
      software: aud.software || 'No especificado',
      technique: aud.technique || 'General / No especificado',
      description: (aud.description && aud.description.trim()) ? aud.description : 'Pista original / Exploración sonora.',
      imageItem: null,
      audioItem: aud
    });
  });

  return musicCards;
}

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
      portfolioData = Object.assign({
        by_discipline: { illustration: [], animation: [], music: [], modeling: [], textile: [], programming: [], general: [] },
        images: [],
        models: [],
        audio: [],
        video: [],
        other: [],
        by_folder: {},
        all: []
      }, data);
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
  // 1. Render dinámico para Ilustración (media/visuals/illustration/)
  const illGrid = document.querySelector('#portfolio-illustration .project-grid');
  if (illGrid && portfolioData.by_discipline && portfolioData.by_discipline.illustration && portfolioData.by_discipline.illustration.length > 0) {
    illGrid.innerHTML = portfolioData.by_discipline.illustration.map((item, idx) => {
      const src = resolveMediaUrl(item.path, item.alt_path);
      return `
        <article class="project-card interactive-card" onclick="openShowcase('portfolio-illustration', ${idx})">
          <img src="${src}" onerror="this.onerror=null; this.src='${item.alt_path}'" alt="${item.title}" class="card-img">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">Ilustración digital y concept art.</p>
        </article>
      `;
    }).join('');
  }

  // 2. Render dinámico para Animación (media/visuals/animation/)
  const animGrid = document.querySelector('#portfolio-animation .project-grid');
  if (animGrid && portfolioData.by_discipline && portfolioData.by_discipline.animation && portfolioData.by_discipline.animation.length > 0) {
    animGrid.innerHTML = portfolioData.by_discipline.animation.map((item, idx) => {
      const src = resolveMediaUrl(item.path, item.alt_path);
      return `
        <article class="project-card interactive-card" onclick="openShowcase('portfolio-animation', ${idx})">
          <img src="${src}" onerror="this.onerror=null; this.src='${item.alt_path}'" alt="${item.title}" class="card-img">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">Animación 2D y storyboarding.</p>
        </article>
      `;
    }).join('');
  }

  // 3. Render dinámico para Modelado 3D (media/models/)
  const modelGrid = document.querySelector('#portfolio-modeling .project-grid');
  if (modelGrid && portfolioData.by_discipline && portfolioData.by_discipline.modeling && portfolioData.by_discipline.modeling.length > 0) {
    modelGrid.innerHTML = portfolioData.by_discipline.modeling.map((item, idx) => {
      const modelSrc = resolveMediaUrl(item.path, item.alt_path);
      return `
        <article class="project-card interactive-card" onclick="handleModelCardClick(event, 'portfolio-modeling', ${idx})">
          <model-viewer src="${modelSrc}" alt="${item.title}" auto-rotate camera-controls interaction-prompt="none" shadow-intensity="1" ar-status="not-presenting" onpointerdown="handleModelPointerDown(event)" onpointermove="handleModelPointerMove(event)" onclick="handleModelViewerClick(event, 'portfolio-modeling', ${idx})" onerror="this.onerror=null; this.src='${item.alt_path}'"></model-viewer>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">Modelado 3D interactivo.</p>
        </article>
      `;
    }).join('');
  }

  // 4. Render dinámico para Confección Textil (media/visuals/textile/)
  const textileGrid = document.querySelector('#portfolio-textile .project-grid');
  if (textileGrid && portfolioData.by_discipline && portfolioData.by_discipline.textile && portfolioData.by_discipline.textile.length > 0) {
    const grouped = groupTextileItems(portfolioData.by_discipline.textile);
    textileGrid.innerHTML = grouped.map((g, idx) => {
      const finalPath = resolveMediaUrl(g.finalItem.path, g.finalItem.alt_path);
      const origPath = g.origItem ? resolveMediaUrl(g.origItem.path, g.origItem.alt_path) : finalPath;
      
      if (g.hasPair) {
        return `
          <article class="project-card interactive-card" onclick="openShowcase('portfolio-textile', ${idx})">
            <div class="textile-card-wrapper" onmousemove="handleTextileLensMove(event, this)" onmouseleave="handleTextileLensLeave(this)" ontouchmove="handleTextileLensTouch(event, this)" ontouchend="handleTextileLensLeave(this)">
              <img src="${finalPath}" onerror="this.onerror=null; this.src='${g.finalItem.alt_path}'" alt="Final" class="textile-img final">
              <img src="${origPath}" onerror="this.onerror=null; this.src='${g.origItem.alt_path}'" alt="Original" class="textile-img original">
              <div class="textile-lens-ring"></div>
              <div class="textile-badge">Lupa: Antes</div>
            </div>
            <h3 class="card-title">${g.title || 'Custom Garments'}</h3>
            <p class="card-desc">Modificación, sastrería y confección.</p>
          </article>
        `;
      } else {
        return `
          <article class="project-card interactive-card" onclick="openShowcase('portfolio-textile', ${idx})">
            <img src="${finalPath}" onerror="this.onerror=null; this.src='${g.finalItem.alt_path}'" alt="${g.title}" class="card-img">
            <h3 class="card-title">${g.title || 'Custom Garments'}</h3>
            <p class="card-desc">Modificación, sastrería y confección.</p>
          </article>
        `;
      }
    }).join('');
  }

  // 5. Render dinámico para Música / Discografía (media/visuals/music/ y media/audio/)
  const musicGrid = document.querySelector('#my-music .project-grid');
  if (musicGrid) {
    const musicItems = groupMusicItems();
    if (musicItems.length > 0) {
      musicGrid.innerHTML = musicItems.map((item, idx) => {
        const imgSrc = item.imageItem ? resolveMediaUrl(item.imageItem.path, item.imageItem.alt_path) : makeSvgPlaceholder(item.title, '%23181426', '%23ffffff', 260, 180);
        const altImgSrc = item.imageItem ? item.imageItem.alt_path : imgSrc;
        const audioSrc = item.audioItem ? resolveMediaUrl(item.audioItem.path, item.audioItem.alt_path) : '';
        const altAudioSrc = item.audioItem ? (audioSrc === item.audioItem.path ? item.audioItem.alt_path : item.audioItem.path) : '';
        const hasAudio = !!audioSrc;
        const descText = (item.description && item.description.trim()) ? item.description : 'Álbum conceptual / Producción e instrumental.';

        return `
          <article class="project-card" data-music-idx="${idx}">
            <img src="${encodeURI(imgSrc)}" alt="${item.title}" class="card-img" onerror="this.onerror=null; this.src='${encodeURI(altImgSrc)}'">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${descText}</p>
            <div class="custom-audio-player ${hasAudio ? '' : 'player-disabled'}">
              <audio preload="metadata" ${hasAudio ? `src="${encodeURI(audioSrc)}" data-alt-src="${encodeURI(altAudioSrc)}"` : ''}></audio>
              <button class="player-toggle-btn" aria-label="Reproducir / Pausar" ${hasAudio ? '' : 'disabled title="Audio no disponible"'}>
                <svg class="svg-icon play-icon" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                <svg class="svg-icon pause-icon" viewBox="0 0 24 24" style="display:none;"><rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/></svg>
              </button>
              <div class="player-timeline-wrapper">
                <div class="player-timeline">
                  <div class="player-progress"></div>
                </div>
                <div class="player-time-display">
                  <span class="player-curr-time">0:00</span>
                  <span class="player-dur-time">0:00</span>
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  }

  // 6. Render dinámico para Programación (coding/ o media/visuals/coding/)
  const progGrid = document.querySelector('#portfolio-programming .project-grid');
  if (progGrid) {
    const progItems = (portfolioData.by_discipline && portfolioData.by_discipline.programming) || [];
    if (progItems.length > 0) {
      progGrid.innerHTML = progItems.map((item, idx) => {
        const src = resolveMediaUrl(item.path, item.alt_path);
        const repoUrl = item.repo_url || (item.url ? (item.url.startsWith('http') ? item.url : `https://${item.url}`) : 'https://github.com/OrangeBz');
        const isImage = item.category === 'images' || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(item.name || '');
        const desc = (item.description && item.description.trim()) ? item.description : 'Proyecto de programación y desarrollo interactivo.';
        return `
          <article class="project-card interactive-card" onclick="openShowcase('portfolio-programming', ${idx})">
            ${isImage ? `<img src="${src}" onerror="this.onerror=null; this.src='${item.alt_path}'" alt="${item.title}" class="card-img">` : ''}
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc space-bottom">${desc}</p>
            <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="social-btn btn-full" onclick="event.stopPropagation();">Ver repositorio ↗</a>
          </article>
        `;
      }).join('');
    }
  }

  // 6. Slots individuales restantes (si no fueron sobreescritos)
  const slots = document.querySelectorAll('.card-media-slot');
  slots.forEach(slot => {
    const type = slot.getAttribute('data-media-type') || 'image';
    const key = slot.getAttribute('data-media-key') || '';
    const title = slot.getAttribute('data-placeholder-title') || 'Media';
    const color = slot.getAttribute('data-placeholder-color') || '%231a1a24';

    if (type === 'image') {
      const asset = findPortfolioAsset(key, 'images');
      if (asset) {
        const src = resolveMediaUrl(asset.path, asset.alt_path);
        slot.innerHTML = `<img src="${src}" alt="${title}" class="card-img" onerror="this.onerror=null; this.src='${asset.alt_path}'">`;
      } else {
        slot.innerHTML = `<img src="${makeSvgPlaceholder(title, color, '%23ffffff', 260, 180)}" alt="${title}" class="card-img">`;
      }
    } else if (type === 'model') {
      const asset = findPortfolioAsset(key, 'models');
      if (asset) {
        const src = resolveMediaUrl(asset.path, asset.alt_path);
        slot.innerHTML = `<model-viewer src="${src}" alt="${title}" auto-rotate camera-controls interaction-prompt="none" shadow-intensity="1" ar-status="not-presenting" onpointerdown="handleModelPointerDown(event)" onpointermove="handleModelPointerMove(event)" onclick="handleModelViewerClick(event, 'portfolio-modeling', 0)" onerror="this.onerror=null; this.src='${asset.alt_path}'"></model-viewer>`;
      } else {
        slot.innerHTML = `<img src="${makeSvgPlaceholder(title, color, '%23ffffff', 260, 180)}" alt="${title}" class="card-img">`;
      }
    } else if (type === 'textile') {
      const assetFinal = findPortfolioAsset('textile1_final', 'images') || findPortfolioAsset('textile1', 'images');
      const assetOrig = findPortfolioAsset('textile1_original', 'images');
      if (assetFinal && assetOrig) {
        const srcFinal = resolveMediaUrl(assetFinal.path, assetFinal.alt_path);
        const srcOrig = resolveMediaUrl(assetOrig.path, assetOrig.alt_path);
        slot.innerHTML = `
          <div class="textile-card-wrapper" style="width:100%; height:180px; margin-bottom:12px; position:relative; overflow:hidden; border-radius:10px;">
            <img src="${srcFinal}" alt="Final" class="textile-img final" onerror="this.onerror=null; this.src='${assetFinal.alt_path}'">
            <img src="${srcOrig}" alt="Original" class="textile-img original" onerror="this.onerror=null; this.src='${assetOrig.alt_path}'">
          </div>
        `;
      } else if (assetFinal) {
        const srcFinal = resolveMediaUrl(assetFinal.path, assetFinal.alt_path);
        slot.innerHTML = `<img src="${srcFinal}" alt="${title}" class="card-img" onerror="this.onerror=null; this.src='${assetFinal.alt_path}'">`;
      } else {
        slot.innerHTML = `<img src="${makeSvgPlaceholder(title, '%232a1a34', '%23ffffff', 260, 180)}" alt="${title}" class="card-img">`;
      }
    }
  });

  // Inicializar eventos de reproductores creados
  initCustomAudioPlayers();
}

function bindDynamicAudio() {
  const players = document.querySelectorAll('.custom-audio-player');
  players.forEach(player => {
    const key = player.getAttribute('data-audio-key');
    const audio = player.querySelector('audio');
    if (!audio || !key) return;

    const asset = findPortfolioAsset(key, 'audio') || findPortfolioAsset(key, 'music');
    if (asset && asset.path) {
      const p = resolveMediaUrl(asset.path, asset.alt_path);
      audio.src = encodeURI(p);
      audio.setAttribute('data-alt-src', encodeURI(p === asset.path ? asset.alt_path : asset.path));
      player.classList.remove('player-disabled');
    } else {
      audio.removeAttribute('src');
      player.classList.add('player-disabled');
    }
  });
}

function initCustomAudioPlayers() {
  const players = document.querySelectorAll('.custom-audio-player');

  players.forEach(player => {
    if (player.dataset.audioInitialized === 'true') return;
    player.dataset.audioInitialized = 'true';

    const audio = player.querySelector('audio');
    const toggleBtn = player.querySelector('.player-toggle-btn');
    const playIcon = player.querySelector('.play-icon');
    const pauseIcon = player.querySelector('.pause-icon');
    const timeline = player.querySelector('.player-timeline');
    const progress = player.querySelector('.player-progress');
    const currTime = player.querySelector('.player-curr-time');
    const durTime = player.querySelector('.player-dur-time');

    if (!audio || !toggleBtn) return;

    function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // Toggle Play / Pause desde el botón o la carátula
    const togglePlayPause = (e) => {
      if (e) e.stopPropagation();
      const rawSrc = audio.getAttribute('src') || audio.src;
      if (!rawSrc || rawSrc === '' || rawSrc === window.location.href) {
        return;
      }

      if (audio.paused) {
        document.querySelectorAll('.custom-audio-player audio').forEach(a => {
          if (a !== audio && !a.paused) {
            a.pause();
          }
        });

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.info("Audio play error, probando data-alt-src:", err);
            const alt = audio.getAttribute('data-alt-src');
            if (alt && !audio.dataset.altTried) {
              audio.dataset.altTried = 'true';
              audio.src = alt;
              audio.load();
              audio.play().catch(err2 => console.warn("Fallo reproducción alternativa:", err2));
            }
          });
        }
      } else {
        audio.pause();
      }
    };

    toggleBtn.addEventListener('click', togglePlayPause);

    const parentCard = player.closest('.project-card');
    if (parentCard) {
      const cardImg = parentCard.querySelector('.card-img');
      if (cardImg) {
        cardImg.style.cursor = 'pointer';
        cardImg.setAttribute('title', 'Clic para reproducir / pausar');
        cardImg.addEventListener('click', togglePlayPause);
      }
    }

    audio.addEventListener('error', () => {
      const alt = audio.getAttribute('data-alt-src');
      if (alt && !audio.dataset.altTried) {
        audio.dataset.altTried = 'true';
        audio.src = alt;
        audio.load();
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

    // Scrubbing interactivo y arrastre ultra-suave sin delay (Pointer Events)
    let isScrubbing = false;
    let pendingSeekFraction = 0;
    let rafId = null;

    function updateVisualProgress(fraction) {
      if (progress) progress.style.width = `${(fraction * 100).toFixed(2)}%`;
      if (currTime && audio.duration) currTime.textContent = formatTime(fraction * audio.duration);
    }

    function getFractionFromPointer(e) {
      const rect = timeline.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (width <= 0) return 0;
      return Math.max(0, Math.min(1, clickX / width));
    }

    // Actualizar barra de progreso y tiempo en reproducción normal
    audio.addEventListener('timeupdate', () => {
      if (audio.duration && !isScrubbing) {
        const percent = (audio.currentTime / audio.duration) * 100;
        if (progress) progress.style.width = `${percent}%`;
        if (currTime) currTime.textContent = formatTime(audio.currentTime);
      }
    });

    const updateDuration = () => {
      if (durTime && audio.duration) durTime.textContent = formatTime(audio.duration);
    };
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    if (timeline) {
      timeline.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (!audio.duration) return;
        isScrubbing = true;
        timeline.classList.add('is-scrubbing');
        try {
          timeline.setPointerCapture(e.pointerId);
        } catch (err) {}
        pendingSeekFraction = getFractionFromPointer(e);
        updateVisualProgress(pendingSeekFraction);
      });

      timeline.addEventListener('pointermove', (e) => {
        if (!isScrubbing) return;
        e.stopPropagation();
        pendingSeekFraction = getFractionFromPointer(e);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updateVisualProgress(pendingSeekFraction);
        });
      });

      const endScrubbing = (e) => {
        if (isScrubbing) {
          isScrubbing = false;
          timeline.classList.remove('is-scrubbing');
          try {
            timeline.releasePointerCapture(e.pointerId);
          } catch (err) {}
          if (rafId) cancelAnimationFrame(rafId);
          if (audio.duration) {
            audio.currentTime = pendingSeekFraction * audio.duration;
            updateVisualProgress(pendingSeekFraction);
          }
        }
      };

      timeline.addEventListener('pointerup', endScrubbing);
      timeline.addEventListener('pointercancel', endScrubbing);
    }
  });
}

/* ==========================================================================
   6. SHOWCASE EXPANDIDO / 3D FLIP MODAL (Illustration, Animation, Modeling, Textile)
   ========================================================================== */
let currentShowcaseDeck = [];
let currentShowcaseIndex = 0;

function buildShowcaseDeck(disciplineKey) {
  const disc = disciplineKey.replace('portfolio-', '');
  
  if (disc === 'textile') {
    const textileList = (portfolioData.by_discipline && portfolioData.by_discipline.textile) || [];
    const grouped = groupTextileItems(textileList);
    if (grouped.length > 0) {
      return grouped.map(g => ({
        discipline: 'Textile Work',
        title: g.title,
        year: g.year,
        software: g.software,
        technique: g.technique,
        description: g.description,
        type: 'textile',
        hasPair: g.hasPair,
        finalSrc: resolveMediaUrl(g.finalItem.path, g.finalItem.alt_path),
        altFinalSrc: g.finalItem.alt_path,
        origSrc: g.origItem ? resolveMediaUrl(g.origItem.path, g.origItem.alt_path) : null,
        altOrigSrc: g.origItem ? g.origItem.alt_path : null,
        fallbackSrc: makeSvgPlaceholder(g.title, '%232a1a34')
      }));
    }
  }

  if (portfolioData.by_discipline && portfolioData.by_discipline[disc] && portfolioData.by_discipline[disc].length > 0) {
    return portfolioData.by_discipline[disc].map(item => ({
      discipline: item.discipline ? (item.discipline.charAt(0).toUpperCase() + item.discipline.slice(1)) : (disc.charAt(0).toUpperCase() + disc.slice(1)),
      title: item.title || 'Sin Título',
      year: item.year || 'Desconocido',
      software: item.software || 'No especificado',
      technique: item.technique || 'General / No especificado',
      description: item.description || '',
      type: item.category === 'models' ? 'model' : (disc === 'textile' ? 'textile' : 'image'),
      mediaSrc: resolveMediaUrl(item.path, item.alt_path),
      altMediaSrc: item.alt_path,
      fallbackSrc: makeSvgPlaceholder(item.title || 'Media', '%231a1a24')
    }));
  }

  // Fallback genérico cuando la carpeta no contiene archivos
  const disciplineName = disc.charAt(0).toUpperCase() + disc.slice(1);
  return [{
    discipline: disciplineName,
    title: `Prototipo ${disciplineName}`,
    year: 'Desconocido',
    software: 'No especificado',
    technique: 'General / No especificado',
    description: '',
    type: disc === 'modeling' ? 'model' : (disc === 'textile' ? 'textile' : 'image'),
    mediaSrc: '',
    fallbackSrc: makeSvgPlaceholder(disciplineName, '%231a1a24')
  }];
}

function openShowcase(disciplineId, itemIndex = 0) {
  currentShowcaseDeck = buildShowcaseDeck(disciplineId);
  if (!currentShowcaseDeck || currentShowcaseDeck.length === 0) return;

  currentShowcaseIndex = Math.min(Math.max(0, itemIndex), currentShowcaseDeck.length - 1);
  renderShowcase(currentShowcaseIndex);

  const lightbox = document.getElementById('showcaseLightbox');
  if (lightbox) {
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('showcase-open');
  }

  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }

  const socialBubble = document.getElementById('socialBubble');
  if (socialBubble) {
    socialBubble.classList.add('visible');
  }
}

function closeShowcase() {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }

  const lightbox = document.getElementById('showcaseLightbox');
  const flipCard = document.getElementById('showcaseFlipCard');
  if (lightbox) {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('showcase-open');
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

  if (!currentShowcaseDeck || currentShowcaseDeck.length === 0) return;
  currentShowcaseIndex = (currentShowcaseIndex + delta + currentShowcaseDeck.length) % currentShowcaseDeck.length;
  renderShowcase(currentShowcaseIndex);
}

function toggleCardFlip(event) {
  if (event) event.stopPropagation();
  const flipCard = document.getElementById('showcaseFlipCard');
  if (flipCard) {
    flipCard.classList.toggle('flipped');
  }
}

function adjustCardDimensions(naturalWidth, naturalHeight, isModel = false) {
  const flipCard = document.getElementById('showcaseFlipCard');
  if (!flipCard) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw <= 768;

  const maxW = Math.min(vw * 0.92, 1080);
  const maxH = isMobile ? Math.min(vh * 0.68, 520) : Math.min(vh * 0.82, 680);
  const minW = Math.min(vw * 0.90, 520);
  const minH = isMobile ? Math.min(vh * 0.45, 300) : Math.min(vh * 0.65, 450);

  if (isModel || !naturalWidth || !naturalHeight) {
    const standardW = Math.min(maxW, Math.max(minW, 840));
    const standardH = Math.min(maxH, Math.max(minH, isMobile ? 400 : 590));
    flipCard.style.width = `${standardW}px`;
    flipCard.style.height = `${standardH}px`;
    return;
  }

  const ratio = naturalWidth / naturalHeight;
  let targetW, targetH;

  if (ratio >= 1) {
    // Imagen Horizontal / Panorámica
    targetW = Math.min(maxW, Math.max(minW, naturalWidth));
    targetH = targetW / ratio;

    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * ratio;
    }
    if (targetH < minH) {
      targetH = minH;
    }
    if (targetW < minW) {
      targetW = minW;
    }
  } else {
    // Imagen Vertical / Retrato
    targetH = Math.min(maxH, Math.max(minH, naturalHeight));
    targetW = targetH * ratio;

    if (targetW > maxW) {
      targetW = maxW;
      targetH = targetW / ratio;
    }
    if (targetW < minW) {
      targetW = minW;
    }
    if (targetH < minH) {
      targetH = minH;
    }
  }

  targetW = Math.min(targetW, maxW);
  targetH = Math.min(targetH, maxH);

  flipCard.style.width = `${Math.round(targetW)}px`;
  flipCard.style.height = `${Math.round(targetH)}px`;
}

function renderShowcase(index) {
  const item = currentShowcaseDeck[index];
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
  if (descEl) {
    if (item.description && item.description.trim() !== '') {
      descEl.textContent = item.description;
      descEl.style.display = 'block';
    } else {
      descEl.textContent = '';
      descEl.style.display = 'none';
    }
  }

  if (container) {
    if (item.type === 'image') {
      const src = item.mediaSrc || item.fallbackSrc;
      const altSrc = item.altMediaSrc || item.fallbackSrc;
      container.innerHTML = `
        <img src="${src}" alt="${item.title}" onerror="this.onerror=null; this.src='${altSrc}'">
      `;
      const img = new Image();
      img.src = src;
      if (img.complete && img.naturalWidth > 0) {
        adjustCardDimensions(img.naturalWidth, img.naturalHeight);
      } else {
        img.onload = () => adjustCardDimensions(img.naturalWidth, img.naturalHeight);
        img.onerror = () => adjustCardDimensions(0, 0);
      }
    } else if (item.type === 'model') {
      adjustCardDimensions(0, 0, true);
      if (item.mediaSrc) {
        container.innerHTML = `
          <model-viewer src="${item.mediaSrc}" alt="${item.title}" auto-rotate camera-controls shadow-intensity="1" ar-status="not-presenting" onclick="event.stopPropagation();" onmousedown="event.stopPropagation();" onpointerdown="event.stopPropagation();" ontouchstart="event.stopPropagation();" onerror="this.onerror=null; this.src='${item.altMediaSrc}'"></model-viewer>
        `;
      } else {
        container.innerHTML = `
          <img src="${item.fallbackSrc}" alt="${item.title}">
        `;
      }
    } else if (item.type === 'textile') {
      if (item.hasPair && item.finalSrc && item.origSrc) {
        container.innerHTML = `
          <div class="textile-card-wrapper textile-showcase-wrapper" onmousemove="handleTextileLensMove(event, this)" onmouseleave="handleTextileLensLeave(this)" ontouchmove="handleTextileLensTouch(event, this)" ontouchend="handleTextileLensLeave(this)">
            <img src="${item.finalSrc}" alt="${item.title} Final" class="textile-img final" onerror="this.onerror=null; this.src='${item.altFinalSrc}'">
            <img src="${item.origSrc}" alt="${item.title} Original" class="textile-img original" onerror="this.onerror=null; this.src='${item.altOrigSrc}'">
            <div class="textile-lens-ring"></div>
            <div class="textile-badge">Lupa: Antes</div>
          </div>
        `;
        const imgFinal = new Image();
        const imgOrig = new Image();

        const checkSizes = () => {
          const w1 = imgFinal.naturalWidth || 0;
          const h1 = imgFinal.naturalHeight || 0;
          const w2 = imgOrig.naturalWidth || 0;
          const h2 = imgOrig.naturalHeight || 0;

          const maxW = Math.max(w1, w2);
          const maxH = Math.max(h1, h2);

          if (maxW > 0 && maxH > 0) {
            adjustCardDimensions(maxW, maxH);
          } else if (w1 > 0 && h1 > 0) {
            adjustCardDimensions(w1, h1);
          } else if (w2 > 0 && h2 > 0) {
            adjustCardDimensions(w2, h2);
          } else {
            adjustCardDimensions(0, 0);
          }
        };

        imgFinal.onload = checkSizes;
        imgFinal.onerror = checkSizes;
        imgOrig.onload = checkSizes;
        imgOrig.onerror = checkSizes;

        imgFinal.src = item.finalSrc;
        imgOrig.src = item.origSrc;

        if (imgFinal.complete || imgOrig.complete) {
          checkSizes();
        }
      } else {
        const singleSrc = item.finalSrc || item.mediaSrc || item.fallbackSrc;
        const altSingleSrc = item.altFinalSrc || item.altMediaSrc || item.fallbackSrc;
        container.innerHTML = `
          <img src="${singleSrc}" alt="${item.title}" onerror="this.onerror=null; this.src='${altSingleSrc}'">
        `;
        const img = new Image();
        img.src = singleSrc;
        if (img.complete && img.naturalWidth > 0) {
          adjustCardDimensions(img.naturalWidth, img.naturalHeight);
        } else {
          img.onload = () => adjustCardDimensions(img.naturalWidth, img.naturalHeight);
          img.onerror = () => adjustCardDimensions(0, 0);
        }
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

function initFlipButtonProximity() {
  const frontCard = document.getElementById('showcaseFront');
  const frontBtn = document.getElementById('frontFlipBtn');
  if (!frontCard || !frontBtn) return;

  frontCard.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    const rect = frontBtn.getBoundingClientRect();
    
    // Distancia euclidiana exacta al borde del botón (0 si el cursor está encima)
    const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
    const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Curva física de proximidad con base mínima al 40%:
    // - Encima: 100% (1.0)
    // - Alrededor del borde (< 15px): 90% a 100%
    // - A ~1cm (15px a 45px): 75% a 90%
    // - A ~3cm (45px a 120px): 55% a 75%
    // - A ~6cm (120px a 240px): 40% a 55%
    // - Lejos (> 240px): 40% (0.40)
    let op;
    if (dist <= 0) {
      op = 1.0;
    } else if (dist <= 15) {
      op = 0.90 + (1 - dist / 15) * 0.10;
    } else if (dist <= 45) {
      op = 0.75 + (1 - (dist - 15) / 30) * 0.15;
    } else if (dist <= 120) {
      op = 0.55 + (1 - (dist - 45) / 75) * 0.20;
    } else if (dist <= 240) {
      op = 0.40 + (1 - (dist - 120) / 120) * 0.15;
    } else {
      op = 0.40;
    }

    frontBtn.style.opacity = op.toFixed(2);
    frontBtn.style.backgroundColor = `rgba(18, 14, 28, ${Math.min(0.95, 0.35 + op * 0.60).toFixed(2)})`;
    frontBtn.style.borderColor = `rgba(255, 255, 255, ${Math.min(0.80, 0.20 + op * 0.60).toFixed(2)})`;
    frontBtn.style.color = '#ffffff';
  });

  frontCard.addEventListener('mouseleave', () => {
    if (window.innerWidth <= 768) return;
    frontBtn.style.opacity = '0.40';
    frontBtn.style.backgroundColor = '';
    frontBtn.style.borderColor = '';
    frontBtn.style.color = '';
  });
}

/* ==========================================================================
   9. EASTER EGG: ONDA DE COLOR EN LETRAS Y DESTELLO EN ABOUT
   ========================================================================== */
function initAboutEasterEgg() {
  const aboutCard = document.querySelector('.about-card');
  const aboutSection = document.getElementById('about');
  if (!aboutCard || !aboutSection) return;

  // 1. Dividir texto en spans individuales preservando la estructura HTML
  function wrapCharactersInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text) return;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '\n' || char === '\r') continue;
        const span = document.createElement('span');
        span.className = 'about-char';
        span.textContent = char;
        if (char === ' ' || char === '\u00A0') {
          span.classList.add('about-space');
        }
        fragment.appendChild(span);
      }
      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(child => wrapCharactersInNode(child));
    }
  }

  aboutCard.querySelectorAll('p').forEach(p => wrapCharactersInNode(p));

  const charElements = Array.from(aboutCard.querySelectorAll('.about-char'));
  if (charElements.length === 0) return;

  let isWaveActive = false;
  let isEasterEggDisabled = false;
  let activeTimeouts = [];
  let waveCount = 0;
  let nextWaveTimeout = null;

  function clearActiveWave() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
    charElements.forEach(ch => {
      ch.style.color = '';
      ch.style.textShadow = '';
      ch.classList.remove('about-char-lit');
    });
    isWaveActive = false;
  }

  function scheduleNextWave(delayMs = 5000) {
    if (isEasterEggDisabled) return;
    if (nextWaveTimeout) clearTimeout(nextWaveTimeout);
    nextWaveTimeout = setTimeout(() => {
      startColorWave();
    }, delayMs);
  }

  function startColorWave() {
    if (isEasterEggDisabled || isWaveActive) return;

    // Solo iniciar la onda si la sección About está visible/activa
    if (!aboutSection.classList.contains('active')) {
      scheduleNextWave(2000);
      return;
    }

    isWaveActive = true;
    waveCount++;

    const charDelay = 36; // ms por letra (velocidad más despacio y elegante)
    const glowDuration = 130; // ms que dura encendida cada letra (menos extenso: solo 3-4 letras a la vez)

    charElements.forEach((ch, idx) => {
      // Encender letra con degradado multicolor
      const tOn = setTimeout(() => {
        if (isEasterEggDisabled || !isWaveActive) return;

        const hue = (idx * 5 + waveCount * 50) % 360;
        ch.style.color = `hsl(${hue}, 95%, 72%)`;
        ch.style.textShadow = `0 0 6px hsl(${hue}, 100%, 65%)`;
        ch.classList.add('about-char-lit');

        // Apagar letra rápidamente para que no sea extenso
        const tOff = setTimeout(() => {
          if (isEasterEggDisabled) return;
          ch.style.color = '';
          ch.style.textShadow = '';
          ch.classList.remove('about-char-lit');
        }, glowDuration);
        activeTimeouts.push(tOff);

      }, idx * charDelay);

      activeTimeouts.push(tOn);
    });

    // Duración total de la onda
    const totalWaveTime = (charElements.length * charDelay) + glowDuration + 50;
    const tEnd = setTimeout(() => {
      isWaveActive = false;
      activeTimeouts = [];
      // Programar la siguiente onda exactamente 5 segundos después
      scheduleNextWave(5000);
    }, totalWaveTime);
    activeTimeouts.push(tEnd);
  }

  // Iniciar ciclo de ondas tras los primeros 5 segundos
  scheduleNextWave(5000);

  // 2. Destello pequeño y refinado
  function triggerDestello(clickX, clickY) {
    // Detener la onda inmediatamente y anular futuras ejecuciones permanentemente
    isEasterEggDisabled = true;
    isWaveActive = false;
    if (nextWaveTimeout) clearTimeout(nextWaveTimeout);
    clearActiveWave();

    const cardRect = aboutCard.getBoundingClientRect();
    const relX = clickX - cardRect.left;
    const relY = clickY - cardRect.top;

    // Flash overlay compacto
    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'about-flash-overlay';
    flashOverlay.style.left = `${relX}px`;
    flashOverlay.style.top = `${relY}px`;
    aboutCard.appendChild(flashOverlay);

    // Onda sutil en las letras cercanas
    charElements.forEach(ch => {
      const chRect = ch.getBoundingClientRect();
      const chCenterX = chRect.left + chRect.width / 2;
      const chCenterY = chRect.top + chRect.height / 2;
      const dist = Math.hypot(chCenterX - clickX, chCenterY - clickY);
      const delay = Math.min(dist * 0.5, 250);

      setTimeout(() => {
        ch.classList.add('about-caught-flash');
        setTimeout(() => {
          ch.classList.remove('about-caught-flash');
        }, 500);
      }, delay);
    });

    // Partículas de destello compactas
    createFlashSparks(aboutCard, relX, relY);

    setTimeout(() => {
      if (flashOverlay.parentNode) {
        flashOverlay.parentNode.removeChild(flashOverlay);
      }
    }, 900);
  }

  function createFlashSparks(container, originX, originY) {
    const canvas = document.createElement('canvas');
    canvas.className = 'about-sparks-canvas';
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 22;
    const particles = [];
    const colors = ['#ffffff', '#fff59d', '#ffd700', '#ff9800', '#00f0ff'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.6;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.0 + Math.random() * 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.024 + Math.random() * 0.028,
        star: Math.random() > 0.4
      });
    }

    let startTime = performance.now();

    function renderSparks(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveCount = 0;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy = p.vy * 0.95 + 0.14;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;

          if (p.star) {
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size * 2.2, p.size * 0.6, 0, 0, Math.PI * 2);
            ctx.ellipse(p.x, p.y, p.size * 0.6, p.size * 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (aliveCount > 0 && now - startTime < 1400) {
        requestAnimationFrame(renderSparks);
      } else {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }

    requestAnimationFrame(renderSparks);
  }

  // 3. Capturar clic del usuario ÚNICAMENTE si pulsa cerca del color activo
  aboutCard.addEventListener('pointerdown', (e) => {
    if (isEasterEggDisabled || !isWaveActive) return;

    // Obtener las letras actualmente iluminadas
    const litElements = charElements.filter(ch => ch.classList.contains('about-char-lit'));
    if (litElements.length === 0) return;

    // Verificar si el clic ocurrió cerca (radio de proximidad) de las letras de color
    const PROXIMITY_THRESHOLD = 50; // px de tolerancia alrededor del haz de color
    let isNear = false;

    for (let i = 0; i < litElements.length; i++) {
      const rect = litElements[i].getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist <= PROXIMITY_THRESHOLD) {
        isNear = true;
        break;
      }
    }

    // Solo si el clic fue sobre o cerca del color se dispara el destello
    if (isNear) {
      triggerDestello(e.clientX, e.clientY);
    }
  });
}

/* ==========================================================================
   8. SECCIÓN DE CONTACTO, EMAIL DINÁMICO & FILTRO HONEYPOT ANTISPAM
   ========================================================================== */
const NOTE_COOLDOWN_MS = 10 * 60 * 1000; // Cooldown de 10 minutos (600,000 ms)
let cooldownIntervalId = null;

function getRemainingNoteCooldown() {
  const lastTime = localStorage.getItem('last_note_timestamp');
  if (!lastTime) return 0;
  const elapsed = Date.now() - parseInt(lastTime, 10);
  const remaining = NOTE_COOLDOWN_MS - elapsed;
  return remaining > 0 ? remaining : 0;
}

function updateContactCooldownUI() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusMsg = document.getElementById('formStatus');
  if (!submitBtn) return;

  const remaining = getRemainingNoteCooldown();
  if (remaining > 0) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Respuesta enviada';
    if (statusMsg) {
      statusMsg.className = 'form-status-msg success';
      statusMsg.textContent = 'Respuesta enviada';
      statusMsg.style.display = 'block';
    }
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Mensaje';
    if (cooldownIntervalId) {
      clearTimeout(cooldownIntervalId);
      cooldownIntervalId = null;
    }
    if (statusMsg && statusMsg.textContent === 'Respuesta enviada') {
      statusMsg.style.display = 'none';
    }
  }
}

function startContactCooldownTimer() {
  updateContactCooldownUI();
  const remaining = getRemainingNoteCooldown();
  if (remaining > 0) {
    if (cooldownIntervalId) clearTimeout(cooldownIntervalId);
    cooldownIntervalId = setTimeout(() => {
      updateContactCooldownUI();
    }, remaining);
  }
}

function initDynamicEmail() {
  const emailLink = document.getElementById('contactEmail');
  if (!emailLink) return;
  // Construcción dinámica por concatenación para evitar scrapers de HTML estático
  const u = ['c', 'o', 'n', 't', 'a', 'c', 't'].join('');
  const d = ['o', 'r', 'a', 'n', 'g-e', 'b', 'z', '.', 'c', 'o', 'm'].join('').replace('-', '');
  const fullEmail = `${u}@${d}`;
  emailLink.href = `mailto:${fullEmail}`;
  emailLink.textContent = fullEmail;
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const hpInput = document.getElementById('hpWebsite');
  const statusMsg = document.getElementById('formStatus');
  if (!form) return;

  // Verificar estado de cooldown al cargar
  startContactCooldownTimer();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 0. Verificar Cooldown (10 minutos entre envíos)
    const remainingCooldown = getRemainingNoteCooldown();
    if (remainingCooldown > 0) {
      updateContactCooldownUI();
      return;
    }

    // 1. Validar campo oculto Honeypot (Antispam)
    if (hpInput && hpInput.value.trim() !== '') {
      // Interrupción silenciosa para bots (simular éxito)
      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = 'Respuesta enviada';
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Respuesta enviada';
      }
      form.reset();
      return;
    }

    // 2. Extracción de datos para usuario humano (Sin peticiones con tokens expuestos)
    const formData = new FormData(form);
    const noteData = {
      id: `note_${Date.now()}`,
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      message: formData.get('message') || '',
      timestamp: new Date().toISOString()
    };

    // 3. Almacenamiento local seguro en localStorage
    try {
      const existingNotes = JSON.parse(localStorage.getItem('contact_notes') || '[]');
      existingNotes.push(noteData);
      localStorage.setItem('contact_notes', JSON.stringify(existingNotes));
    } catch (err) {
      console.warn('No se pudo guardar la nota en localStorage:', err);
    }

    // 4. Descarga de copia local en archivo JSON
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(noteData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `nota_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.warn('No se pudo generar la descarga del respaldo JSON:', err);
    }

    // 5. Registrar marca de tiempo del envío exitoso para activar el Cooldown de 10 minutos
    localStorage.setItem('last_note_timestamp', Date.now().toString());

    form.reset();
    const charCounter = document.getElementById('charCounter');
    if (charCounter) charCounter.textContent = '0 / 500';

    // 6. Cambiar botón a 'Respuesta enviada' y programar la restauración a los 10 minutos
    startContactCooldownTimer();
  });
}

/* ==========================================================================
   9. BANNER INTERACTIVO Y EXPANSIÓN DEL LOGO AL CENTRO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar correo dinámico protegido
  initDynamicEmail();

  // Inicializar formulario de contacto con Honeypot antispam y Cooldown
  initContactForm();

  // Inicializar arquitectura dinámica de portafolio y assets (Zero-Touch & Zero-404)
  initDynamicPortfolio();

  // Cargar estadísticas de Last.fm
  loadScrobbles();

  // Inicializar reproductores personalizados
  initCustomAudioPlayers();

  // Inicializar partículas sutiles del logo
  initLogoParticles();

  // Inicializar efecto de proximidad en el botón de volteo
  initFlipButtonProximity();

  // Inicializar Easter Egg de texto en About
  initAboutEasterEgg();

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

  const avatarWrapper = document.querySelector('.avatar-wrapper');
  const heroLogo = document.querySelector('.hero-logo');
  let timeoutId = null;
  let resetActiveId = null;
  let isFeatureActive = false;
  let hasTriggeredInCurrentHover = false;

  if (avatarWrapper && heroLogo) {
    avatarWrapper.addEventListener('mouseenter', () => {
      // Si la animación está activa o ya se disparó en este hover, no volver a disparar
      if (isFeatureActive || hasTriggeredInCurrentHover) return;

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

      isFeatureActive = true;
      hasTriggeredInCurrentHover = true;

      heroLogo.classList.add('expanded');
      avatarWrapper.classList.add('expanded-active');
      overlay.classList.add('active');

      timeoutId = setTimeout(() => {
        heroLogo.classList.remove('expanded');
        overlay.classList.remove('active');

        resetActiveId = setTimeout(() => {
          avatarWrapper.classList.remove('expanded-active');
          isFeatureActive = false;
        }, 800);
      }, 1100);
    });

    avatarWrapper.addEventListener('mouseleave', () => {
      // Solo cuando el cursor sale completamente del logo se permite un nuevo trigger
      hasTriggeredInCurrentHover = false;
    });
  }

  // Recalcular proporciones dinámicas de la tarjeta si se redimensiona la ventana
  window.addEventListener('resize', () => {
    const lightbox = document.getElementById('showcaseLightbox');
    if (lightbox && lightbox.classList.contains('active') && currentShowcaseDeck.length > 0) {
      const currentItem = currentShowcaseDeck[currentShowcaseIndex];
      if (currentItem && (currentItem.type === 'image' || currentItem.type === 'textile')) {
        const container = document.getElementById('showcaseMediaContainer');
        const imgs = container ? container.querySelectorAll('img') : [];
        let maxW = 0, maxH = 0;
        imgs.forEach(img => {
          if (img.naturalWidth > maxW) maxW = img.naturalWidth;
          if (img.naturalHeight > maxH) maxH = img.naturalHeight;
        });
        if (maxW > 0 && maxH > 0) {
          adjustCardDimensions(maxW, maxH);
        } else {
          adjustCardDimensions(0, 0);
        }
      } else {
        adjustCardDimensions(0, 0, true);
      }
    }
  });
});
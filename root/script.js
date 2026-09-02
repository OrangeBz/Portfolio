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
                ${item.portada ? `<img src="${item.portada}" class="scrobbles-cover" alt="Cover" onerror="this.style.display='none'">` : ''}
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
                ${item.portada ? `<img src="${item.portada}" class="scrobbles-cover" alt="Cover" onerror="this.style.display='none'">` : ''}
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
   5. REPRODUCTORES DE AUDIO PERSONALIZADOS (Estilo Web)
   ========================================================================== */
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
    toggleBtn.addEventListener('click', () => {
      if (audio.paused) {
        // Pausar todos los otros reproductores
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
   6. BANNER INTERACTIVO Y EXPANSIÓN DEL LOGO AL CENTRO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Cargar estadísticas de Last.fm
  loadScrobbles();

  // Inicializar reproductores personalizados
  initCustomAudioPlayers();

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
      // Evitar reactivar si ya está en expansión
      if (heroLogo.classList.contains('expanded')) return;

      // Calcular distancia relativa desde el logo hasta el centro exacto del viewport
      const rect = heroLogo.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const logoCenterX = rect.left + rect.width / 2;
      const logoCenterY = rect.top + rect.height / 2;

      const deltaX = viewportCenterX - logoCenterX;
      const deltaY = viewportCenterY - logoCenterY;

      // Pasar las coordenadas exactas a CSS
      heroLogo.style.setProperty('--logo-dx', `${deltaX}px`);
      heroLogo.style.setProperty('--logo-dy', `${deltaY}px`);

      // Establecer el origen radial del banner exactamente en la posición inicial del logo
      overlay.style.setProperty('--banner-origin-x', `${logoCenterX}px`);
      overlay.style.setProperty('--banner-origin-y', `${logoCenterY}px`);

      if (resetActiveId) clearTimeout(resetActiveId);
      if (timeoutId) clearTimeout(timeoutId);

      // Activar expansión: se hace grande y baja al centro de la pantalla
      heroLogo.classList.add('expanded');
      heroLogo.parentElement.classList.add('expanded-active');
      overlay.classList.add('active');

      // Permanece en el centro 1 segundo (más ágil y dinámico)
      timeoutId = setTimeout(() => {
        // Regresa suavemente en reversa a su posición y escala inicial (duración 0.8s)
        heroLogo.classList.remove('expanded');
        overlay.classList.remove('active');

        // Al culminar la reversa de 0.8s, restauramos el z-index normal
        resetActiveId = setTimeout(() => {
          heroLogo.parentElement.classList.remove('expanded-active');
        }, 800);
      }, 1000);
    });
  }
});
'use strict';
(() => {
  document.body.classList.add('js');
  const root = document.body;
  const sidebar = document.getElementById('siteSidebar');
  const menuToggle = document.getElementById('menuToggle');
  const backdrop = document.getElementById('sidebarBackdrop');
  const navLinks = [...document.querySelectorAll('.nav-item')];
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const copyEmail = document.getElementById('copyEmail');
  const certButton = document.getElementById('showCerts');
  const certList = document.getElementById('certList');
  const filters = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('.project-card')];
  const filterStatus = document.getElementById('filterStatus');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionEnabled = !reducedMotion.matches;
  if (motionEnabled) root.classList.add('motion-enabled');

  // Scroll progress uses the compositor-friendly transform property.
  const scrollProgress = document.getElementById('scrollProgress');
  let progressFrame = 0;
  const updateScrollProgress = () => {
    progressFrame = 0;
    const total = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const fraction = total ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;
    scrollProgress.style.setProperty('--scroll-fraction', fraction.toFixed(4));
  };
  const queueProgress = () => {
    if (!progressFrame) progressFrame = window.requestAnimationFrame(updateScrollProgress);
  };
  updateScrollProgress();
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress, { passive: true });

  // Highlights follow the pointer only on fine-pointer (mouse) devices.
  if (motionEnabled && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cards.forEach(card => {
      const art = card.querySelector('.project-art');
      card.addEventListener('pointermove', event => {
        const rect = art.getBoundingClientRect();
        art.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        art.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
  }

  const storedTheme = (() => { try { return localStorage.getItem('fahim-portfolio-theme'); } catch { return null; } })();
  function setTheme(theme) {
    const light = theme === 'light';
    root.classList.toggle('light', light);
    document.documentElement.style.colorScheme = light ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`);
    themeLabel.textContent = light ? 'Dark mode' : 'Light mode';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f6f8f9' : '#0b1321');
    try { localStorage.setItem('fahim-portfolio-theme', theme); } catch { /* e.g. storage disabled */ }
  }
  setTheme(storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark');
  themeToggle.addEventListener('click', () => setTheme(root.classList.contains('light') ? 'dark' : 'light'));

  function setMenu(open) {
    const isOpen = Boolean(open);
    sidebar.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuToggle.querySelector('use').setAttribute('href', isOpen ? '#ic-close' : '#ic-menu');
    backdrop.hidden = !isOpen;
    root.classList.toggle('menu-open', isOpen);
  }
  menuToggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('is-open')));
  backdrop.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  navLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.querySelector('.sidebar-brand').addEventListener('click', () => setMenu(false));
  window.matchMedia('(min-width: 941px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, {rootMargin:'-18% 0px -65% 0px', threshold:0});
    sections.forEach(section => activeObserver.observe(section));
    // Animate only semantic metrics (not 2025, which is a calendar year).
    // Always preserve the original text as fallback and for reduced-motion users.
    if (motionEnabled) {
      const counters = [...document.querySelectorAll('[data-count-to]')];
      const animateCounter = element => {
        const value = Number(element.dataset.countTo);
        const decimals = Number(element.dataset.countDecimals || 0);
        const pad = Number(element.dataset.countPad || 0);
        const textNode = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
        if (!textNode || !Number.isFinite(value)) return;
        const start = performance.now();
        const duration = 1150;
        const update = time => {
          const t = Math.min(1, (time - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = t === 1 ? value : value * eased;
          let display = decimals ? current.toFixed(decimals) : String(Math.round(current));
          if (pad) display = display.padStart(pad, '0');
          textNode.nodeValue = display;
          if (t < 1) window.requestAnimationFrame(update);
        };
        window.requestAnimationFrame(update);
      };
      const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: .35 });
      counters.forEach(counter => counterObserver.observe(counter));
    }
    // Reveal animation is additive: all content remains readable if JS or observers fail.
    const revealElements = [...document.querySelectorAll('.reveal')];
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {rootMargin:'0px 0px -40px 0px', threshold:.05});
    revealElements.forEach(el => revealObserver.observe(el));
    root.classList.add('js-animate');
  }

  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    // Clear any previous filter animation before updating visibility.
    cards.forEach(card => card.classList.remove('filter-enter'));
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let shown = 0;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.tech.split(' ').includes(filter);
      card.hidden = !match;
      if (match) {
        shown++;
        if (motionEnabled) {
          // Restart entrance on each filter, without transitioning a hidden card.
          void card.offsetWidth;
          card.classList.add('filter-enter');
        }
      }
    });
    filterStatus.textContent = `Showing ${shown} ${filter === 'all' ? '' : filter + ' '}project${shown === 1 ? '' : 's'}.`;
    queueProgress();
  }));

  certButton.addEventListener('click', () => {
    const expanded = certButton.getAttribute('aria-expanded') !== 'true';
    certButton.setAttribute('aria-expanded', String(expanded));
    certList.classList.toggle('expanded', expanded);
    certButton.firstChild.textContent = expanded ? 'Show fewer certifications ' : 'View all 12 certifications ';
    queueProgress();
  });

  copyEmail.addEventListener('click', async () => {
    const email = 'fahimfardin1045@gmail.com';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API not available');
      await navigator.clipboard.writeText(email);
      copyEmail.querySelector('use').setAttribute('href', '#ic-check');
      copyEmail.querySelector('span').textContent = 'Email copied!';
    } catch {
      // On file:// or untrusted hosts, clipboard access can be disabled. Expose the address so it can be copied manually.
      copyEmail.querySelector('span').textContent = email;
      copyEmail.setAttribute('aria-label', `Copy manually: ${email}`);
    }
  });

  const year = new Date().getFullYear();
  document.getElementById('sidebarYear').textContent = String(year);
  document.getElementById('footerYear').textContent = String(year);

  // Image Studio — opt-in owner-side editor on ?edit=1.
  // IndexedDB stores local changes; a downloadable manifest makes them public
  // only after its owner copies it into the static site and redeploys.
  (() => {
    const entries = [
      ['profile', 'Profile photo', 'Your sidebar portrait'],
      ['royal', 'The Royal Spice', 'Restaurant project'],
      ['citycare', 'CityCare Hospital', 'Healthcare project'],
      ['zenblog', 'ZenBlog', 'Blog and CMS'],
      ['hotel', 'Hotel Booking System', 'Hotel reservation project'],
      ['freshbasket', 'FreshBasket Fruits', 'Django fruit shop and operations']
    ];
    const editorOn = new URLSearchParams(location.search).get('edit') === '1';
    const modal = document.getElementById('imageStudio');
    const grid = document.getElementById('imageStudioGrid');
    const status = document.getElementById('imageStudioStatus');
    const input = document.getElementById('studioFileInput');
    const launch = document.getElementById('imageStudioOpen');
    const outputs = new Map([...document.querySelectorAll('[data-photo-target]')].map(el => [el.dataset.photoTarget, el]));
    // Built-in project screenshots are the permanent fallback if no custom
    // upload exists. Never clear an existing preview just because the image
    // editor's publishing manifest has no override for this project.
    const builtInImages = new Map([...outputs].map(([key, element]) => [key, element.getAttribute('src') || '']));
    const published = {};
    const changes = new Map();
    const objectURLs = new Map();
    const tileNodes = new Map();
    let chosenKey = 'profile';

    function setMessage(message, isError = false) {
      status.textContent = message;
      status.classList.toggle('is-error', isError);
    }
    function openDatabase() {
      return new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) return reject(new Error('Browser storage unavailable'));
        const request = indexedDB.open('fahim-portfolio-image-studio', 1);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains('images')) request.result.createObjectStore('images', { keyPath: 'key' });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Unable to access browser storage'));
      });
    }
    async function getSaved() {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const req = db.transaction('images', 'readonly').objectStore('images').getAll();
        req.onsuccess = () => { db.close(); resolve(req.result); };
        req.onerror = () => { db.close(); reject(req.error); };
      });
    }
    async function saveChange(record) {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('images', 'readwrite');
        tx.objectStore('images').put(record);
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); reject(tx.error || new Error('Unable to store the image')); };
      });
    }
    function getURL(key) {
      if (changes.has(key)) {
        const record = changes.get(key);
        // Removing an uploaded picture restores the built-in preview.
        if (record.removed) return builtInImages.get(key) || '';
        if (!objectURLs.has(key)) objectURLs.set(key, URL.createObjectURL(record.blob));
        return objectURLs.get(key);
      }
      return published[key] || builtInImages.get(key) || '';
    }
    function redraw() {
      entries.forEach(([key]) => {
        const src = getURL(key);
        const element = outputs.get(key);
        if (!element) return;
        if (src) element.src = src;
        else element.removeAttribute('src');
        element.hidden = !src;
        element.closest(key === 'profile' ? '.avatar' : '.project-art')?.classList.toggle('has-upload', !!src);
        const tile = tileNodes.get(key);
        if (tile) {
          const image = tile.querySelector('.studio-tile-image');
          if (src) image.src = src;
          else image.removeAttribute('src');
          image.hidden = !src;
          tile.classList.toggle('has-image', !!src);
          tile.querySelector('.studio-remove').disabled = !src;
        }
      });
    }
    function releaseURL(key) {
      if (objectURLs.has(key)) URL.revokeObjectURL(objectURLs.get(key));
      objectURLs.delete(key);
    }
    function openStudio(key) {
      if (!editorOn) return;
      if (!modal.open) modal.showModal();
      if (key) {
        const tile = tileNodes.get(key);
        if (tile) tile.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
    }
    function pickImage(key) {
      chosenKey = key;
      input.value = '';
      input.click();
    }
    if (editorOn) {
      launch.hidden = false;
      launch.addEventListener('click', () => openStudio());
      document.getElementById('imageStudioClose').addEventListener('click', () => modal.close());
      modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
      const avatar = document.querySelector('.avatar');
      const profileEdit = document.createElement('button');
      profileEdit.type = 'button';
      profileEdit.className = 'avatar-image-edit';
      profileEdit.setAttribute('aria-label', 'Upload or change profile photo');
      profileEdit.innerHTML = '<svg class="icon"><use href="#ic-camera"/></svg>';
      avatar.after(profileEdit);
      profileEdit.addEventListener('click', () => openStudio('profile'));
      entries.slice(1).forEach(([key]) => {
        const art = outputs.get(key)?.closest('.project-art');
        if (!art) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'art-image-edit';
        button.innerHTML = '<svg class="icon"><use href="#ic-camera"/></svg><span>Add image</span>';
        button.setAttribute('aria-label', `Upload an image for ${entries.find(entry => entry[0] === key)[1]}`);
        art.append(button);
        button.addEventListener('click', () => openStudio(key));
      });
      for (const [key, name, description] of entries) {
        const tile = document.createElement('div');
        tile.className = 'studio-tile';
        tile.dataset.slot = key;
        tile.innerHTML = `<div class="studio-thumb"><img class="studio-tile-image" alt="" hidden><span class="studio-placeholder"><svg class="icon"><use href="#ic-image"/></svg></span></div><div class="studio-tile-info"><strong></strong><span></span><div class="studio-tile-actions"><button class="studio-upload" type="button">Upload image</button><button class="studio-remove" type="button" disabled>Remove</button></div></div>`;
        tile.querySelector('strong').textContent = name;
        tile.querySelector('.studio-tile-info > span').textContent = description;
        tile.querySelector('.studio-upload').addEventListener('click', () => pickImage(key));
        tile.querySelector('.studio-remove').addEventListener('click', async () => {
          releaseURL(key);
          const record = { key, removed: true };
          changes.set(key, record);
          redraw();
          try {
            await saveChange(record);
            setMessage(`${name} image removed. Export again to publish this change.`);
          } catch {
            setMessage('Image removed for now, but browser storage is unavailable. Export to preserve your changes.', true);
          }
        });
        tile.addEventListener('dragover', e => { e.preventDefault(); tile.classList.add('is-dragging'); });
        tile.addEventListener('dragleave', e => { if (!tile.contains(e.relatedTarget)) tile.classList.remove('is-dragging'); });
        tile.addEventListener('drop', e => {
          e.preventDefault(); tile.classList.remove('is-dragging');
          if (e.dataTransfer?.files?.length) upload(e.dataTransfer.files[0], key);
        });
        grid.append(tile);
        tileNodes.set(key, tile);
      }
      input.addEventListener('change', () => { if (input.files?.length) upload(input.files[0], chosenKey); });
      document.getElementById('exportImageFile').addEventListener('click', exportImages);
    }
    function loadImage(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The selected file could not be opened as an image.')); };
        image.src = url;
      });
    }
    function toBlob(canvas, type, quality) {
      return new Promise(resolve => canvas.toBlob(resolve, type, quality));
    }
    async function optimize(file, key) {
      const img = await loadImage(file);
      const max = key === 'profile' ? 900 : 1800;
      const ratio = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Image processing is not available in this browser.');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await toBlob(canvas, 'image/webp', .83) || await toBlob(canvas, 'image/jpeg', .82);
      if (!blob) throw new Error('Could not optimize this image. Try another file.');
      return blob;
    }
    async function upload(file, key) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setMessage('Please choose a JPG, PNG, or WebP image.', true);
      if (file.size > 10 * 1024 * 1024) return setMessage('This file exceeds 10 MB. Please choose a smaller image.', true);
      setMessage(`Optimizing ${file.name}…`);
      try {
        const blob = await optimize(file, key);
        releaseURL(key);
        const record = { key, blob, removed: false };
        changes.set(key, record);
        redraw();
        try {
          await saveChange(record);
          setMessage('Image saved in this browser. Download the publishing file to make it part of your live website.');
        } catch {
          setMessage('Preview updated, but browser storage could not save it. Download the publishing file now.', true);
        }
      } catch (error) { setMessage(error.message || 'Unable to read this image.', true); }
    }
    function blobDataURL(blob) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(blob);
      });
    }
    async function exportImages() {
      const images = { ...published };
      setMessage('Preparing your publishing file…');
      try {
        for (const [key, record] of changes) {
          if (record.removed) delete images[key];
          else images[key] = await blobDataURL(record.blob);
        }
        if (!Object.keys(images).length) return setMessage('Add at least one image before exporting.', true);
        const file = new Blob([JSON.stringify({ version: 1, images }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'images.json';
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        setMessage('Downloaded images.json! Replace assets/img/uploads/images.json in your site folder, then redeploy.');
      } catch { setMessage('Could not export your images. Please try again.', true); }
    }
    async function initialize() {
      // On a hosted site this JSON provides visitor-visible, published images.
      // Local browser changes override published images for their owner only.
      const reads = await Promise.allSettled([
        fetch('assets/img/uploads/images.json', { cache: 'no-store' }).then(response => {
          if (!response.ok) throw new Error('No published images');
          return response.json();
        }),
        getSaved()
      ]);
      if (reads[0].status === 'fulfilled') {
        const data = reads[0].value?.images || {};
        for (const [key, value] of Object.entries(data)) {
          if (outputs.has(key) && typeof value === 'string' &&
              /^data:image\/(?:jpeg|png|webp);base64,/.test(value) && value.length < 8_000_000) published[key] = value;
        }
      }
      if (reads[1].status === 'fulfilled') {
        for (const record of reads[1].value) {
          if (outputs.has(record.key) && (record.removed === true || record.blob instanceof Blob)) changes.set(record.key, record);
        }
      } else if (editorOn) setMessage('Browser storage is blocked. You can still preview images and export them.', true);
      redraw();
    }
    initialize();
    window.addEventListener('pagehide', () => { for (const key of objectURLs.keys()) releaseURL(key); });
  })();
})();

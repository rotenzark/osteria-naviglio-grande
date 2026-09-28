/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'osteria-naviglio-grande',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si chiama (02 813 8367; per le serate 348 898 4923)
      message: '',
      ids: [],
    },
    /* Google (28/9/2026): dal lunedì al sabato 6–19, domenica chiuso. La cucina 12–14 e le serate a tema su prenotazione
       sono scritte nella tabella: lo stato «aperto» è quello del bar */
    hours: {
      0: [],
      1: [['06:00', '19:00']],
      2: [['06:00', '19:00']],
      3: [['06:00', '19:00']],
      4: [['06:00', '19:00']],
      5: [['06:00', '19:00']],
      6: [['06:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1180,
    EN: {
      "m.salta": "Skip to the recipe",
      "m.top": "Osteria Naviglio Grande, back to the top",
      "m.nav": "The steps of the recipe",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.passaggi": "The steps",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "m.tag": "Tags",
      "n.soffritto": "Soffritto",
      "n.tostatura": "Toasting",
      "n.vino": "Wine",
      "n.brodo": "Broth",
      "n.zafferano": "Saffron",
      "n.mantecatura": "Creaming",
      "n.onda": "The wave",
      "n.dove": "Where",
      "v.dove": "Address, hours, questions",
      "t.chiama": "Call",
      "h.categoria": "Osteria · bar · tobacconist",
      "h.titolo": "Lombard specialities.",
      "h.sommario": "Breakfast, bar and tobacconist from 6 am to 7 pm; the lunch break with home cooking, from noon to 2 pm; in the evening, theme nights by reservation. On the Naviglio Grande canal, at San Cristoforo.",
      "h.tempo": "Time",
      "h.tempoV": "6 am to 7 pm",
      "h.porzioni": "Servings",
      "h.porzioniV": "generous",
      "h.sera": "Evenings",
      "h.seraV": "by reservation",
      "h.voto": "Rating",
      "h.votoV": "on Google, 580 reviews",
      "h.chiama": "Call",
      "h.serata": "Book a theme night",
      "h.dove": "Where we are",
      "f.titolo": "A plate of risotto alla milanese",
      "f.desc": "A white plate seen from above, with the risotto drawn grain by grain. Eight threads of saffron fall and from each one the yellow spreads over the white rice until it is all golden; then the plate gets a little tap and the risotto makes a wave.",
      "f.pronto": "Ready when it makes a wave.",
      "f.rifai": "Another plate",
      "i.t": "Ingredients",
      "i.per": "for one osteria",
      "i.1": "breakfast, bar and tobacconist",
      "i.2": "the kitchen, at lunch",
      "i.3": "first courses, mains and sides of the day",
      "i.4": "drink included, at lunch",
      "i.5": "the cook’s risottos",
      "i.6": "theme night, by reservation",
      "i.7": "closing time, Monday to Saturday",
      "i.8": "Via Lodovico il Moro",
      "i.nota": "q.b. = quanto basta, “as much as needed”. Here, usually, plenty.",
      "p.t": "Method",
      "c1.t": "The soffritto",
      "c1.s": "The base: the dining room and the family",
      "c1.min": "minute 0",
      "c1.g": "Before the rice, the base: onion softening in butter over a low flame.",
      "c1.p1": "Here the base is the dining room: white and full of light, dark wooden chairs, cream tablecloths, wisteria hanging on the walls. And a family that runs it: whoever comes in for the first time, customers say, is welcomed like one of the family.",
      "c1.cap1": "The dining room, with the bar at the back.",
      "c1.p2": "Behind it, the long room of the big tables, for parties and groups: at the far end, the window looks out on the Naviglio.",
      "c1.cap2": "The long room: at the end, the Naviglio.",
      "c2.t": "Toasting the rice",
      "c2.s": "At 6, coffee",
      "c2.min": "minute 2",
      "c2.g": "The rice is toasted dry, stirring, until the grains turn glossy.",
      "c2.p1": "Here too the day starts early: at 6 in the morning the coffee machine is already hot. Breakfast, bar and tobacconist, Monday to Saturday, until 7 pm.",
      "c2.cap": "The brick bar with the wisteria. On the little blackboard, a theme night: risotto with ossobuco.",
      "c3.t": "A splash of wine",
      "c3.s": "The wine",
      "c3.min": "minute 3",
      "c3.g": "A glass of white wine over the hot rice: it sizzles, evaporates, leaves its scent.",
      "c3.p1": "In the dining room the wine has its own shelf and its own rack. At lunch, with the menu of the day, the drink is included.",
      "c3.cap": "The wine shelf and, beyond, the dining room.",
      "c4.t": "The broth, one ladle at a time",
      "c4.s": "Lunch break with home cooking",
      "c4.min": "minutes 4–18",
      "c4.g": "Then the boiling broth, one ladle at a time: wait for the rice to drink it, then add another.",
      "c4.p1": "The kitchen opens at noon, for two hours: from 12 to 2 pm there is the lunch break with home cooking. The menu of the day is on the small blackboards, two first courses, two mains and two sides, and the next day it is wiped off and written again.",
      "c4.cap": "The blackboards of one day: first courses, mains, sides.",
      "c5.t": "The saffron",
      "c5.s": "The Lombard specialities",
      "c5.min": "halfway through",
      "c5.g": "Halfway through, the saffron dissolved in a drop of broth: the rice turns gold.",
      "c5.p1": "This is the moment of the Lombard specialities: risotto alla milanese with ossobuco, the cotoletta. Then gnocco fritto with cured meats, the cook’s other risottos (with truffle, for instance) and the desserts, like the tiramisù, made in house.",
      "c5.d1": "Risotto alla milanese with ossobuco",
      "c5.d2": "The cotoletta, the Milanese cutlet",
      "c5.d3": "Gnocco fritto and cured meats",
      "c5.d4": "Truffle risotto",
      "c5.d5": "The tiramisù",
      "c5.d6": "The millefoglie",
      "c5.nota": "Customers’ photos, taken in different years.",
      "c6.t": "The mantecatura",
      "c6.s": "Theme nights, by reservation",
      "c6.min": "minute 18",
      "c6.g": "Heat off: cold butter and cheese, stir them through, and the risotto turns creamy.",
      "c6.p1": "In the evening the osteria opens for theme nights, by reservation: paella with sangria, risotto alla milanese with ossobuco, Valentine’s Day with rose petals on the tables, Easter lunch, the Christmas dinner. And family celebrations: birthdays, first communions, christenings.",
      "c6.p2": "The dates are posted on their Facebook page. To book, call +39 348 898 4923.",
      "c6.cta": "Book a theme night",
      "c6.fb": "The dates on Facebook",
      "c6.cap1": "Friday the 17th: paella and sangria.",
      "c6.cap2": "The risotto with ossobuco of a night in March.",
      "c6.cap3": "Rose petals on the table.",
      "c6.cap4": "The Christmas 2022 menu.",
      "c7.t": "All’onda",
      "c7.s": "Serve",
      "c7.min": "minute 20",
      "c7.g": "The risotto is ready when, as you shake the plate, it moves like a wave (all’onda). Serve at once.",
      "r.voto": "on Google, 580 reviews",
      "r.google": "on Google",
      "r.grazie": "And the owner, replying to a review (“a simple ‘thank you’ would not be enough”):",
      "r.nota": "From the Google reviews, as they were written (in Italian).",
      "a.sala": "The white dining room with tables laid with cream cloths and dark chairs; at the back, the brick bar with the osteria’s sign.",
      "a.salaLunga": "The long room with the big table laid and the wooden sideboard; at the far end, the window on the snowy Naviglio.",
      "a.bancone": "The brick bar with purple and pink wisteria hanging, the shelves of bottles, the Osteria Naviglio Grande sign and a small blackboard of the theme nights.",
      "a.vini": "The wooden shelf of red wines, the rack of bottles lying down and, through the door, the corridor with the wisteria and the laid tables.",
      "a.lavagne": "Three small blackboards on the wall, written in chalk: first courses, mains and sides of the day.",
      "a.ossobuco": "A plate of risotto alla milanese, yellow with saffron, with ossobuco in its sauce and parsley.",
      "a.cotoletta": "The breaded cotoletta with lemon and fried green peppers, on the yellow placemat.",
      "a.gnocco": "Gnocco fritto in a white bowl, next to a board of cured meats with rocket.",
      "a.tartufo": "White risotto with slices of black truffle and parsley, in the baking dish.",
      "a.tiramisu": "Tiramisù in a square glass cup, with cocoa on top.",
      "a.millefoglie": "A millefeuille with cream and icing sugar, on a square plate.",
      "a.lavagnaSerate": "A small blackboard on the bar: theme nights, Friday the 17th, paella and sangria, by reservation.",
      "a.marzo": "Risotto alla milanese with ossobuco in its sauce, on a white plate.",
      "a.petali": "Red and pink rose petals on the table, in front of a plate.",
      "a.natale": "Their Christmas 2022 menu, with poinsettias drawn around it: house starters, first courses, main course and the chef’s dessert.",
      "a.naviglio": "The Naviglio Grande seen from the bridge: still water reflecting the sky, houses on both banks.",
      "a.facciata": "The osteria’s windows lit up at night, with the Naviglio Grande sign over the door.",
      "w.occhiello": "Recipe notes",
      "w.t": "Where and when.",
      "w.mezzi": "On the bank of the Naviglio Grande canal, at San Cristoforo. The M4 metro and San Cristoforo railway station are two hundred metres away; there is tram 14, and buses 95, 49, 47, 325, 324, 351 and 326 stop almost outside.",
      "w.orari": "Opening hours",
      "w.bar": "Bar and tobacconist",
      "w.cucina": "Kitchen",
      "w.sera": "Evenings: theme nights, by reservation.",
      "w.tel": "Phone",
      "w.serate": "Theme nights",
      "w.strada": "Directions",
      "w.mappa": "Map: Osteria Naviglio Grande, Via Lodovico il Moro 139, Milan",
      "w.cap1": "The Naviglio Grande, a few steps away.",
      "w.cap2": "The windows, at night.",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "q.t": "Questions",
      "q.1": "Is it open in the evening?",
      "q.1r": "In the evening there are the theme nights, by reservation: book on +39 348 898 4923. The bar closes at 7 pm.",
      "q.2": "Is there a menu of the day?",
      "q.2r": "Yes, at lunch, from noon to 2 pm: two first courses, two mains and two sides that change every day, with a drink included.",
      "q.3": "Can I bring children?",
      "q.3r": "Yes: there are high chairs and a children’s menu.",
      "q.4": "Are there vegan dishes?",
      "q.4r": "Yes, there are vegan dishes too.",
      "q.5": "Is it wheelchair accessible?",
      "q.5r": "Yes: the entrance, the tables and the toilet.",
      "q.6": "On Sundays?",
      "q.6r": "Closed on Sundays. Monday to Saturday it opens at 6 am.",
      "tg.1": "Breakfast",
      "tg.2": "Bar",
      "tg.3": "Tobacconist",
      "tg.4": "Lunch break",
      "tg.5": "Home cooking",
      "tg.6": "Lombard specialities",
      "tg.7": "Theme nights",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · photos from the Google listing (by the osteria and by customers), reviews from Google, their words from Google and Facebook (September 2026). The plate of risotto is drawn.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ OSTERIA NAVIGLIO GRANDE — «Specialità cucina lombarda.» ══════════
     La pagina è la ricetta dell'osteria, come in una rivista di cucina: il procedimento del risotto alla milanese dà
     l'ordine dei capitoli, col minuto della cottura nel margine.
     la FIRMA — il piatto visto dall'alto: sul riso bianco cadono otto pistilli di zafferano; da dove toccano, il giallo
     si allarga chicco per chicco con un fronte irregolare (i tempi d'arrivo li calcola _ong_risotto.mjs); poi il piatto
     dà un colpetto e il risotto fa l'onda: un'increspatura lo attraversa e una luce la segue.
     Stato finale = l'HTML/SVG (risotto giallo, pistilli sopra). Senza JS e con reduced-motion: lo stato finale. L'attesa è
     la classe firma-attesa dell'head (riso bianco, niente zafferano, via CSS), tolta dall'head dopo 2,5 s se il codice non
     arriva. Un rAF a tempo: la firma non dipende da GSAP. */
  var DATI = {"arrivo":[2267,2321,2158,2331,2374,2309,2056,2133,2244,2179,2398,2287,2217,2471,2414,1961,1908,2038,2184,2299,2123,2055,2101,2372,2319,1737,2248,2391,1941,1837,2053,1991,1730,2161,1858,1670,2427,2247,2187,2049,1895,2132,2319,2237,1606,1675,1948,1791,1722,1576,1558,1863,2055,2118,2440,1799,1581,1487,1576,2211,1997,1707,1925,1973,1505,1456,1806,2493,2038,2330,1615,1406,1608,1915,1689,2525,1887,1520,1427,1354,1916,2129,1505,2386,1690,1600,1369,2005,1709,1870,1827,1828,2412,1614,1832,1514,1356,1748,2299,1535,1260,1825,2163,2345,1907,1371,2042,1716,1443,1766,1666,1763,1632,1955,2031,2284,1579,1249,1841,2170,2266,1733,2184,1691,1890,1536,1346,1328,1507,2179,1749,2136,1754,1789,1718,2017,1666,1668,2013,1884,2153,2045,1491,1942,2150,1795,1377,2273,1521,1860,1792,1725,2091,1700,1660,1773,2029,1720,1633,2160,1446,2050,1507,2041,1740,1529,1807,1939,2277,1883,1951,1864,1903,1614,1793,1962,1841,1963,1919,1811,2116,1937,1614,1683,1565,1787,1713,1842,1776,1902,1905,1861,1621,2181,1847,2265,1853,1866,1758,2327,1859,1938,1747,1710,2025,1714,1772,1675,1703,1843,1854,1805,1746,1756,1695,1716,1816,2086,1764,1862,1747,1840,1779,1822,1680,1756,1765,1708,1693,1752,1710,2220,1884,1648,1713,2305,1661,1669,1940,1787,1709,1686,1833,1676,1730,2101,1740,1803,1828,1643,1799,1688,1767,1756,1785,1638,1665,1625,2221,1704,1626,1838,1641,1943,1646,1613,1835,1628,1860,1837,1538,1576,1533,1589,1679,1601,1681,1604,1740,1730,1508,1598,1707,2163,2288,1905,1628,1492,1564,1519,2021,1830,1472,1814,1615,1729,1522,1546,1590,2380,1797,1904,1502,1685,1361,1622,1393,1641,1540,2146,1410,1720,1478,1898,2317,1590,1480,1553,1424,1493,1573,1308,1444,1792,1447,2442,1435,1371,1486,1609,1783,1742,1702,1459,1622,1273,1862,1910,2026,2177,1562,1219,1496,1289,1400,1833,1697,1859,1566,2535,2480,2362,1488,1276,1492,1480,1615,1377,1394,1731,1566,1771,1583,1806,1961,1171,1348,1120,1542,1413,1163,2111,1856,2578,1947,1864,2494,1701,1250,1407,1217,1797,1661,2284,1652,1418,1676,1492,1437,1895,1122,2040,1744,1077,1313,1461,1280,2564,1562,1013,1923,2197,1189,1798,1787,1456,1853,1751,2407,1517,1384,1866,2030,1898,2518,1574,1185,1043,1367,1543,1837,1648,1070,1260,2221,1890,1295,1570,1856,1949,2566,1567,1933,2357,1488,1526,2462,1131,1408,1884,1783,2027,1539,1188,2528,1520,1929,2179,1667,1127,1862,1374,1481,1899,2432,1290,1449,1236,2572,1955,1498,1836,1322,1521,2013,1441,1404,1769,1494,1450,1229,2522,2237,1671,2116,1784,1481,2326,1835,1260,1404,1322,1728,2444,1342,1866,1854,1707,2531,1265,1383,1364,1594,1311,1439,1473,1236,2063,2203,1454,1263,1960,1383,1659,1227,1767,1521,1771,1628,1607,1431,1776,1603,2352,2478,1548,1275,1509,2174,1112,1528,1608,1931,1661,1295,2036,1096,1804,1412,1528,1806,1684,1333,1125,1563,1183,1709,2275,1779,1081,1648,2115,1553,1498,1388,1019,1658,1705,991,1216,1657,1942,1712,2352,1655,1147,1616,1304,1696,1090,2230,1263,1685,2041,1784,1779,1485,1666,939,1715,1910,1561,976,2138,1660,1153,1374,1770,996,1765,1483,1586,2346,1185,2003,1356,1697,2079,1663,1818,2220,1103,882,1256,1017,1787,1488,1238,1820,1550,1410,956,1886,1025,1385,2123,1600,1856,1886,1302,1139,1705,1228,1160,1635,1363,1958,1323,1799,1323,2207,1744,1855,1501,1096,1018,1494,1019,1659,2043,1126,1303,1351,1972,1737,1581,1722,1532,1259,1910,1352,1669,1304,1257,1236,1126,1589,2103,1187,1359,1195,1925,1289,1828,1137,2046,1453,1348,1629,1729,1792,1517,1294,1209,1399,1178,1635,1975,1549,1134,1299,1260,1246,1973,1884,1720,1559,1395,1641,1408,1356,1276,1706,1470,1182,1222,1837,1327,1537,1623,1351,1606,1807,1967,1411,1570,1354,1501,1365,1735,1350,1672,1197,1435,1514,1744,1639,1364,1848,1495,1431,1650,1236,1945,1485,1600,1303,1473,1601,1291,1724,1461,1736,1481,1465,1359,1777,1575,1681,1875,1431,1496,1559,1542,1821,1671,1677,1380,1750,1341,1344,1567,1600,1445,1781,1479,1584,1662,1560,1904,1614,1758,1631,1446,1458,1640,1857,1698,1621,1484,1756,1744,1682,1565,1828,1724,1754,1730,1763,1757,1832,1774,1768,1883,1885,1855],"s":[-89,-81,-97,-71,-56,-64,-99,-89,-75,-82,-46,-52,-67,-31,-39,-95,-102,-85,-55,-43,-71,-76,-61,-20,-27,-109,-35,-8,-78,-91,-52,-63,-101,-40,-83,-113,1,-19,-25,-44,-66,-31,-3,-11,-104,-91,-49,-73,-80,-96,-110,-55,-33,-15,11,-60,-117,-100,-83,0,-23,-65,-42,-33,-109,-91,-49,20,-10,10,-69,-99,-121,-23,-55,32,-37,-72,-103,-88,-15,4,-110,19,-129,-60,-80,-2,-48,-142,-23,-29,28,-118,-36,-65,-96,-132,17,-109,-86,-14,10,39,-5,-72,-147,-124,-100,-28,-47,-36,-112,-139,7,31,-55,-85,-131,47,22,-12,16,-20,1,-101,-89,-71,-60,40,-119,-144,-27,-5,-39,-135,-106,-45,11,-126,29,49,-92,61,21,-26,-78,-151,-58,4,-115,-7,39,-16,-47,-33,46,-104,-96,-138,-68,-131,-83,36,-38,-60,-18,19,-145,68,-123,10,62,-52,-10,33,-114,45,26,-29,-131,52,-81,-90,-71,-105,-42,3,-34,-19,41,78,-57,-135,72,-143,-1,63,-95,-149,50,-117,13,-81,-124,21,31,-70,-46,-8,-26,-102,-86,-39,-62,-50,85,-130,45,-17,-72,-110,69,-31,29,58,77,38,15,7,-94,-140,-23,25,66,-146,-85,-78,-120,-52,3,52,-110,46,-6,-132,88,-41,-34,36,-59,-95,96,-102,-17,74,12,30,-138,-9,-68,-24,20,-120,86,6,-48,0,-42,-110,-74,-84,66,47,-58,39,97,30,105,-15,77,18,-96,-131,-138,-33,-5,58,-62,85,-122,-42,-74,-23,-87,-49,9,2,97,-141,-102,-112,16,-11,72,-53,82,108,39,-124,58,-94,-63,-29,-131,29,94,0,53,-74,-80,67,-67,-19,49,-136,14,89,25,-4,-95,-42,-11,8,-50,82,-101,-29,-111,-118,112,75,106,60,98,-34,-84,-21,-55,-136,-128,-122,6,91,42,32,-74,15,50,-42,-66,-13,1,-90,-100,85,25,75,120,106,67,-104,-32,-130,-23,-16,-121,-73,60,49,95,-82,-65,-109,0,18,-53,45,114,-87,89,-96,-44,73,57,34,103,-122,10,82,-27,-99,66,-8,-69,27,-34,-57,-108,125,112,-13,-86,-76,-115,45,100,88,59,34,-60,4,79,66,-92,-15,108,22,-44,-23,-119,13,-31,-99,54,127,-106,96,117,-50,-6,-74,45,75,-111,31,-62,-82,2,88,-54,65,41,-17,-98,73,21,103,-114,-22,58,-33,111,127,-69,51,34,-39,11,122,87,-106,-83,1,-75,-7,66,-89,-55,96,74,81,-44,-98,43,-13,-21,-30,-105,32,62,104,131,54,12,118,41,-68,-78,74,24,-61,91,1,49,-49,7,-5,-39,-31,99,-18,129,-88,-96,117,66,86,-73,41,108,125,-55,-22,19,-62,53,-8,13,97,-47,-40,75,34,-28,28,135,-79,-13,62,121,-66,94,9,84,46,-33,-17,53,26,111,-50,131,-82,105,72,4,20,119,38,-73,80,-21,-56,-37,140,95,-9,62,-26,-43,1,50,-63,-13,79,91,132,70,118,9,104,-75,34,-47,20,112,-54,-17,143,-67,42,62,28,50,-28,1,88,130,-6,98,58,-37,76,13,-59,110,139,146,30,46,119,38,86,-17,11,-48,21,128,96,-62,-29,-40,106,54,63,-4,74,-21,-52,84,38,9,149,127,114,-31,-7,24,143,100,122,35,50,19,66,-14,-52,60,7,88,-44,96,138,75,153,108,45,-21,130,-36,-5,56,84,5,31,123,-44,117,25,43,16,69,151,144,-29,-8,53,-19,104,97,81,131,4,23,40,142,14,117,124,66,-11,-33,152,61,-3,78,112,90,-24,52,-15,37,101,6,135,126,18,144,108,74,-5,33,152,68,120,28,100,4,47,-10,92,135,14,85,54,-17,115,128,147,23,65,110,83,142,125,5,32,-2,40,49,14,75,60,137,29,99,122,23,150,112,133,92,57,44,108,143,79,72,54,131,88,119,66,139,126,96,110,103,80,87,127,119,94,102,110],"k":[0,0,1,0,4,2,1,1,2,1,1,0,2,1,0,2,0,4,2,3,3,4,3,4,0,3,4,0,1,1,2,0,3,0,1,3,3,0,1,1,0,1,0,1,3,0,4,0,3,2,2,3,2,3,0,0,4,2,0,1,2,0,4,0,2,0,2,0,3,4,0,1,4,0,1,0,4,0,4,4,1,0,2,1,2,4,1,0,3,3,3,2,4,2,2,4,0,0,4,0,1,0,0,0,2,2,2,0,1,2,4,1,2,1,2,3,2,0,1,4,3,2,4,0,0,2,3,0,2,0,0,4,1,1,2,3,0,1,0,3,0,0,0,1,3,4,3,0,0,4,1,0,0,0,4,2,1,4,0,0,2,0,0,3,0,0,2,1,3,2,2,0,0,0,4,4,1,1,0,0,1,3,1,1,3,2,0,4,1,4,0,4,0,1,1,2,1,2,2,0,4,2,4,4,1,0,3,3,1,1,0,0,0,2,0,3,2,2,1,1,4,1,0,4,0,1,4,3,3,2,1,3,0,3,2,4,1,4,3,3,3,4,2,1,1,0,0,2,4,2,1,0,2,4,4,4,1,3,3,1,2,0,0,0,0,0,4,1,4,4,2,4,0,1,0,2,3,1,0,0,1,3,1,0,2,0,0,2,0,0,0,0,2,1,0,1,0,3,2,4,4,4,0,4,3,4,0,0,0,4,2,4,1,0,0,1,1,0,2,1,3,2,1,4,1,4,0,4,1,4,0,3,0,2,0,1,0,2,4,0,0,0,0,0,0,1,2,4,2,0,1,1,0,0,4,3,4,2,2,2,4,4,2,1,0,2,0,2,2,3,0,4,4,2,1,0,1,4,0,0,3,3,1,0,1,0,0,3,3,2,1,4,4,4,2,0,2,0,4,0,4,2,0,0,0,1,0,4,2,2,0,4,3,1,2,2,3,2,2,1,2,0,3,0,0,3,2,1,4,4,0,4,0,4,0,1,0,0,4,2,3,2,4,3,4,0,4,3,1,1,3,3,4,4,1,1,4,0,3,0,4,4,2,1,1,1,4,0,1,0,2,0,0,0,0,1,0,0,0,3,3,0,1,1,4,3,0,4,1,3,2,4,4,1,1,1,0,1,2,2,2,2,0,0,3,4,0,3,0,4,0,1,3,0,0,3,1,2,3,0,0,1,1,0,0,4,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,4,4,1,2,2,1,0,2,4,1,4,3,0,3,0,1,1,2,3,1,1,3,1,2,0,0,2,1,4,3,1,1,4,0,3,1,2,1,4,0,3,2,0,0,3,1,2,3,1,0,1,2,4,0,4,4,0,3,3,1,0,1,2,2,1,0,1,4,1,2,0,0,2,4,1,4,1,1,2,3,0,2,3,4,0,4,1,0,0,1,0,0,4,2,2,3,1,1,2,1,1,2,1,4,2,2,1,4,3,0,1,1,4,0,1,0,2,4,3,2,1,2,4,4,0,4,3,0,1,4,0,3,1,2,2,3,1,4,1,0,0,1,4,0,3,1,3,4,0,1,4,3,4,3,4,2,0,0,0,2,1,3,0,4,3,2,4,4,1,0,0,4,0,3,0,1,4,2,2,1,2,1,1,1,2,1,1,3,0,2,1,2,2,3,0,0,3,4,1,4,4,0,3,3,0,1,2,2,3,1,3,1,0,0,2,1,4,4,1,4,0,4,0,1,0,3,4,4,0,2,0,3,1,4],"bianco":["#F4EFE2","#F1EADB","#F6F2E7","#EFE7D5","#F3EDDF"],"giallo":["#ECB53A","#E5A92D","#F1C24E","#DE9F22","#F4C95E"],"pistilli":[{"x":346.2,"y":309.2,"a":35,"a0":89,"t":860},{"x":349,"y":225.1,"a":144,"a0":70,"t":970},{"x":326.9,"y":378.6,"a":206,"a0":243,"t":1080},{"x":187,"y":250.4,"a":229,"a0":267,"t":1190},{"x":295.5,"y":261.1,"a":144,"a0":159,"t":1300},{"x":215.4,"y":318.1,"a":229,"a0":239,"t":1410},{"x":262.9,"y":364.8,"a":11,"a0":53,"t":1520},{"x":244.7,"y":205.6,"a":82,"a0":33,"t":1630}],"onda":{"dx":0.9781,"dy":-0.2079,"w":24,"A":6.5,"f0":-241,"f1":243,"ang":-12},"centro":[278,285],"tempi":{"cadutaInizio":320,"caduta":540,"passo":110,"giallo":300,"velocita":0.105,"giallFine":2878,"colpetto":3038,"onda":[3128,4178],"fine":4298}};
  var figuraP = document.getElementById('piatto');
  var svgP = figuraP && figuraP.querySelector('.piatto__svg');
  var chicchiEl = svgP ? [].slice.call(svgP.querySelectorAll('#chicchi path')) : [];
  var pistilliEl = svgP ? [].slice.call(svgP.querySelectorAll('.pistillo')) : [];
  var aloniEl = pistilliEl.map(function (g) { return g.querySelector('.pistillo__alone'); });
  var cremaG = svgP && svgP.querySelector('#cremaGialla');
  var luce = svgP && svgP.querySelector('#ondaLuce');
  var tutto = svgP && svgP.querySelector('#piattoTutto');
  var rifai = document.getElementById('rifaiPiatto');
  var TP = DATI.tempi, O = DATI.onda, N = chicchiEl.length;
  var trasfPistilli = pistilliEl.map(function (g) { return g.getAttribute('transform') || ''; });
  var trasfLuce = luce ? luce.getAttribute('transform') : '';
  var faseP = 'fatta', rafP = 0, guardiaP = 0, larghezzaAvvio = 0, corse = 0;
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background, rAF fermo) la pagina va allo stato
     finale. Si riarma a ogni fotogramma: una guardia a durata fissa chiudeva la firma a metà quando i fotogrammi
     arrivavano lenti (il check col tempo in mano, un telefono lento), e il fotogramma rimasto in coda la riapriva */
  function sorveglia() { clearTimeout(guardiaP); guardiaP = setTimeout(chiudiPiatto, 1500); }
  var ultimo = [], spostato = [];
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var hex = function (h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; };
  var mix = function (a, b, t) { return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')'; };
  var BIANCHI = DATI.bianco.map(hex), GIALLI = DATI.giallo.map(hex);
  var primoTocco = Math.min.apply(null, DATI.pistilli.map(function (p) { return p.t; }));
  var ALTO = 560; /* i pistilli partono sopra il piatto, fuori dal riquadro dell'SVG */

  /* un pistillo: cade accelerando (fuori dal piatto finché non entra dal bordo alto), ruota verso la sua posizione,
     tocca e fa un piccolo rimbalzo; l'alone giallo si apre dove ha toccato */
  function mettiPistilli(t) {
    for (var i = 0; i < pistilliEl.length; i++) {
      var p = DATI.pistilli[i], t0 = p.t - TP.caduta, u = c01((t - t0) / TP.caduta), dy = -ALTO * (1 - u * u), rot = p.a0 + (p.a - p.a0) * (1 - Math.pow(1 - u, 2));
      var tb = t - p.t;
      if (tb > 0 && tb < 200) dy = -6 * Math.sin(Math.PI * tb / 200);
      pistilliEl[i].setAttribute('transform', 'translate(' + p.x + ' ' + (p.y + dy).toFixed(1) + ') rotate(' + rot.toFixed(1) + ')');
      if (aloniEl[i]) aloniEl[i].style.opacity = (0.42 * c01(tb / 420)).toFixed(3);
    }
  }
  /* i chicchi: ognuno ingiallisce al suo tempo (si riscrive solo chi cambia) */
  function mettiChicchi(t) {
    for (var j = 0; j < N; j++) {
      var u = c01((t - DATI.arrivo[j]) / TP.giallo);
      if (u === ultimo[j]) continue;
      ultimo[j] = u;
      chicchiEl[j].style.fill = mix(BIANCHI[DATI.k[j]], GIALLI[DATI.k[j]], u);
    }
    if (cremaG) cremaG.style.opacity = c01((t - primoTocco) / (TP.giallFine - primoTocco)).toFixed(3);
  }
  /* il colpetto: il piatto scatta di lato e torna, smorzato */
  function mettiColpetto(t) {
    var d = t - TP.colpetto, x = 0;
    if (d > 0 && d < 90) x = -7 * d / 90;
    else if (d >= 90 && d < 700) x = -7 * Math.exp(-(d - 90) / 120) * Math.cos((d - 90) / 58);
    if (x) tutto.setAttribute('transform', 'translate(' + x.toFixed(2) + ' 0)');
    else tutto.removeAttribute('transform');
  }
  /* l'onda: un impulso (derivata di una gaussiana) corre lungo la direzione dell'onda; i chicchi davanti al fronte si
     spingono avanti, quelli dietro tornano; la luce sta sul fronte */
  function mettiOnda(t) {
    var u = c01((t - TP.onda[0]) / (TP.onda[1] - TP.onda[0]));
    var dentroOnda = t > TP.onda[0] && t < TP.onda[1];
    var e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, f = O.f0 + (O.f1 - O.f0) * e;
    for (var j = 0; j < N; j++) {
      var d = 0;
      if (dentroOnda) { var x = (DATI.s[j] - f) / O.w; if (x > -4 && x < 4) d = O.A * -x * Math.exp(-x * x / 2) * 1.6487; }
      if (Math.abs(d) > 0.04) { chicchiEl[j].style.transform = 'translate(' + (d * O.dx).toFixed(2) + 'px,' + (d * O.dy).toFixed(2) + 'px)'; spostato[j] = 1; }
      else if (spostato[j]) { chicchiEl[j].style.removeProperty('transform'); spostato[j] = 0; }
    }
    if (luce) {
      luce.setAttribute('transform', 'translate(' + DATI.centro[0] + ' ' + DATI.centro[1] + ') rotate(' + O.ang + ') translate(' + f.toFixed(1) + ' 0)');
      luce.style.opacity = dentroOnda ? Math.sin(Math.PI * u).toFixed(3) : '0';
    }
  }
  function chiudiPiatto() {
    cancelAnimationFrame(rafP); rafP = 0;
    clearTimeout(guardiaP);
    for (var j = 0; j < N; j++) { chicchiEl[j].style.removeProperty('fill'); chicchiEl[j].style.removeProperty('transform'); }
    ultimo = []; spostato = [];
    pistilliEl.forEach(function (g, i) { g.setAttribute('transform', trasfPistilli[i]); if (aloniEl[i]) aloniEl[i].style.removeProperty('opacity'); });
    if (cremaG) cremaG.style.removeProperty('opacity');
    if (luce) { luce.setAttribute('transform', trasfLuce); luce.style.removeProperty('opacity'); }
    if (tutto) tutto.removeAttribute('transform');
    if (figuraP) figuraP.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseP = 'fatta';
    if (rifai) rifai.disabled = false;
  }
  function avviaPiatto() {
    /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: riso bianco in linea, pistilli sopra il piatto,
       crema gialla e aloni spenti; poi via la classe */
    for (var j = 0; j < N; j++) { chicchiEl[j].style.fill = mix(BIANCHI[DATI.k[j]], BIANCHI[DATI.k[j]], 0); ultimo[j] = 0; spostato[j] = 0; }
    mettiPistilli(-1e6);
    if (cremaG) cremaG.style.opacity = '0';
    if (luce) luce.style.opacity = '0';
    root.classList.remove('firma-attesa');
    faseP = 'corre'; figuraP.setAttribute('data-firma', 'corre');
    larghezzaAvvio = window.innerWidth;
    if (rifai) rifai.disabled = true;
    var t0 = null, corsa = ++corse;
    function fotogramma(ts) {
      rafP = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseP !== 'corre' || corsa !== corse) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      mettiPistilli(t);
      mettiChicchi(t);
      mettiColpetto(t);
      if (t >= TP.onda[0] - 20) mettiOnda(t);
      if (t >= TP.fine) { chiudiPiatto(); return; }
      sorveglia();
      rafP = requestAnimationFrame(fotogramma);
    }
    sorveglia();
    rafP = requestAnimationFrame(fotogramma);
  }
  function inVistaPiatto() {
    if (!svgP) return false;
    var r = svgP.getBoundingClientRect(), vh = window.innerHeight || 800;
    return r.top < vh * 0.85 && r.bottom > vh * 0.2;
  }

  /* l'indice della testata segna il passaggio in cui ti trovi */
  var linkIndice = [].slice.call(document.querySelectorAll('#mainNav a'));
  var passi = linkIndice.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaIndice() {
    var y = (document.getElementById('testata') || { offsetHeight: 64 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < passi.length; i++) { if (passi[i] && passi[i].getBoundingClientRect().top <= y) ora = i; }
    linkIndice.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickIndice = 0;
  window.addEventListener('scroll', function () {
    if (tickIndice) return;
    tickIndice = requestAnimationFrame(function () { tickIndice = 0; aggiornaIndice(); });
  }, { passive: true });
  aggiornaIndice();

  /* lo stato degli orari anche nelle note, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(copiaStato).observe(root, { attributes: true, attributeFilter: ['lang'] });

  if (figuraP && svgP && N === DATI.arrivo.length && pistilliEl.length === DATI.pistilli.length && tutto) {
    try { clearTimeout(window.__attesaPiatto); } catch (e) {}
    window.__piatto = {
      stato: function () { return { fase: faseP, colpetto: tutto.getAttribute('transform') || '' }; },
      tempi: TP,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su un passaggio (#brodo): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaPiatto();
    /* perché la firma è partita o no (lo legge il check) */
    window.__piatto.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgP.getBoundingClientRect().top, vh: window.innerHeight };
    if (!daFare || ancora || !inVista) chiudiPiatto();
    else avviaPiatto();
    /* un resize chiude la firma solo se cambia la LARGHEZZA: sul telefono arrivano resize della sola altezza (la barra
       del browser che si nasconde) e uno a vuoto subito dopo il caricamento (#228) */
    window.addEventListener('resize', function () { if (faseP === 'corre' && Math.abs(window.innerWidth - larghezzaAvvio) > 1) chiudiPiatto(); });
    if (rifai) rifai.addEventListener('click', function () { if (faseP === 'fatta' && !reducedMotion) avviaPiatto(); });
  }
})();

// main.js

// LocalStorage settings
localStorage.removeItem('konographic_opt_out');
localStorage.setItem('konographic_tracking', 'always');

// kgOnReady utility
window.kgReady = [];
window.kgOnReady = fn => window.kgReady.push(fn);

// Google Analytics (gtag)
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('set', 'developer_id.dZGVlNj', true);
gtag('config', 'G-J464N50WQE');

// Google Tag Manager
(function(w,d,s,l,i){
  w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
  j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TFXW7PL');

// Cargar script2.js asíncrono con fallback anti-flicker
var wfClientScript = document.createElement("script");
wfClientScript.src = "js/script2.js";
wfClientScript.async = true;
wfClientScript.onerror = function() {
  document.documentElement.className =
    document.documentElement.className.replace(/ ?anti-flicker/, "");
};
document.head.appendChild(wfClientScript);


  
  (function(w, d) {
    var cl = d.documentElement;
    cl.className += " wf-js";
    if ('ontouchstart' in w) cl.className += " wf-touch";
  })(window, document);

function copiarTexto(texto, el) {
  navigator.clipboard.writeText(texto);

  const textoOriginal = el.querySelector('.button-text').textContent;
  el.querySelector('.button-text').textContent = texto.includes('@') ? 'Correo copiado' : 'Teléfono copiado';

  setTimeout(() => {
    el.querySelector('.button-text').textContent = textoOriginal;
  }, 2000);
}

function copiarTexto(texto, el) {
    navigator.clipboard.writeText(texto);

    const textoOriginal = el.querySelector('.button-text').textContent;
    el.querySelector('.button-text').textContent = texto.includes('@') ? 'Correo copiado' : 'Teléfono copiado';

    setTimeout(() => {
      el.querySelector('.button-text').textContent = textoOriginal;
    }, 2000);
  }

  function copiarTexto(texto, el) {
    navigator.clipboard.writeText(texto);

    const textoOriginal = el.querySelector('.button-text').textContent;
    el.querySelector('.button-text').textContent = texto.includes('@') ? 'Correo copiado' : 'Teléfono copiado';

    setTimeout(() => {
      el.querySelector('.button-text').textContent = textoOriginal;
    }, 2000);
  }

      let menuTimeline;


function animateHeading(heading) {
  return gsap.from(heading, {
    clipPath: "inset(0 0 100% 0)", 
    scale: 1.1,                   
    duration: 0.6,
    ease: "power2.out"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, Flip);

  animateCardsSlide();
  initMenúToggle();
  initNavVisibility();
  initNavLogoAnimation();
  initMenúItemHover();
  initButtonHover();
  setupNavContactHover();
  initFilterPopup();
  initMobileServiciosAccordion();
  initHeroAnimation();
  initHeroVideoAnimation();

  // Menú close handlers
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuTimeline && !menuTimeline.reversed()) {
      menuTimeline.reverse();
    }
  });

  const pageWrapper = document.querySelector(".page-wrapper");
  if (pageWrapper) {
    pageWrapper.addEventListener("click", () => {
      if (menuTimeline && !menuTimeline.reversed()) {
        menuTimeline.reverse();
      }
    });
  }

  // THEN animations only start after full load
  window.addEventListener("load", () => {
    initStatsSection();
    initPopupAnimation();
    initTrendPopupAnimation();
    initTrendReportAnimation();
    initFooterAnimation();
    initPopupCloseAnimation();
    animateCardHover();
    animateCardClick();
    initContactPopupAnimation();
    animateSectionServicios();
    animateSectionIntro();
    animateSectionPortfolio();
    animateSectionRelated();
    animateSectionStory();
    animateSectionTeam();
    ScrollTrigger.refresh();
  });
});



function initMenúToggle() {
  const isMobile = () => window.innerWidth <= 991;

  menuTimeline = gsap.timeline({ paused: true, reversed: true });

  gsap.set(".menu", { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 });
  gsap.set(".menu_corners", { y: "-12rem", scale: 1.5, opacity: 0 });

  menuTimeline
    .set(".menu", { autoAlpha: 1 })
    .to(".menu", {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.4,
      ease: "power2.out",
      autoRound: false,
      onStart: () => document.querySelector(".menu").classList.add("is-active"), // Add class
    });

  if (!isMobile()) {
    menuTimeline
      .to(".main-wrapper", {
        y: "8rem",
        marginLeft: "1.5rem",
        marginRight: "1.5rem",
        duration: 0.4,
        ease: "power2.out"
      }, "<")
      .to(".menu_corners", {
        y: "0",
        scale: 1,
        opacity: 1,
        paddingLeft: "23px",
        paddingRight: "23px",
        duration: 0.4,
        ease: "power2.out"
      }, "<");
  }

  menuTimeline.to(".nav_component", {
    autoAlpha: 0,
    duration: 0.3,
    ease: "power2.out"
  }, "<");

  document.querySelectorAll(".menu_button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (menuTimeline.reversed()) {
        menuTimeline.play();
      } else {
        closeMenú();
      }
    });
  });

  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenú();
    });
  });

  document.querySelectorAll(".solutions_item_button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenú();
    });
  });

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    let currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && !menuTimeline.reversed()) {
      closeMenú();
    }
    lastScrollY = currentScrollY;
  });

  function closeMenú() {
    menuTimeline.eventCallback("onReverseComplete", () => {
      gsap.set(".menu", { autoAlpha: 0 });
      gsap.set(".menu_corners", { y: "-12rem", scale: 1.2, opacity: 0 });
      gsap.set(".main-wrapper", { marginLeft: "", marginRight: "" });
      gsap.set(".main-wrapper", { clearProps: "transform" });

      document.querySelector(".menu").classList.remove("is-active");
    });

    menuTimeline.reverse();
  }
}



function initNavVisibility() {
  const firstSection = document.querySelector("section");
  let isFirstDark = firstSection && firstSection.classList.contains("dark-section");

  ScrollTrigger.create({
    id: "navVisibility",
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      if (menuTimeline && !menuTimeline.reversed()) return; 

      if (isFirstDark && window.scrollY === 0) return;

      if (self.direction === -1) {
        gsap.to(".nav_component", { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      } else {
        gsap.to(".nav_component", { autoAlpha: 0, duration: 0.3, overwrite: "auto" });
      }
    }
  });
}



function initNavLogoAnimation() {
  const navLogo = document.querySelector(".nav_logo");
  if (!navLogo) return;
  
  const symbol = navLogo.querySelector(".logo-element.is-symbol");
  const siblings = navLogo.querySelectorAll(".logo-element:not(.is-symbol)");
  
  const hoverState = {
    symbolScale: 1,
    symbolRotation: 0,
    leftX: 0,
    rightX: 0
  };

  const scrolledState = {
    symbolScale: 0,
    symbolRotation: 10,
    leftX: 16,
    rightX: -16
  };

  gsap.set(symbol, { 
    scale: hoverState.symbolScale, 
    rotation: hoverState.symbolRotation, 
    transformOrigin: "center center",
    autoAlpha: 1
  });

if (window.innerWidth <= 991) {
  let mobileLogoOpen = window.scrollY === 0;

  // Get initial widths more reliably
  let initialWidths = Array.from(siblings).map(sibling =>
    sibling.getBoundingClientRect().width
  );

  if (mobileLogoOpen) {
    siblings.forEach(sibling => gsap.set(sibling, { width: "auto" }));
  } else {
    siblings.forEach(sibling => gsap.set(sibling, { width: "0px" }));
  }

  function updateMobileLogo() {
    if (window.scrollY === 0 && !mobileLogoOpen) {
      mobileLogoOpen = true;

      siblings.forEach((sibling, i) => {
        const targetWidth = initialWidths[i];
        gsap.set(sibling, { width: targetWidth + "px" });
        gsap.to(sibling, {
          width: targetWidth + "px",
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            // Delay to let layout settle
            setTimeout(() => {
              gsap.set(sibling, { width: "auto" });
            }, 50);
          }
        });
      });

    } else if (window.scrollY !== 0 && mobileLogoOpen) {
      mobileLogoOpen = false;

      // Animate closed
      siblings.forEach((sibling, i) => {
        const computed = parseFloat(getComputedStyle(sibling).width);
        const targetWidth = isNaN(computed) ? initialWidths[i] : computed;

        gsap.set(sibling, { width: targetWidth + "px" }); // lock pixel width
        gsap.to(sibling, {
          width: "0px",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
  }

  window.addEventListener("resize", () => {
    initialWidths = Array.from(siblings).map(sibling =>
      sibling.getBoundingClientRect().width
    );
  });

  window.addEventListener("scroll", updateMobileLogo);

  return;
}


  gsap.set(siblings[0], { x: hoverState.leftX });
  gsap.set(siblings[1], { x: hoverState.rightX });
  
  let isAtTop = window.scrollY === 0;
  
  function resetLogoAtTop() {
    if (window.scrollY === 0) {
      gsap.to(symbol, { 
        scale: hoverState.symbolScale, 
        rotation: hoverState.symbolRotation, 
        duration: 0.3, 
        ease: "power2.out" 
      });
      gsap.to(siblings[0], { x: hoverState.leftX, duration: 0.3, ease: "power2.out" });
      gsap.to(siblings[1], { x: hoverState.rightX, duration: 0.3, ease: "power2.out" });
    }
  }

  window.addEventListener("scroll", () => {
    isAtTop = window.scrollY === 0;
    resetLogoAtTop();
  });
  

  let scrollTL = gsap.timeline({
    scrollTrigger: {
      trigger: navLogo,
      start: "top top",
      end: "bottom top",
      scrub: true,
      markers: false
    }
  });

  scrollTL.fromTo(symbol,
    { scale: hoverState.symbolScale, rotation: hoverState.symbolRotation, immediateRender: false },
    { scale: scrolledState.symbolScale, rotation: scrolledState.symbolRotation, ease: "none", immediateRender: false },
    0
  )
  .fromTo(siblings[0],
    { x: hoverState.leftX, immediateRender: false },
    { x: scrolledState.leftX, ease: "none", immediateRender: false },
    0
  )
  .fromTo(siblings[1],
    { x: hoverState.rightX, immediateRender: false },
    { x: scrolledState.rightX, ease: "none", immediateRender: false },
    0
  );


  navLogo.addEventListener("mouseenter", () => {
    if (isAtTop) return;
    scrollTL.pause();
    gsap.to(symbol, { 
      scale: hoverState.symbolScale, 
      rotation: hoverState.symbolRotation, 
      duration: 0.3, 
      ease: "power2.out" 
    });
    gsap.to(siblings[0], { x: hoverState.leftX, duration: 0.3, ease: "power2.out" });
    gsap.to(siblings[1], { x: hoverState.rightX, duration: 0.3, ease: "power2.out" });
  });

  navLogo.addEventListener("mouseleave", () => {
    if (isAtTop) return;
    gsap.to(symbol, { 
      scale: scrolledState.symbolScale, 
      rotation: scrolledState.symbolRotation, 
      duration: 0.3, 
      ease: "power2.out" 
    });
    gsap.to(siblings[0], { x: scrolledState.leftX, duration: 0.3, ease: "power2.out" });
    gsap.to(siblings[1], { 
      x: scrolledState.rightX, 
      duration: 0.3, 
      ease: "power2.out", 
      onComplete: () => { scrollTL.play(); }
    });
  });
}



function initNavColorChange() {
  const nav = document.querySelector(".nav_component");
  const mainWrapper = document.querySelector(".main-wrapper");
  const firstSection = mainWrapper ? mainWrapper.firstElementChild : null;
  const darkSections = gsap.utils.toArray(".dark-section");
  if (!nav || !firstSection) return;

  let isFirstDark = firstSection.classList.contains("dark-section");

  function applyDarkMode() {
    nav.classList.add("dark-nav");
    gsap.to(".nav_component .nav_menu_link", { color: "#fff", duration: 0.3 });
    gsap.to(".nav_logo .logo-element:not(.is-symbol)", { filter: "invert(1)", duration: 0.3 });
  }

  function applyLightMode() {
    nav.classList.remove("dark-nav");
    gsap.to(".nav_component .nav_menu_link", { color: "#000", duration: 0.3 });
    gsap.to(".nav_logo .logo-element:not(.is-symbol)", { filter: "invert(0)", duration: 0.3 });
  }

  function checkAtTop() {
    if (window.scrollY === 0) {
      isFirstDark ? applyDarkMode() : applyLightMode();
    }
  }

  if (isFirstDark) {
    applyDarkMode();
  } else {
    applyLightMode();
  }

  darkSections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onEnter: applyDarkMode,
      onEnterBack: applyDarkMode,
      onLeave: () => {
        if (!isFirstDark || window.scrollY > 0) {
          applyLightMode();
        }
      },
      onLeaveBack: () => {
        const prevDarkSection = section.previousElementSibling?.classList.contains("dark-section");
        if (window.scrollY === 0) {
          isFirstDark ? applyDarkMode() : applyLightMode();
        } else {
          prevDarkSection ? applyDarkMode() : applyLightMode();
        }
      },
    });
  });

  window.addEventListener("scroll", checkAtTop);
}


function initButtonHover() {
  if (window.innerWidth < 991) return;

  const buttons = document.querySelectorAll(".button-wrap");

  buttons.forEach(button => {
    const buttonIcon = button.querySelector(".button-icon");
    const buttonText = button.querySelector(".button-text");

    const tl = gsap.timeline({ paused: true });

    button._tl = tl; // Store timeline reference

    tl.to(button, {
      width: "+=3rem",
      duration: 0.3,
      ease: "power2.out"
    }, 0)
    .to(buttonIcon, {
      x: "calc(48px - 3rem)",
      rotation: 20,
      duration: 0.3,
      ease: "power2.out"
    }, 0.2);

    if (button.classList.contains("is-wire") && buttonText) {
      tl.fromTo(buttonText,
        { backgroundColor: "#fff", color: "#000" },
        { backgroundColor: "#000", color: "#fff", duration: 0.3, ease: "power2.out" },
        0
      );
    }

    button._isActive = false;

    button._setActiveState = () => {
      if (!button._isActive) { 
        button._isActive = true;
        tl.play(0);
      }
    };

    button._resetState = () => {
      if (button._isActive) {  
        button._isActive = false;
        if (!button.matches(":hover")) {
          tl.reverse();
        }
      }
    };

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "class") {
          if (button.classList.contains("w--current")) {
            button._setActiveState();
          } else {
            button._resetState();
          }
        }
      });
    });
    observer.observe(button, { attributes: true, attributeFilter: ["class"] });

    button.addEventListener("mouseenter", () => {
      if (!button.classList.contains("w--current")) {
        tl.timeScale(1);
        tl.play();
      }
    });

    button.addEventListener("mouseleave", () => {
      if (!button.classList.contains("w--current")) {
        tl.timeScale(2);
        tl.reverse();
      }
    });
  });

  window.addEventListener("scroll", () => {
    buttons.forEach(button => {
      if (button.classList.contains("w--current")) {
        button._setActiveState();
      }
    });
  });
}


function initMenúItemHover() {
  document.querySelectorAll(".menu_item").forEach(menuItem => {
    const menuText = menuItem.querySelector(".menu_item_text");
    const menuIcon = menuItem.querySelector(".menu_item_icon");

    const tl = gsap.timeline({ paused: true });

    tl.to(menuText, {
      color: "#000",
      duration: 0.3,
      ease: "power2.out"
    }, 0)
    .to([menuText, menuIcon], {
      backgroundColor: "#00C6FF",
      borderColor: "#00C6FF",
      duration: 0.3,
      ease: "power2.out"
    }, 0)
    .to(menuItem, {
      width: "+=3rem",
      duration: 0.3,
      ease: "power2.out"
    }, 0)
    .to(menuIcon, {
      x: "calc(48px - 3rem)",
      rotation: 20,
      duration: 0.3,
      ease: "power2.out"
    }, 0.2);

    menuItem.addEventListener("mouseenter", () => {
      tl.timeScale(1);
      tl.play();
    });
    menuItem.addEventListener("mouseleave", () => {
      tl.timeScale(2);
      tl.reverse();
    });
  });
}


function initHeroAnimation() {
  const tl = gsap.timeline();
  const heading = document.querySelector(".section_hero .is-we-craft");
  const subtitle = document.querySelector(".section_hero .heading-style-hero-subtitle");
  const sticker = document.querySelector(".sticker.is-hero");
  const heroVideo = document.querySelector(".hero_video");
  const preloader = document.querySelector(".preloader");

  const isLargeScreen = window.innerWidth > 991;
  const hasSeenPreloader = document.cookie.includes("preloaderSeen=true");

  if (preloader && isLargeScreen && !hasSeenPreloader) {
    preloader.style.visibility = "visible";
    preloader.style.opacity = "1";

    gsap.to(preloader, {
      opacity: 0,
      duration: 0.6,
      delay: 3,
      onComplete: () => {
        preloader.style.display = "none";
        document.cookie = "preloaderSeen=true; path=/; max-age=86400";
      }
    });

    gsap.delayedCall(3, startHeroAnimation);
  } else {
    startHeroAnimation();
  }

  function startHeroAnimation() {
    if (heading) {
      tl.add(animateHeading(heading));
    }
    if (subtitle) {
      tl.add(animateHeading(subtitle), "-=0.1");
    }
    if (sticker) {
      tl.fromTo(sticker,
        { scale: 0, rotation: 0, opacity: 0 },
        { scale: 1, rotation: -6, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
    }
    if (heroVideo) {
      tl.from(heroVideo, {
        clipPath: "inset(50% 0 50% 0)",
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");
    }

    window.addEventListener("scroll", onScroll);
  }

  window.triggerHeroAnimation = startHeroAnimation;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  function applyParallax() {
    if (!isLargeScreen) return;

    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight * 0.5;

    const headingOffset = Math.max(scrollY / maxScroll * -40, -40);
    let subtitleOffset = 0;
    if (scrollY > 100) {
      subtitleOffset = Math.max((scrollY - 100) / maxScroll * -70, -70);
    }

    gsap.to(heading, { y: `${headingOffset}px`, duration: 0.3, ease: "power2.out" });
    gsap.to(subtitle, { y: `${subtitleOffset}px`, duration: 0.4, ease: "power2.out" });
  }
}



function animateSectionRelated() {
  const sectionRelated = document.querySelector(".section_related");
  const heading = document.querySelector(".section_related .heading-style-hero");
  const relatedListWrapper = document.querySelector(".section_related .related_list_wrapper");
  const sticker = document.querySelector(".section_related .sticker.is-related");

  if (!sectionRelated) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRelated,
      start: "top 80%",
      once: true
    }
  });

  if (heading) {
    tl.from(heading, {
      opacity: 0,
      y: -50, // Moves down
      duration: 0.8,
      ease: "power2.out",
      clipPath: "inset(0 0 100% 0)",
      onComplete: () => gsap.set(heading, { clearProps: "transform" })
    });
  }

  if (relatedListWrapper) {
    tl.from(relatedListWrapper, {
      opacity: 0,
      y: 100, // Moves up
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => gsap.set(relatedListWrapper, { clearProps: "transform" })
    }, "-=0.4"); 
  }

  if (sticker) {
    tl.from(sticker, {
      opacity: 0,
      scale: 0.8,
      rotation: 10,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => gsap.set(sticker, { clearProps: "transform" }) 
    }, "-=0.2");
  }
}


function initStatsSection() {
  let section = document.querySelector(".section_stats");
  if (!section) return;

  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 20%",
      once: true
    }
  });

  gsap.utils.toArray(".stats-counter").forEach(counter => {
    timeline.fromTo(
      counter,
      { innerHTML: 10 },
      {
        innerHTML: 85,
        duration: 2,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        onUpdate: function () {
          counter.innerHTML = Math.round(this.targets()[0].innerHTML) + "k";
        }
      },
      0
    );
  });

  gsap.set(".stats-list-item", { opacity: 0 });
  gsap.set(".heading-style-list", { 
    opacity: 0, 
    clipPath: "inset(0% 0% 100% 0%)", 
    scale: 1.1 
  });
  gsap.set(".is-stats-subtitle", { 
    opacity: 0, 
    clipPath: "inset(0% 0% 100% 0%)", 
    scale: 1.1 
  });

  timeline.to(".stats-list-item", { opacity: 1, duration: 0.01 }, 0.5);

  let statsList = gsap.utils.toArray(".stats-list-item");
  statsList.forEach((item, index) => {
    let children = item.querySelectorAll(".heading-style-list");
    timeline.to(children, {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.2
    }, 0.5 + index * 0.3);
  });

  timeline.to(".is-stats-subtitle", {
    clipPath: "inset(0% 0% 0% 0%)", 
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: "power2.out"
  }, "+=0.3"); 
}



document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".solutions_nav_list .button-wrap").forEach(link => {
    const textElement = link.querySelector(".button-text");
    if (textElement) {
      const text = textElement.textContent.trim();
      const slug = "#" + text.toLowerCase().replace(/\s+/g, "-");
      link.setAttribute("href", slug);
    }
  });

  document.querySelectorAll(".solutions_collection_list .solutions_item").forEach(item => {
    const heading = item.querySelector(".heading-style-h1");
    if (heading) {
      const text = heading.textContent.trim();
      const slug = text.toLowerCase().replace(/\s+/g, "-");
      item.id = slug;
    }
  });
});


function initPopupAnimation() {
  const popupTimeline = gsap.timeline({ paused: true, reversed: true });

  // Make the popup visible
  popupTimeline.set(".popup", { visibility: "visible" });

  // Fade in the background
  popupTimeline.fromTo(
    ".popup-background",
    { opacity: 0 },
    { duration: 0.5, opacity: 1 }
  );

  popupTimeline.fromTo(
    ".popup-inner",
    { y: "100%", opacity: 1 },
    { 
      duration: 0.5, 
      y: 0, 
      opacity: 1,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(".popup-inner", { clearProps: "transform" }); 
        gsap.to(".popup-close", { duration: 0.3, opacity: 1 }); 
      }
    },
    "-=0.3"
  );

  gsap.set(".popup-close", { opacity: 0 });

  const submitDivs = document.querySelectorAll(".submit-brief-button");
  submitDivs.forEach((div) => {
    div.addEventListener("click", () => {
      const selectedService = div.getAttribute("data-service");
      const dropdown = document.getElementById("serviceSelect");
      dropdown.value = selectedService || "servicesRequired";

      if (typeof menuTimeline !== "undefined" && !menuTimeline.reversed()) {
        closeMenú();
      }

      if (popupTimeline.reversed()) {
        popupTimeline.play();
      }
    });
  });

  function closePopup() {
    gsap.to(".popup-close", {
      duration: 0.15, 
      opacity: 0, 
      onComplete: () => popupTimeline.reverse()
    });
  }

  document.querySelector(".popup-background").addEventListener("click", closePopup);
  document.querySelector(".popup-close").addEventListener("click", closePopup);

  popupTimeline.eventCallback("onReverseComplete", () => {
    gsap.set(".popup-inner", { y: 50, opacity: 0 }); // Restore transform for next open
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popupTimeline.reversed()) {
      closePopup();
    }
  });
}


function initTrendPopupAnimation() {
  const trendButton = document.querySelector(".trend_button");
  const trendPopup = document.querySelector(".trend_popup");

  if (!trendButton || !trendPopup) return; 

  const trendPopupTimeline = gsap.timeline({ paused: true, reversed: true });

  // Make the trend popup visible
  trendPopupTimeline.set(".trend_popup", { visibility: "visible" });

  // Fade in the background
  trendPopupTimeline.fromTo(
    ".trend_popup .popup-background",
    { opacity: 0 },
    { duration: 0.5, opacity: 1 }
  );

  // Slide in the popup content
  trendPopupTimeline.fromTo(
    ".trend_popup .popup-inner",
    { y: "100%", opacity: 1 },
    { 
      duration: 0.5, 
      y: 0, 
      opacity: 1,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(".trend_popup .popup-inner", { clearProps: "transform" });
        gsap.to(".trend_popup .popup-close", { duration: 0.3, opacity: 1 });
      }
    },
    "-=0.3"
  );

  // Initially hide the close button
  gsap.set(".trend_popup .popup-close", { opacity: 0 });

  const body = document.body;

  trendButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (trendPopupTimeline.reversed()) {
      body.classList.add("no-scroll");
      trendPopupTimeline.play();
    }
  });

  function closePopup() {
    body.classList.remove("no-scroll");

    gsap.to(".trend_popup .popup-close", {
      duration: 0.15, 
      opacity: 0, 
      onComplete: () => trendPopupTimeline.reverse()
    });
  }

  const closeButton = document.querySelector(".trend_popup .popup-close");
  if (closeButton) {
    closeButton.addEventListener("click", closePopup);
  }

  trendPopupTimeline.eventCallback("onReverseComplete", () => {
    gsap.set(".trend_popup .popup-inner", { y: 50, opacity: 0 });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !trendPopupTimeline.reversed()) {
      closePopup();
    }
  });
}


function initContactPopupAnimation() {
  const contactPopupTimeline = gsap.timeline({ paused: true, reversed: true });

  contactPopupTimeline.set(".contact_popup", { visibility: "visible" });

  contactPopupTimeline.fromTo(
    ".contact_popup .popup-background",
    { opacity: 0 },
    { duration: 0.5, opacity: 1 }
  );

  contactPopupTimeline.fromTo(
    ".contact_popup .popup-inner",
    { y: "100%", opacity: 1 },
    { 
      duration: 0.5, 
      y: 0, 
      opacity: 1,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(".contact_popup .popup-inner", { clearProps: "transform" });
        gsap.to(".contact_popup .popup-close", { duration: 0.3, opacity: 1 });
      }
    },
    "-=0.3"
  );

  gsap.set(".contact_popup .popup-close", { opacity: 0 });

  const body = document.body;

  document.querySelectorAll(".nav_contact").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (contactPopupTimeline.reversed()) {
        body.classList.add("no-scroll");
        contactPopupTimeline.play();
      }
    });
  });

  function closePopup() {
    body.classList.remove("no-scroll");

    gsap.to(".contact_popup .popup-close", {
      duration: 0.15, 
      opacity: 0, 
      onComplete: () => contactPopupTimeline.reverse()
    });
  }

  document.querySelector(".contact_popup .popup-close").addEventListener("click", closePopup);

  contactPopupTimeline.eventCallback("onReverseComplete", () => {
    gsap.set(".contact_popup .popup-inner", { y: 50, opacity: 0 });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !contactPopupTimeline.reversed()) {
      closePopup();
    }
  });
}



function initFooterAnimation() {
  const footerTop = document.querySelector(".footer_top");
  const footerBottom = document.querySelector(".footer_bottom");

  if (!footerTop || !footerBottom) return;

  const subtitle = document.querySelector(".footer_top_subtitle");
  const headingWrapperChildren = document.querySelectorAll(".footer_top_left .heading-wrapper > *");
  const footerTopDesc = document.querySelector(".footer_top_desc");
  const footerTopRightHeading = document.querySelector(".footer_top_right_heading");
  const footerPillWrapChildren = document.querySelectorAll(".footer_pill_wrap > *");
  const sticker = document.querySelector(".footer .sticker");

  const taglineTop = document.querySelector(".footer-tagline_top");
  const taglineBottom = document.querySelector(".footer-tagline_bottom");

  gsap.set([footerTop, footerBottom], { opacity: 1 });

  // Animation for footer_top
  let tlTop = gsap.timeline({
    scrollTrigger: {
      trigger: footerTop,
      start: "top 40%",
      once: true,
    }
  });

  if (subtitle) {
    tlTop.from(subtitle, { clipPath: "inset(100% 0 0 0)", opacity: 0, duration: 0.4, ease: "power2.out" });
  }

  if (headingWrapperChildren.length) {
    tlTop.from(headingWrapperChildren, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.1, duration: 0.3, ease: "power2.out" });
  }

  if (footerTopDesc) {
    tlTop.from(footerTopDesc, { clipPath: "inset(100% 0 0 0)", opacity: 0, duration: 0.3, ease: "power2.out" });
  }

  if (footerTopRightHeading) {
    tlTop.from(footerTopRightHeading, { clipPath: "inset(100% 0 0 0)", opacity: 0, duration: 0.3, ease: "power2.out" });
  }

  if (footerPillWrapChildren.length) {
    tlTop.from(footerPillWrapChildren, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.1, duration: 0.3, ease: "power2.out" });
  }

  if (sticker) {
    tlTop.from(sticker, { clipPath: "inset(100% 0 0 0)", opacity: 0, duration: 0.3, ease: "power2.out" });
  }

  // Animation for footer_bottom
  let tlBottom = gsap.timeline({
    scrollTrigger: {
      trigger: footerBottom,
      start: "top 80%",
      once: true,
    }
  });

  if (taglineTop) {
    tlBottom.from(taglineTop, { clipPath: "inset(100% 0 0 0)", scale: 1.05, opacity: 0, duration: 0.3, ease: "power2.out" });
  }

  if (taglineBottom) {
    tlBottom.from(taglineBottom, { clipPath: "inset(100% 0 0 0)", scale: 1.05, opacity: 0, duration: 0.3, ease: "power2.out" });
  }
}


function initPopupCloseAnimation() {
  const popupCloseButtons = document.querySelectorAll(".popup-close");
  
  popupCloseButtons.forEach((popupClose) => {
    const popupCloseImg = popupClose.querySelector("img");
    if (!popupCloseImg) return;

    popupClose.addEventListener("mouseenter", () => {
      gsap.to(popupCloseImg, {
        rotation: 90,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    popupClose.addEventListener("mouseleave", () => {
      gsap.to(popupCloseImg, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    popupClose.addEventListener("click", () => {
      gsap.to(popupCloseImg, {
        duration: 0.5,
        ease: "power2.out",
      });
    });
  });
}

function animateCardHover() {
  document.querySelectorAll('.card-item, .work-section-item-wrap').forEach(item => {
    let vimeoWrapper = item.querySelector('.vimeo-wrapper');

    item.addEventListener('mouseenter', () => {
      if (vimeoWrapper) {
        gsap.to(vimeoWrapper, { opacity: 1, duration: 0, ease: "power2.out" });
      }
    });

    item.addEventListener('mouseleave', () => {
      if (vimeoWrapper) {
        gsap.to(vimeoWrapper, { opacity: 0, duration: 0, ease: "power2.out" });
      }
    });
  });
}


function animateCardClick() {
  if (window.innerWidth <= 991) return;

  document.querySelectorAll('.animate-flip').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = card.href;

      card.style.maxHeight = 'none';
      card.style.aspectRatio = 'auto';

      const vimeoWrap = card.querySelector('.vimeo-video-wrap');
      if (vimeoWrap) vimeoWrap.style.zIndex = '6';

      const parent = card.closest('.work-section-item, .card-wrapper');
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        parent.style.width = `${parentRect.width}px`;
        parent.style.height = `${parentRect.height}px`;
        parent.style.position = 'absolute';
        parent.style.top = `${parentRect.top + window.scrollY}px`;
        parent.style.left = `${parentRect.left}px`;
      }

      const state = Flip.getState(card, { props: "transform,top,left,width,height" });
      card.classList.add("active");
      card.offsetWidth;

      Flip.from(state, {
        duration: 0.3,
        ease: "power1.inOut",
        absolute: true,
        onComplete: () => {
          if (targetUrl) {
           window.location.href = targetUrl;
          }
        }
      });
    });
  });
}


function initHeroVideoAnimation() {
  gsap.registerPlugin(ScrollTrigger, Flip);

  const heroVideo = document.querySelector('.hero_video');
  const headingImg = document.querySelector('.is-we-craft');
  if (!heroVideo || !headingImg) return; 

  // Desktop version
  if (window.innerWidth > 991) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero_video",
        start: "top center",
        end: "top top",
        scrub: true,
        anticipatePin: 1
      }
    });

    tl.to(heroVideo, {
      borderRadius: "0px",
      width: '100vw',
      height: '100vh',
      ease: "none"
    }, 0);
    tl.to(heroVideo.querySelector(".fill"), {
      borderRadius: "0px",
      ease: "none"
    }, 0);
  }
  // Mobile version: pin el vídeo justo DEBAJO de la imagen "CREAMOS"
  else {
    ScrollTrigger.create({
      trigger: headingImg,
      start: "top top", // Cuando la parte de abajo de la imagen llega arriba del viewport
      end: () => "bottom+=8 top" + heroVideo.offsetHeight, // Pin hasta que el vídeo termina su altura
      pin: heroVideo,
      pinSpacing: false,
      // markers: true, // descomenta para debug
      scrub: false,
    });
  }
}



function animateSectionServicios() {
  const sectionServicios = document.querySelector(".section_solutions");
  const heading = document.querySelector(".section_solutions .heading-style-hero");
  const solutionItems = document.querySelectorAll(".section_solutions .home-solutions_list > *");

  if (!sectionServicios) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionServicios,
      start: "top 20%",
      once: true
    }
  });

  if (heading) {
    tl.add(animateHeading(heading));
  }

  if (solutionItems.length) {
    tl.from(solutionItems, {
      opacity: 0,
      y: 100,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.2 
    }, "-=0.3");
  }
}


function animateSectionIntro() {
  const sectionIntro = document.querySelector(".section_intro");
  if (!sectionIntro) return;

  const subtitle = sectionIntro.querySelector(".heading-style-subtitle");
  const textIntro = sectionIntro.querySelector(".text-style-intro");
  const button = sectionIntro.querySelector(".intro-button");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionIntro,
      start: "top 20%",
      once: true
    }
  });

  if (subtitle) {
    tl.from(subtitle, {
      opacity: 0,
      y: 50,
      duration: .6,
      ease: "power2.out",
      clipPath: "inset(100% 0 0 0)"
    });
  }

  if (textIntro) {
    tl.from(textIntro, {
      opacity: 0,
      y: 50,
      duration: .6,
      ease: "power2.out",
      clipPath: "inset(100% 0 0 0)"
    }, "-=0.3");
  }

  if (button) {
    tl.from(button, {
      opacity: 0,
      y: 50,
      duration: .6,
      ease: "power2.out",
      clipPath: "inset(100% 0 0 0)"
    }, "-=0.3");
  }
}



function animateSectionPortfolio() {
  const sectionPortfolio = document.querySelector(".section_work");
  if (!sectionPortfolio) return;

  const heading = sectionPortfolio.querySelector(".heading-style-hero");
  const workWrapper = sectionPortfolio.querySelector(".work-section-list-wrapper");

  // SET INITIAL STATES
  if (heading) {
    gsap.set(heading, {
      opacity: 0,
      clipPath: "inset(0 0 100% 0)"
    });
  }

  if (workWrapper) {
    gsap.set(workWrapper, {
      opacity: 0,
      y: 100
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionPortfolio,
      start: "top 0%",
      toggleActions: "play none none none",
      immediateRender: false,
    }
  });

  if (heading) {
    tl.to(heading, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      clipPath: "inset(0 0 0% 0)",
      onComplete: () => gsap.set(heading, { clearProps: "transform,clipPath" })
    });
  }

  if (workWrapper) {
    tl.to(workWrapper, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => gsap.set(workWrapper, { clearProps: "transform" })
    }, "-=0.4");
  }
}



function initTrendReportAnimation() {
  const section = document.querySelector('.section_trend_report');

  if (!section) return;

  const headings = section.querySelectorAll('.heading-wrapper > *');
  const paragraph = section.querySelectorAll('p');
  const trendButton = section.querySelector('.trend_button');
  const subtitle = section.querySelector('.trend_report_subtitle');

  gsap.set([headings, paragraph, trendButton, subtitle], { opacity: 0, y: 20 });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    once: true,
    onEnter: () => {

      gsap.to(headings, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.2
      });


      gsap.to(paragraph, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: headings.length * 0.3
      });


      gsap.to(trendButton, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: headings.length * 0.3 + 0.3
      });


      gsap.to(subtitle, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: headings.length * 0.3 + 0.6
      });
    }
  });
}


function animateCardsSlide() {
    if (window.innerWidth > 991) 

    gsap.utils.toArray(".slide-content-item").forEach((content, index) => {
        let fill = document.querySelector(`.fill.slide-${index + 1}`);

        if (fill) {
            if (index === 0) {
                gsap.set(fill, { clipPath: "inset(0% 0% 0% 0%)" });
                return;
            }

            gsap.set(fill, { clipPath: "inset(100% 0% 0% 0%)" });

            gsap.to(fill, {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                  trigger: content,
                  start: "top top",
                  end: "bottom top",
                  scrub: true
                }
            });
        }
    });
}

function animateSectionStory() {
  const sectionStory = document.querySelector(".section_story");
  const storyHeadingChildren = document.querySelectorAll(".section_story .story_heading > *");

  if (!sectionStory) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionStory,
      start: "top 40%",
      once: true
    }
  });

  if (storyHeadingChildren.length) {
    tl.from(storyHeadingChildren, {
      opacity: 0,
      y: 50, // Moves up
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.2, // Staggered animation
      clipPath: "inset(100% 0 0 0)", // Wipe-up effect
      onComplete: () => storyHeadingChildren.forEach(item => gsap.set(item, { clearProps: "clipPath, transform" })) // Clears styles after animation
    });
  }
}


function animateSectionTeam() {
  const sectionTeam = document.querySelector(".section_team");
  const headingWrapper = document.querySelector(".section_team .heading-wrapper");
  const teamParagraph = document.querySelector(".section_team .team_paragraph");
  const subtitle = document.querySelector(".section_team .heading-style-subtitle");

  if (!sectionTeam) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionTeam,
      start: "top 80%",
      once: true
    }
  });

  if (headingWrapper) {
    tl.from(headingWrapper, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power2.out",
      clipPath: "inset(100% 0 0 0)", 
      onComplete: () => gsap.set(headingWrapper, { clearProps: "clipPath, transform" })
    });
  }

  if (teamParagraph) {
    tl.from(teamParagraph, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => gsap.set(teamParagraph, { clearProps: "transform" })
    }, "-=0.4");
  }

  if (subtitle) {
    tl.from(subtitle, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => gsap.set(subtitle, { clearProps: "transform" })
    }, "-=0.3");
  }
}




function initFilterPopup() {
  const filterPopup = document.querySelector(".filters-popup");
  const showFiltersButton = document.querySelector(".show_filters_button");
  const closeButton = document.querySelector(".filters-popup .popup-close");
  const popupBackground = document.querySelector(".filters-popup .popup-background");
  const altCloseButton = document.querySelector(".filters-popup-close");

  if (!filterPopup || !showFiltersButton || !closeButton || !popupBackground) return;

  const filterPopupTimeline = gsap.timeline({
    paused: true,
    reversed: true,
    onReverseComplete: () => {
      filterPopup.style.visibility = "hidden";
    }
  });

  filterPopupTimeline.set(filterPopup, { visibility: "visible" });

  filterPopupTimeline.fromTo(
    popupBackground,
    { opacity: 0 },
    { duration: 0.5, opacity: 1 }
  );

  filterPopupTimeline.fromTo(
    ".filters-popup-inner",
    { x: "-100%", opacity: 0 },
    { duration: 0.5, x: "0%", opacity: 1, ease: 'power2.out' },
    "-=0.3"
  );

  const body = document.body;

  showFiltersButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (filterPopupTimeline.reversed()) {
      filterPopup.style.visibility = "visible";
      body.classList.add("no-scroll"); 
      filterPopupTimeline.play();
    }
  });

  function closePopup() {
    body.classList.remove("no-scroll"); 
    filterPopupTimeline.reverse();
  }

  closeButton.addEventListener("click", closePopup);
  popupBackground.addEventListener("click", closePopup);

  if (altCloseButton) {
    altCloseButton.addEventListener("click", closePopup);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !filterPopupTimeline.reversed()) {
      closePopup();
    }
  });
}


function setupNavContactHover() {
  gsap.utils.toArray(".nav_anim").forEach((contact) => {
    let hoverBg = contact.querySelector(".button_hover_bg");
    let menuLink = contact.querySelector(".nav_menu_link");

    // Ensure initial state
    gsap.set(hoverBg, { x: "-100%" });

    contact.addEventListener("mouseenter", () => {
      // Reset to -100% before animating in
      gsap.set(hoverBg, { x: "-100%" });

      gsap.to(hoverBg, { 
        x: "0%", 
        duration: 0.3, 
        ease: "power3.out"
      });
    });

    contact.addEventListener("mouseleave", () => {

      gsap.to(hoverBg, { 
        x: "100%", 
        duration: 0.3, 
        ease: "power3.in",
        onComplete: () => {
          // Reset immediately after animation ends
          gsap.set(hoverBg, { x: "-100%" });
        }
      });
    });
  });
}

function updateMinHeight() {
  const items = document.querySelectorAll('.work-section-item-wrap');

  items.forEach(item => {
    const width = item.offsetWidth; 
    const height = width * (9 / 16); 
    item.style.minHeight = `${height}px`;
  });
}

// Run on load
window.addEventListener('load', updateMinHeight);
// Run on resize
window.addEventListener('resize', updateMinHeight);


function initMobileServiciosAccordion() {
  if (window.innerWidth > 991) return;

  const section = document.querySelector('.section_solutions');
  if (!section) return;

  const list = section.querySelector('.home-solutions_list');
  if (!list) return;

  const children = Array.from(list.children);
  if (!children.length) return;

  children.forEach(child => {
    const button = child.querySelector('.solutions_accordian_button');
    if (button) {
      button.replaceWith(button.cloneNode(true));
    }
  });


  children.forEach(child => child.classList.remove('is-active'));
  children[0].classList.add('is-active');

  children.forEach(child => {
    const button = child.querySelector('.solutions_accordian_button');
    if (button) {
      button.addEventListener('click', () => {
        const isActive = child.classList.contains('is-active');

        children.forEach(c => c.classList.remove('is-active'));

        if (!isActive) {
          child.classList.add('is-active');
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', initMobileServiciosAccordion);


let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth <= 991) {
      initMobileServiciosAccordion();
    }
  }, 250); 
});

document.querySelectorAll('.home-solutions_item').forEach(item => {
  const buttonWrap = item.querySelector('.solutions_item_button a');
  const servicesList = item.querySelector('.solutions_services_list');

  if (buttonWrap && servicesList) {
    servicesList.appendChild(buttonWrap);
  }
});

function initCustomCursor() {
  const cursor = document.createElement('img');
  cursor.src = 'https://cdn.prod.website-files.com/67ae65084b1dd6cf933bfcdd/67c289bd4ca86d7f689e7465_cursor_scroll.svg';
  cursor.style.position = 'fixed';
  cursor.style.top = '-20px';
  cursor.style.left = '-44px';
  cursor.style.pointerEvents = 'none';
  cursor.style.opacity = 0;
  cursor.style.transform = 'scale(0)';
  cursor.style.zIndex = 9999;
  cursor.style.width = '5.5rem';
  document.body.appendChild(cursor);

  document.body.style.cursor = 'none';

  let fadedIn = false;
  let isDisabled = false;

  function moveCursor(e) {
    if (!fadedIn && !isDisabled) {
      gsap.to(cursor, { duration: 0.2, scale: 1, ease: "power2.out", opacity: 1 });
      fadedIn = true;
    }
    if (!isDisabled) {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' });
    }
  }

  document.addEventListener('mousemove', moveCursor);

  function animateCursorOut() {
    if (!isDisabled) {
      isDisabled = true;
      gsap.to(cursor, {
        duration: 0.2,
        scale: 0,
        opacity: 0,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.cursor = 'auto';
          document.removeEventListener('mousemove', moveCursor);
        }
      });
    }
  }

  window.addEventListener('scroll', animateCursorOut);
  document.addEventListener('click', animateCursorOut);
  document.querySelectorAll('.nav_component').forEach((el) => {
    el.addEventListener('mouseenter', animateCursorOut);
  });
}

function initPortfolioSectionCursor() {
  const cursor = document.createElement('img');
  cursor.src = 'https://cdn.prod.website-files.com/67ae65084b1dd6cf933bfcdd/67c3a7301504d766d65cdb63_cursor_view.svg';
  cursor.style.position = 'fixed';
  cursor.style.top = '-20px';
  cursor.style.left = '-44px';
  cursor.style.pointerEvents = 'none';
  cursor.style.opacity = 0;
  cursor.style.transform = 'scale(0)';
  cursor.style.zIndex = 9999;
  cursor.style.width = '5.5rem';
  document.body.appendChild(cursor);

  let isHovering = false;

  function moveCursor(e) {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' });
  }

  function showCursor(e) {
    isHovering = true;
    document.body.style.cursor = 'none';
    gsap.to(cursor, { duration: 0.2, scale: 1, ease: "power2.out", opacity: 1 });

    e.currentTarget.querySelectorAll('a').forEach(link => {
      link.style.cursor = 'none';
    });

    document.addEventListener('mousemove', moveCursor);
  }

  function hideCursor(e) {
    isHovering = false;
    gsap.to(cursor, {
      duration: 0.2,
      scale: 0,
      opacity: 0,
      ease: "power2.in"
    });

    e.currentTarget.querySelectorAll('a').forEach(link => {
      link.style.cursor = 'auto';
    });

    document.body.style.cursor = 'auto';
  }

  function clickAnimation(e) {
    e.currentTarget.querySelectorAll('a').forEach(link => {
      link.style.pointerEvents = 'auto';
    });

    gsap.to(cursor, {
      duration: 0.2,
      scale: 0,
      opacity: 0,
      ease: "power2.in"
    });

    document.body.style.cursor = 'auto';
  }

  document.querySelectorAll('.work-section-list').forEach((el) => {
    el.addEventListener('mouseenter', showCursor);
    el.addEventListener('mouseleave', hideCursor);
    el.addEventListener('click', clickAnimation);
  });
}


function initHomeVideoCursor() {
  const cursor = document.createElement('img');
  cursor.src = 'https://cdn.prod.website-files.com/67ae65084b1dd6cf933bfcdd/67dcf88d08cd44354f79fa9f_cursor_play.svg';
  cursor.style.position = 'fixed';
  cursor.style.top = '-40px';
  cursor.style.left = '-40px';
  cursor.style.pointerEvents = 'none';
  cursor.style.opacity = 0;
  cursor.style.transform = 'scale(0)';
  cursor.style.zIndex = 9999;
  cursor.style.width = '5rem';
  document.body.appendChild(cursor);

  let isMuted = true;

  const iframe = document.querySelector('.vimeo-wrapper-home');
  const player = iframe ? new Vimeo.Player(iframe) : null;

  function moveCursor(e) {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.08,
      ease: 'power2.out'
    });
  }

  function showCursor() {
    document.body.style.cursor = 'none';
    const scrollCursor = document.querySelector('img[src*="cursor_scroll.svg"]');
    if (scrollCursor) scrollCursor.style.display = 'none';

    gsap.to(cursor, {
      duration: 0.2,
      scale: 1,
      opacity: 1,
      ease: "power2.out"
    });

    document.addEventListener('mousemove', moveCursor);
  }

  function hideCursor() {
    const scrollCursor = document.querySelector('img[src*="cursor_scroll.svg"]');
    if (scrollCursor) scrollCursor.style.display = 'block';

    gsap.to(cursor, {
      duration: 0.2,
      scale: 0,
      opacity: 0,
      ease: "power2.in"
    });

    document.body.style.cursor = 'auto';
    document.removeEventListener('mousemove', moveCursor);
  }

function handleClick() {
  hideCursor();

  if (isMuted) {
    const target = document.querySelector('.hero_video');
    if (target) {
      const targetOffset = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
      });
    }
  }

  if (player) {
    const newVolume = isMuted ? 1 : 0;
    player.setVolume(newVolume)
      .then(() => {
        isMuted = !isMuted;
      })
      .catch(error => {
        console.error('Vimeo volume error:', error);
      });
  }
}


  document.querySelectorAll('.is_home_video, .vimeo-overlay').forEach(el => {
    el.addEventListener('mouseenter', showCursor);
    el.addEventListener('mouseleave', hideCursor);
    el.addEventListener('click', handleClick);
  });
}


function initMobilePlayButton() {
  const mobileBtn = document.querySelector('.mobile_play_button');
  const overlay = document.querySelector('.vimeo_overlay');
  const iframe = document.querySelector('.vimeo-wrapper-home');
  const player = iframe ? new Vimeo.Player(iframe) : null;

  let isMuted = true;
  let isPlaying = false;

  if (!mobileBtn || !player || !overlay) return;

  mobileBtn.addEventListener('click', () => {
    player.setVolume(1).then(() => {
      isMuted = false;
      isPlaying = true;
      player.play();

      gsap.to(mobileBtn, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  overlay.addEventListener('click', () => {
    if (!isPlaying) return;

    player.pause().then(() => {
      isMuted = true;
      isPlaying = false;

      gsap.to(mobileBtn, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}


initMobilePlayButton();


if (window.matchMedia("(min-width: 992px)").matches) {
  initCustomCursor();
  initPortfolioSectionCursor();
  initHomeVideoCursor();
}


document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".home-solutions_item");

  items.forEach(item => {
    const servicesList = item.querySelector(".solutions_services_list");
    const subtitle = item.querySelector(".solutions_block_subtitle");

    if (servicesList && subtitle) {
      const count = servicesList.children.length - 1;
      subtitle.textContent = `${count} Services`;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form");

  forms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita redirección
      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          form.innerHTML = '<p style="color: green; font-size: 18px;">✅ ¡Genial! En breve nos pondremos en contacto contigo.</p>';
        } else {
          form.innerHTML = '<p style="color: red; font-size: 18px;">❌ Hubo un error. Intenta de nuevo.</p>';
        }
      }).catch(() => {
        form.innerHTML = '<p style="color: red; font-size: 18px;">❌ Error de conexión. Intenta más tarde.</p>';
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const triggerButtons = document.querySelectorAll(".submit-brief-button");
  const formWrapper = document.getElementById("form-wrapper");
  const closeBtn = formWrapper.querySelector("span");

  triggerButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      formWrapper.style.display = "block";
    });
  });

  closeBtn.addEventListener("click", function () {
    formWrapper.style.display = "none";
  });
});
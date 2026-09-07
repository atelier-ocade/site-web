/* Atelier Ocade — interactions de la page.
   Tout est optionnel : la page reste lisible et navigable sans JavaScript. */

(function () {
  'use strict';

  /* --- Menu mobile ------------------------------------------------------- */

  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('est-ouvert');
      burger.setAttribute('aria-expanded', String(ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    // Refermer le menu apres avoir choisi une destination.
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('est-ouvert');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Ombre de l'en-tete au defilement ---------------------------------- */

  var header = document.querySelector('.site-header');

  if (header) {
    var majHeader = function () {
      header.classList.toggle('est-defile', window.scrollY > 8);
    };
    majHeader();
    window.addEventListener('scroll', majHeader, { passive: true });
  }

  /* --- Lien de navigation actif selon la section visible ------------------ */

  var sections = document.querySelectorAll('main section[id]');
  var liens = {};

  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
    liens[a.getAttribute('href').slice(1)] = a;
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        var lien = liens[entree.target.id];
        if (lien) lien.classList.toggle('est-actif', entree.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observateur.observe(s); });
  }

  /* --- Visionneuse de la galerie ------------------------------------------
     Sans JavaScript, les liens ouvrent simplement l'image en grand. */

  var visionneuse = document.querySelector('.visionneuse');
  var vues = Array.prototype.slice.call(document.querySelectorAll('.galerie a[data-agrandir]'));

  if (visionneuse && vues.length) {
    var vImage = visionneuse.querySelector('img');
    var vLegende = visionneuse.querySelector('.visionneuse-legende');
    var index = 0;
    var declencheur = null;

    var afficher = function (i) {
      index = (i + vues.length) % vues.length;
      var lien = vues[index];
      var vignette = lien.querySelector('img');
      vImage.src = lien.getAttribute('href');
      vImage.alt = vignette ? vignette.alt : '';
      vLegende.textContent = lien.parentNode.querySelector('figcaption').textContent;
    };

    var ouvrir = function (i, source) {
      declencheur = source;
      afficher(i);
      visionneuse.hidden = false;
      document.body.style.overflow = 'hidden';
      visionneuse.querySelector('.visionneuse-fermer').focus();
    };

    var fermer = function () {
      visionneuse.hidden = true;
      vImage.removeAttribute('src');
      document.body.style.overflow = '';
      if (declencheur) declencheur.focus();
    };

    vues.forEach(function (lien, i) {
      lien.addEventListener('click', function (e) {
        e.preventDefault();
        ouvrir(i, lien);
      });
    });

    visionneuse.querySelector('.visionneuse-fermer').addEventListener('click', fermer);
    visionneuse.querySelector('.visionneuse-prec').addEventListener('click', function () { afficher(index - 1); });
    visionneuse.querySelector('.visionneuse-suiv').addEventListener('click', function () { afficher(index + 1); });

    // Un clic sur le fond ferme la visionneuse ; un clic sur l'image ne fait rien.
    visionneuse.addEventListener('click', function (e) {
      if (e.target === visionneuse) fermer();
    });

    document.addEventListener('keydown', function (e) {
      if (visionneuse.hidden) return;
      if (e.key === 'Escape') fermer();
      if (e.key === 'ArrowLeft') afficher(index - 1);
      if (e.key === 'ArrowRight') afficher(index + 1);
    });
  }

  /* --- Annee courante dans le pied de page -------------------------------- */

  var annee = document.querySelector('[data-annee]');
  if (annee) annee.textContent = String(new Date().getFullYear());
})();

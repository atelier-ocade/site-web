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

  /* --- Formulaire de contact ---------------------------------------------
     Demo : aucune donnee n'est envoyee. Brancher ici un service de
     formulaire (Formspree, Netlify Forms) ou votre propre endpoint. */

  var form = document.querySelector('.form');

  if (form) {
    var note = form.querySelector('.form-note');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var champs = form.querySelectorAll('input, textarea');
      var premierInvalide = null;

      champs.forEach(function (champ) {
        var valide = champ.checkValidity();
        champ.setAttribute('aria-invalid', String(!valide));
        if (!valide && !premierInvalide) premierInvalide = champ;
      });

      if (premierInvalide) {
        note.textContent = 'Merci de completer les champs manquants.';
        note.classList.remove('est-ok');
        premierInvalide.focus();
        return;
      }

      note.textContent = 'Message pris en compte (demo : rien n’est envoye).';
      note.classList.add('est-ok');
      form.reset();
      champs.forEach(function (champ) { champ.removeAttribute('aria-invalid'); });
    });
  }

  /* --- Annee courante dans le pied de page -------------------------------- */

  var annee = document.querySelector('[data-annee]');
  if (annee) annee.textContent = String(new Date().getFullYear());
})();

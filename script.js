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

  /* --- Fenetre de tarifs (ouverte depuis une carte de la Boutique) -------- */

  var TARIFS = {
    tasses: {
      titre: 'Mugs & tasses — tarifs',
      pieces: [
        { img: 'IMAGES/web/tarifs/tasses/m1.webp', alt: 'M1 — Mug en céramique, 350 ml', prix: 'Prix : 15 € / unité' },
        { img: 'IMAGES/web/tarifs/tasses/m2.webp', alt: 'M2 — Tasse en céramique noire, 350 ml', prix: 'Prix : 15 € / unité' },
        { img: 'IMAGES/web/tarifs/tasses/m3.webp', alt: 'M3 — Tasse en céramique, 280 ml', prix: 'Prix : 15 € / unité' },
        { img: 'IMAGES/web/tarifs/tasses/m4.webp', alt: 'M4 — Mug en céramique mini, 200 ml', prix: 'Prix : 15 € / unité' },
        { img: 'IMAGES/web/tarifs/tasses/m5.webp', alt: 'M5 — Mug en inox émaillé, 350 ml', prix: 'Prix : 15 € / unité' },
        { img: 'IMAGES/web/tarifs/tasses/m6.webp', alt: 'M6 — Bouteille de sport, 400 ml', prix: 'Prix : 10 € / unité' },
        { img: 'IMAGES/web/tarifs/tasses/m7.webp', alt: 'M7 — Gourde double paroi', prix: 'Prix : 17 € / unité' }
      ]
    },
    textile: {
      titre: 'Textiles — tarifs',
      pieces: [
        { img: 'IMAGES/web/tarifs/textile/t1.webp', alt: 'T1 — T-shirt / Polo', prix: 'Prix : 19 € / unité' },
        { img: 'IMAGES/web/tarifs/textile/t2.webp', alt: 'T2 — Sweat à capuche', prix: 'Prix : 29 € / unité' },
        { img: 'IMAGES/web/tarifs/textile/t3.webp', alt: 'T3 — Tote bag / Sac', prix: 'Prix : 5 € / unité' }
      ]
    },
    gravures: {
      titre: 'Objets en bois — tarifs',
      pieces: [
        // Les prix figurent deja sur ce visuel, aucune legende ajoutee.
        { img: 'IMAGES/web/tarifs/gravures/gravures.webp', alt: 'Tarifs des objets en bois gravés au laser : sous-verre avec décapsuleur, pot de bonbons, planche de service' }
      ]
    }
  };

  var fenetreTarifs = document.querySelector('.fenetre-tarifs');
  var declencheursTarifs = document.querySelectorAll('[data-tarifs]');

  if (fenetreTarifs && declencheursTarifs.length) {
    var tGrille = fenetreTarifs.querySelector('.fenetre-tarifs-grille');
    var tTitre = fenetreTarifs.querySelector('.fenetre-tarifs-titre');
    var tDeclencheur = null;

    var ouvrirTarifs = function (cle, source) {
      var groupe = TARIFS[cle];
      if (!groupe) return;

      tDeclencheur = source;
      tTitre.textContent = groupe.titre;
      tGrille.innerHTML = '';
      tGrille.classList.toggle('fenetre-tarifs-grille--unique', groupe.pieces.length === 1);

      groupe.pieces.forEach(function (piece) {
        var figure = document.createElement('figure');
        var img = document.createElement('img');
        img.src = piece.img;
        img.alt = piece.alt;
        img.loading = 'lazy';
        figure.appendChild(img);
        // Le prix n'est ajouté que si la piece en fournit un : certaines
        // images (ex. gravures) l'affichent deja dans le visuel.
        if (piece.prix) {
          var figcaption = document.createElement('figcaption');
          figcaption.textContent = piece.prix;
          figure.appendChild(figcaption);
        }
        tGrille.appendChild(figure);
      });

      fenetreTarifs.hidden = false;
      document.body.style.overflow = 'hidden';
      fenetreTarifs.querySelector('.fenetre-tarifs-fermer').focus();
    };

    var fermerTarifs = function () {
      fenetreTarifs.hidden = true;
      tGrille.innerHTML = '';
      document.body.style.overflow = '';
      if (tDeclencheur) tDeclencheur.focus();
    };

    declencheursTarifs.forEach(function (carte) {
      carte.addEventListener('click', function () {
        ouvrirTarifs(carte.getAttribute('data-tarifs'), carte);
      });
      carte.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ouvrirTarifs(carte.getAttribute('data-tarifs'), carte);
        }
      });
    });

    fenetreTarifs.querySelector('.fenetre-tarifs-fermer').addEventListener('click', fermerTarifs);

    fenetreTarifs.addEventListener('click', function (e) {
      if (e.target === fenetreTarifs) fermerTarifs();
    });

    document.addEventListener('keydown', function (e) {
      if (!fenetreTarifs.hidden && e.key === 'Escape') fermerTarifs();
    });
  }

  /* --- Annee courante dans le pied de page -------------------------------- */

  var annee = document.querySelector('[data-annee]');
  if (annee) annee.textContent = String(new Date().getFullYear());
})();

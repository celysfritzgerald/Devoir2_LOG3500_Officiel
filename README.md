# LOG3500 - Conception et programmation de sites Web I
## Devoir 2 : Applications Web Asynchrones & API (Été 2026)

Ce projet consiste en l'implémentation d'une application Web asynchrone responsive connectée à des API réelles dans le cadre du cours LOG3500 à l'ISTEAH. L'application choisie et développée est Le Tableau de Bord Météo Dynamique (Option 2).


## Fonctionnalités de l'Application

- Recherche Double et Cascade API : L'utilisateur saisit le nom d'une ville. L'application interroge d'abord l'API de Géocodage Open-Meteo pour obtenir les coordonnées géographiques (Latitude, Longitude), puis appelle l'API Forecast pour générer la station météo.
- Asynchronisme Moderne : Utilisation de l'API fetch() configurée avec la syntaxe moderne async / await au sein d'un bloc robuste try...catch.
- Indicateur de Chargement : Un composant visuel (spinner d'attente CSS) apparaît pendant les appels réseaux et se désactive dès l'injection finale des données.
- Accessibilité Numérique (a11y) conforme :
  - Application dynamique de l'attribut aria-invalid="true" si une soumission vide est détectée.
  - Liaison sémantique des messages d'erreur textuels via l'attribut aria-describedby.
  - Réinitialisation automatique et transparente des erreurs dès que l'utilisateur corrige sa saisie.
- Sécurité Anti-XSS stricte : Utilisation obligatoire et exclusive de la propriété .textContent pour l'injection des variables textuelles issues du JSON, interdisant l'usage de innerHTML.
- Mise en Page Fluide & Responsive : Conception graphique épurée structurée en Flexbox et adaptée aux terminaux mobiles via l'implémentation de Media Queries.


## Matrice des Technologies

- HTML5 Sémantique (<header>, <nav>, <main>, <section>, <footer>)
- CSS3 Moderne (Flexbox, Keyframes Animations, Media Queries)
- JavaScript Écosystème ES6+ (Cascade asynchrone, validation de formulaires, manipulation sécurisée du DOM)
- APIs Externes Connectées : Open-Meteo Geocoding & Forecast APIs


## Architecture des Fichiers Requise

Conformément aux directives de l'énoncé, l'arborescence du dépôt se présente comme suit :

DEVOIR2_LOG3500_OFFICIEL
├── css/
│   └── style.css
├── js/
│   └── app.js
├── index.html
└── README.md


## Lancement Local

1. clonez ce dépôt de code GitHub Public :https://github.com/celysfritzgerald/Devoir2_LOG3500_Officiel.git   
2. Lancez le fichier index.html dans un navigateur Web moderne. Une connexion internet active est requise pour interroger les endpoints d'Open-Meteo.


## Prise en charge des Scénarios d'Erreurs

L'interface intercepte et affiche des messages clairs dans les cas suivants :
- Champ d'entrée vide : "Le champ de recherche ne peut pas être vide. Veuillez saisir une ville."
- Lieu introuvable / Erreur 404 : "Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe."
- Réseau interrompu / Serveur déconnecté : "Connexion impossible. Veuillez vérifier votre accès à internet."



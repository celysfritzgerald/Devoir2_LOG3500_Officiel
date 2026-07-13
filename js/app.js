document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const errorMessage = document.getElementById('error-message');
    const apiStatusMessage = document.getElementById('api-status-message');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('result-card');

    // Éléments de rendu de la carte de données
    const weatherLocation = document.getElementById('weather-location');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherStatus = document.getElementById('weather-status');
    const weatherWind = document.getElementById('weather-wind');

    /**
     * Décode la valeur du paramètre numérique weathercode en texte clair (Spécification Open-Meteo)
     */
    function decodeWeatherCode(code) {
        const tableCodes = {
            0: "Ensoleillé / Ciel dégagé",
            1: "Principalement dégagé",
            2: "Partiellement nuageux",
            3: "Nuageux",
            45: "Brouillard", 48: "Brouillard givrant",
            51: "Bruine légère", 53: "Bruine modérée", 55: "Bruine dense",
            61: "Pluie faible", 63: "Pluie modérée", 65: "Pluie forte",
            71: "Neige légère", 73: "Neige modérée", 75: "Neige forte",
            80: "Averses de pluie faibles", 81: "Averses de pluie modérées",
            95: "Orage faible ou modéré"
        };
        return tableCodes[code] || "Conditions atmosphériques variables";
    }

    /**
     * Supprime les attributs et états d'erreur d'accessibilité
     */
    function resetValidationError() {
        cityInput.removeAttribute('aria-invalid');
        cityInput.removeAttribute('aria-describedby');
        errorMessage.textContent = '';
    }

    /**
     * Injecte dynamiquement les attributs d'accessibilité en cas d'erreur de saisie
     */
    function setValidationError(message) {
        cityInput.setAttribute('aria-invalid', 'true');
        cityInput.setAttribute('aria-describedby', 'error-message');
        errorMessage.textContent = message;
    }

    // Réinitialisation automatique de l'état d'erreur lorsque l'utilisateur corrige sa saisie
    cityInput.addEventListener('input', () => {
        if (cityInput.value.trim() !== '') {
            resetValidationError();
        }
    });

    // Interception de l'événement submit du formulaire
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche le rechargement automatique de la page

        const searchTerm = cityInput.value.trim(); // Nettoyage de l'entrée textuelle

        // Réinitialisation des affichages
        resetValidationError();
        apiStatusMessage.classList.add('hidden');
        apiStatusMessage.textContent = '';
        resultCard.classList.add('hidden');

        // Validation d'accessibilité numérique : si le champ de recherche est vide
        if (searchTerm === '') {
            setValidationError('Le champ de recherche ne peut pas être vide. Veuillez saisir une ville.');
            cityInput.focus();
            return;
        }

        // Activation du composant visuel de chargement (spinner d'attente)
        loader.classList.remove('hidden');

        // Bloc de capture try...catch couplé à l'architecture asynchrone fetch/async/await
        try {
            // ÉTAPE 1 : Appel à l'API de Géocodage pour extraire la latitude et la longitude
            const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=1`;
            const geoResponse = await fetch(geocodingUrl);

            if (!geoResponse.ok) {
                throw new Error("Une erreur est survenue lors de la communication avec le service de géocodage.");
            }

            const geoData = await geoResponse.json();

            // Interception si le tableau de résultats renvoyé par l'API est vide (Lieu introuvable)
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
            }

            // Extraction des données géographiques requises du premier résultat trouvé
            const targetLocation = geoData.results[0];
            const lat = targetLocation.latitude;
            const lon = targetLocation.longitude;
            const cityName = targetLocation.name;
            const countryName = targetLocation.country || "";

            // ÉTAPE 2 : Appel en cascade à l'API de prévisions météo grâce aux coordonnées obtenues
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
            const weatherResponse = await fetch(weatherUrl);

            if (!weatherResponse.ok) {
                throw new Error("Impossible de récupérer les conditions météorologiques pour ces coordonnées.");
            }

            const weatherData = await weatherResponse.json();
            const current = weatherData.current_weather;

            if (!current) {
                throw new Error("Les données météo sont momentanément indisponibles.");
            }

            // --- INJECTION STRUCTURÉE ET SÉCURISÉE (Utilisation stricte de textContent pour éviter les failles XSS) ---
            
            // 1. Nom de la ville et son pays associé
            weatherLocation.textContent = countryName ? `${cityName}, ${countryName}` : cityName;

            // 2. Température actuelle formatée en degrés Celsius
            weatherTemp.textContent = `${current.temperature}°C`;

            // 3. Statut météorologique décodé en clair depuis le weathercode
            weatherStatus.textContent = decodeWeatherCode(current.weathercode);

            // 4. Vitesse du vent
            weatherWind.textContent = `${current.windspeed} km/h`;

            // Rendu final de la carte météo
            resultCard.classList.remove('hidden');

        } catch (error) {
            // Gestion et traitement adapté des erreurs d'API et de réseau
            apiStatusMessage.classList.remove('hidden');

            if (error.message.includes('Failed to fetch') || !navigator.onLine) {
                // Scénario de coupure réseau ou serveur inaccessible
                apiStatusMessage.textContent = "Connexion impossible. Veuillez vérifier votre accès à internet.";
            } else {
                // Scénario d'erreur 404 / Tableau vide
                apiStatusMessage.textContent = error.message;
            }
        } finally {
            // Désactivation systématique du loader d'attente à la fin de la promesse
            loader.classList.add('hidden');
        }
    });
});

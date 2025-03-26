// 1. Déclarations globales
let works = [];
const API_URL = "http://localhost:5678";

// 2. Fonctions principales
async function init() {
    try {
        await fetchWorks();
        displayWorks(works);
        setupFilters();
        checkAuthState();
        
        if (isLoggedIn()) {
            await displayWorksInModal();
            setupModalEvents();
        }
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
    }
}

// 3. Fonctions utilitaires
function isLoggedIn() {
    return localStorage.getItem("authToken") !== null;
}

async function fetchWorks() {
    try {
        const response = await fetch(`${API_URL}/api/works`);
        if (!response.ok) throw new Error('Erreur réseau');
        works = await response.json();
        return works;
    } catch (error) {
        console.error("Erreur de chargement des projets:", error);
        return [];
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) throw new Error('Erreur réseau');
        return await response.json();
    } catch (error) {
        console.error("Erreur de chargement des catégories:", error);
        return [];
    }
}

// 4. Fonctions d'affichage
function displayWorks(worksToDisplay = works) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    
    gallery.innerHTML = worksToDisplay.map(work => `
        <figure data-id="${work.id}">
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        </figure>
    `).join("");
}

async function displayWorksInModal() {
    const modalContent = document.querySelector('.modaleContainer_images');
    if (!modalContent) return;
    
    modalContent.innerHTML = works.map(work => `
        <div class="work-item">
            <img src="${work.imageUrl}" alt="${work.title}">
            <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
        </div>
    `).join("");
    
    setupDeleteIcons();
}
function checkAuthState() {
    const token = localStorage.getItem('authToken');
    const loginLink = document.getElementById('log_in_out');
    const filtreDiv = document.querySelector('.filtre');
    const bandeau = document.getElementById('bandeau');
    const modifProjets = document.querySelector('.modifProjets');

    if (token) {
        // Mode connecté
        loginLink.innerHTML = '<a href="#" id="logout">logout</a>';
        document.getElementById('logout').addEventListener('click', logout);
        
        // Afficher les éléments admin
        bandeau?.classList.remove('inactive');
        modifProjets?.classList.remove('inactive');
        filtreDiv?.classList.add('inactive'); // Masquer les filtres
        
        // Ajouter classe au body pour le CSS
        document.body.classList.add('logged-in');
    } else {
        // Mode déconnecté
        loginLink.innerHTML = '<a href="./login.html">login</a>';
        
        // Cacher les éléments admin
        bandeau?.classList.add('inactive');
        modifProjets?.classList.add('inactive');
        filtreDiv?.classList.remove('inactive'); // Afficher les filtres
        
        // Retirer classe au body
        document.body.classList.remove('logged-in');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = './index.html'; // Redirection vers la page d'accueil
}

function setupDeleteIcons() {
    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', handleDeleteWork);
    });
}async function handleDeleteWork(e) {
    const workId = e.target.dataset.id;
    if (!workId) return;
  
    try {
      // Feedback visuel immédiat
      e.target.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
      e.target.style.pointerEvents = 'none';
  
      const response = await fetch(`${API_URL}/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      if (response.status === 401) {
        logout();
        return;
      }
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec de suppression');
      }
  
      // Mise à jour optimisée
      works = works.filter(w => w.id != workId);
      displayWorks();
      await displayWorksInModal();
  
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      document.querySelectorAll(`.delete-icon[data-id="${workId}"]`).forEach(btn => {
        btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        btn.style.pointerEvents = 'auto';
      });
    }
  }

async function setupFilters() {
    const categories = await fetchCategories();
    const filterContainer = document.querySelector('.filtre');
    if (!filterContainer) return;
    
    filterContainer.innerHTML = '';
    
    // Bouton "Tous"
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => displayWorks());
    filterContainer.appendChild(allButton);
    
    // Boutons par catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => {
            const filteredWorks = works.filter(work => work.categoryId === category.id);
            displayWorks(filteredWorks);
        });
        filterContainer.appendChild(button);
    });
}
function setupModalEvents() {
    const modale = document.getElementById('modale');
    const openModaleBtn = document.querySelector('.modifProjets'); // Sélectionne le bouton modifier
    const closeModaleBtn = document.querySelector('.modaleContainer_fermeture');
    const addPhotoBtn = document.querySelector('.modaleContainer_validation button');

    // Ouvrir la modale
    if (openModaleBtn) {
        openModaleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modale.classList.remove('inactive');
            document.body.style.overflow = 'hidden'; // Désactive le scroll
        });
    }

    // Fermer la modale
    if (closeModaleBtn) {
        closeModaleBtn.addEventListener('click', () => {
            modale.classList.add('inactive');
            document.body.style.overflow = '';
        });
    }

    // Bouton "Ajouter une photo"
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.modaleContainer_content').classList.add('inactive');
            document.querySelector('.modaleContainer_form').classList.remove('inactive');
            document.querySelector('.modaleContainer_titre').textContent = 'Ajout photo';
        });
    }

    // Gérer le retour en arrière
    const backBtn = document.querySelector('.modaleContainer_retour');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.querySelector('.modaleContainer_content').classList.remove('inactive');
            document.querySelector('.modaleContainer_form').classList.add('inactive');
            document.querySelector('.modaleContainer_titre').textContent = 'Galerie photo';
        });
    }
}
// 6. Initialisation
//Flux principal :
//async function init() {
    //await fetchWorks(); // Charge les projets
  // displayWorks(works); // Affiche la galerie
  // setupFiltre(); // Initialise les filtres
   //checkAuthState(); // Vérifie la connexion
    
    //if (isLoggedIn()) {
        await displayWorksInModal(); // Affiche la modale si connecté
        setupModalEvents(); // Configure les événements modaux
    //}
//}

/************************************************
 * FONCTIONS SPÉCIFIQUES À LA PAGE LOGIN
 * (Ne s'exécutent QUE sur login.html)
 ************************************************/

// Fonction principale pour les filtres login
async function initLoginFilters() {
  if (!document.getElementById('login-filters')) return; // Quitte si pas sur login.html

  try {
    // 1. Charge les données
    const works = await fetch('http://localhost:5678/api/works').then(r => r.json());
    const categories = await fetch('http://localhost:5678/api/categories').then(r => r.json());

    // 2. Affiche les boutons
    renderLoginFilters(categories);
    
    // 3. Affiche tous les projets
    displayLoginProjects(works);
    
    // 4. Configure les événements
    setupLoginFilterEvents(works);
  } catch (error) {
    console.error("Erreur dans initLoginFilters:", error);
  }
}

// Affiche les boutons filtres
function renderLoginFilters(categories) {
  const container = document.getElementById('login-filters');
  container.innerHTML = `
    <button class="active" data-filter="all">Tous</button>
    ${categories.map(cat => `
      <button data-filter="${cat.id}">${cat.name}</button>
    `).join('')}
  `;
}

// Affiche les projets
function displayLoginProjects(projects) {
  const gallery = document.getElementById('login-gallery');
  gallery.innerHTML = projects.map(project => `
    <figure>
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
  `).join('');
}

// Gère les clics sur les filtres
function setupLoginFilterEvents(allWorks) {
  document.getElementById('login-filters').addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    
    // Met à jour le bouton actif
    document.querySelectorAll('#login-filters button').forEach(btn => {
      btn.classList.toggle('active', btn === e.target);
    });
    
    // Filtre les projets
    const filterValue = e.target.dataset.filter;
    const filteredWorks = filterValue === 'all'
      ? allWorks
      : allWorks.filter(work => work.categoryId == filterValue);
    
    displayLoginProjects(filteredWorks);
  });
}

// Lance l'initialisation
document.addEventListener('DOMContentLoaded', initLoginFilters);

// 1. Configuration
const CONFIG = {
    API_URL: window.location.hostname === 'localhost' 
      ? "http://localhost:5678" 
      : "https://votre-api-en-production.com",
    CACHE_TTL: 300000 // 5 minutes en ms
  };
  
  // 2. État de l'application
  const STATE = {
    works: [],
    categories: [],
    cache: {
      lastUpdated: null
    }
  };
  
  // 3. Références DOM
  const DOM = {
    gallery: document.querySelector('.gallery'),
    modal: document.getElementById('modale'),
    filterContainer: document.querySelector('.filtre'),
    // ... autres éléments
  };
  // 5. Fonctions principales
  async function loadData() {
    const [works, categories] = await Promise.all([
      fetchWorks(),
      fetchCategories()
    ]);
    
    STATE.works = works;
    STATE.categories = categories;
    STATE.cache.lastUpdated = Date.now();
  }
  
  function renderUI() {
    renderGallery();
    renderFilters();
    updateAuthUI();
  }
  // ... autres fonctions avec les améliorations mentionnées
  
  // Initialisation
  document.addEventListener('DOMContentLoaded', init);

 //2 Optimisation des Event Listeners
 // Au lieu de multiples addEventListener, utiliser la délégation d'événements
document.querySelector('.modaleContainer_images').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-icon')) {
      handleDeleteWork(e);
    }
  });
  //3. Amélioration de la Modale
  // Ajouter ces fonctions pour mieux gérer la modale
function openModal() {
    document.getElementById('modale').classList.remove('inactive');
    document.body.style.overflow = 'hidden'; // Empêche le scroll
  }
  
  function closeModal() {
    document.getElementById('modale').classList.add('inactive');
    document.body.style.overflow = '';
  }
  //4. Validation du Formulaire
  // Ajouter une validation côté client avant l'envoi
function validateForm(formData) {
    if (!formData.get('image') || !formData.get('title') || !formData.get('category')) {
      showError('Tous les champs sont obligatoires');
      return false;
    }
    return true;
  }
  //5. Gestion des Erreurs Améliorée
  // Créer un système centralisé de gestion d'erreurs
function handleAPIError(error) {
    console.error('API Error:', error);
    if (error.message === 'Failed to fetch') {
      showError('Problème de connexion au serveur');
    } else if (error.status === 401) {
      showError('Session expirée, veuillez vous reconnecter');
      logout();
    } else {
      showError('Une erreur est survenue');
    }
  }
 // 7. Internationalisation
 // Préparer les textes pour traduction
const I18N = {
    fr: {
      deleteConfirm: 'Voulez-vous vraiment supprimer ce projet ?',
      // ... autres textes
    },
    en: {
      deleteConfirm: 'Do you really want to delete this project?',
      // ... autres textes
    }
  };
  
  //8. Cache Management
  // Gérer le cache pour éviter des requêtes inutiles
let cache = {
    works: null,
    categories: null,
    lastUpdated: null
  };
  async function setupAddPhotoForm() {
    const categoriesSelect = document.getElementById('categories');
    if (!categoriesSelect) return;

    try {
        const categories = await fetchCategories();
        categoriesSelect.innerHTML = categories.map(category => 
            `<option value="${category.id}">${category.name}</option>`
        ).join('');
    } catch (error) {
        console.error("Erreur de chargement des catégories:", error);
    }
}
if (isLoggedIn()) {
    await displayWorksInModal();
    setupModalEvents();
    await setupAddPhotoForm(); // Ajoutez cette ligne
}

function setupFormSubmission() {
    const form = document.querySelector('.modaleContainer_form');
    const fileInput = document.getElementById('file');
    const titleInput = document.getElementById('titre');
    const categorySelect = document.getElementById('categories');
    const validationButton = document.querySelector('#modaleForm_valider input[type="submit"]');

    if (!form) return;

    // Prévisualisation de l'image
    fileInput.addEventListener('change', function(e) {
        const preview = document.querySelector('.modaleForm_ajoutPhoto img');
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.classList.remove('inactive');
                document.querySelector('.ajoutPhoto_container').classList.add('inactive');
            };
            reader.readAsDataURL(file);
        }
    });

    // Validation du formulaire
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categorySelect.value);

        try {
            const response = await fetch(`${API_URL}/api/works`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Erreur lors de l\'ajout');

            const newWork = await response.json();
            works.push(newWork);
            
            // Mise à jour de l'affichage
            displayWorks();
            displayWorksInModal();
            
            // Réinitialisation du formulaire
            form.reset();
            document.querySelector('.modaleForm_ajoutPhoto img').classList.add('inactive');
            document.querySelector('.ajoutPhoto_container').classList.remove('inactive');
            
            // Retour à la galerie
            document.querySelector('.modaleContainer_content').classList.remove('inactive');
            document.querySelector('.modaleContainer_form').classList.add('inactive');
            document.querySelector('.modaleContainer_titre').textContent = 'Galerie photo';
            
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout du projet');
        }
    });

    // Activation/Désactivation du bouton Valider
    function checkFormValidity() {
        const isValid = fileInput.files.length > 0 && 
                      titleInput.value.trim() !== '' && 
                      categorySelect.value !== '';
        
        validationButton.parentElement.classList.toggle('nonValide', !isValid);
        validationButton.disabled = !isValid;
    }

    fileInput.addEventListener('change', checkFormValidity);
    titleInput.addEventListener('input', checkFormValidity);
    categorySelect.addEventListener('change', checkFormValidity);
}
if (isLoggedIn()) {
    await displayWorksInModal();
    setupModalEvents();
    await setupAddPhotoForm();
    setupFormSubmission(); // Ajoutez cette ligne
}

//Sécurité Renforcée :
// Ajoutez un intercepteur pour vérifier les réponses API
async function safeFetch(url, options = {}) {
    const response = await fetch(url, options);
    if (response.status === 401) { // Non autorisé
        logout();
        throw new Error('Session expirée');
    }
    return response;
}
//Gestion des Erreurs Utilisateur :
function showFeedback(message, isError = false) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isError ? 'error' : 'success'}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 3000);
}
//Optimisation des Performances :
// Cachez les images déjà chargées
const imageCache = new Map();

function loadImageWithCache(url) {
    if (imageCache.has(url)) return imageCache.get(url);
    
    const img = new Image();
    img.src = url;
    imageCache.set(url, img);
    return img;
}
//Documentation :
/**
 * Ajoute un nouveau projet à la galerie
 * @param {FormData} formData - Contient image, title et category
 * @returns {Promise<Object>} Le nouveau projet créé
 * @throws {Error} Si l'API retourne une erreur
 */
async function addWork(formData) {
    // ... votre code existant
}

//Drag & Drop :
const dropZone = document.querySelector('.ajoutPhoto_container');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    // Déclenche le changement comme si l'utilisateur avait sélectionné un fichier
    fileInput.dispatchEvent(new Event('change'));
});
//Édition en Direct :
// Permettre de cliquer sur un titre dans la galerie pour l'éditer
function setupInlineEditing() {
    document.querySelectorAll('figcaption').forEach(caption => {
        caption.addEventListener('click', () => {
            const newTitle = prompt('Nouveau titre :', caption.textContent);
            if (newTitle) updateWorkTitle(caption.dataset.id, newTitle);
        });
    });
}
//Animation de Chargement :
function toggleLoading(show) {
    const loader = document.getElementById('loader') || createLoader();
    loader.style.display = show ? 'block' : 'none';
}

function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
    return loader;
}
console.log(localStorage.getItem("authToken"));

// Testez dès demain dans la console
console.log("Flèche existe:", !!document.querySelector('.modaleContainer_retour'));
console.log("Classe 'inactive':", document.querySelector('.modaleContainer_retour').classList.contains('inactive'));


// Dans setupModalEvents()
const backBtn = document.querySelector('.modaleContainer_retour');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    document.querySelector('.modaleContainer_content').classList.remove('inactive');
    document.querySelector('.modaleContainer_form').classList.add('inactive');
    document.querySelector('.modaleContainer_titre').textContent = 'Galerie photo';
    backBtn.classList.add('inactive');
  });
}
// À tester en premier
console.log("Position de la flèche:", 
    document.querySelector('.modaleContainer_retour')?.getBoundingClientRect());
console.log("Z-Index:", 
    window.getComputedStyle(document.querySelector('.modaleContainer_retour')).zIndex);

 // Version super-robuste
function setupBackButton() {
    const backBtn = document.querySelector('.modaleContainer_retour');
    if (!backBtn) return;
    
    backBtn.addEventListener('click', () => {
        // 1. Masquer le formulaire
        document.querySelector('.modaleContainer_form').classList.add('inactive');
        
        // 2. Réafficher la galerie
        const content = document.querySelector('.modaleContainer_content');
        content.classList.remove('inactive');
        
        // 3. Reset du titre
        document.querySelector('.modaleContainer_titre').textContent = 'Galerie photo';
        
        // 4. Animation fluide
        setTimeout(() => backBtn.classList.add('inactive'), 300);
    });
}   
console.log("État initial:", document.querySelector('.modaleContainer_retour').classList);
document.querySelector('.modaleContainer_retour').classList.remove('inactive');
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

// 5. Fonctions d'interaction
function checkAuthState() {
    const token = localStorage.getItem('authToken');
    const loginLink = document.getElementById('log_in_out');
    if (!loginLink) return;
    
    if (token) {
        loginLink.innerHTML = '<a href="#" id="logout">logout</a>';
        document.getElementById('logout').addEventListener('click', logout);
        document.getElementById('bandeau')?.classList.remove('inactive');
        document.querySelector('.modifProjets')?.classList.remove('inactive');
    } else {
        loginLink.innerHTML = '<a href="./login.html">login</a>';
    }
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.reload();
}

function setupDeleteIcons() {
    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', handleDeleteWork);
    });
}

async function handleDeleteWork(e) {
    const workId = e.target.dataset.id;
    if (!confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            works = works.filter(work => work.id != workId);
            displayWorks();
            displayWorksInModal();
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
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
    const openModaleBtn = document.querySelector('.modifProjets');
    const closeModaleBtn = document.querySelector('.modaleContainer_fermeture');
    
    if (openModaleBtn && closeModaleBtn) {
        openModaleBtn.addEventListener('click', () => {
            modale.classList.remove('inactive');
        });
        
        closeModaleBtn.addEventListener('click', () => {
            modale.classList.add('inactive');
        });
    }
}
// 6. Initialisation
document.addEventListener('DOMContentLoaded', init);

//Flux principal :
//async function init() {
   // await fetchWorks(); // Charge les projets
   // displayWorks(works); // Affiche la galerie
   // setupFilters(); // Initialise les filtres
   // checkAuthState(); // Vérifie la connexion
    
    //if (isLoggedIn()) {
        //await displayWorksInModal(); // Affiche la modale si connecté
        //setupModalEvents(); // Configure les événements modaux
   // }
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
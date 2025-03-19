    // Récupération des données "Catégories" via l'API
    async function fetchCategories() {
        try {
          const response = await fetch("http://localhost:5678/api/categories"); // Remplacez l'URL par celle de votre API
          if (!response.ok) {
            throw new Error("Erreur de récupération des catégories");
          }
          const categories = await response.json();
          return categories; // Retourne les catégories sous forme de tableau
        } catch (error) {
          console.error(error);
        }
      }
      
      // Afficher les catégories dans le select (ou ailleurs sur la page)
      async function displayCategories() {
        const categories = await fetchCategories();
        const categoriesSelect = document.getElementById("categories"); // Assurez-vous d'avoir un élément avec l'ID 'categories'
      
        categories.forEach(category => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categoriesSelect.appendChild(option);
        });
      }
      // Appeler la fonction pour afficher les catégories
      displayCategories();
      
      // Récupération des données "Projets" via l'API
      async function fetchProjets() {
        try {
          const response = await fetch("http://localhost:5678/api/works"); // Remplacez l'URL par celle de votre API
          if (!response.ok) {
            throw new Error("Erreur de récupération des projets");
          }
          const projets = await response.json();
          return projets; // Retourne les projets sous forme de tableau
        } catch (error) {
          console.error(error);
        }
      }
      
      // Afficher les projets dans la galerie
      async function displayProjets() {
        const projets = await fetchProjets();
        const gallery = document.querySelector(".gallery"); // Assurez-vous d'avoir un élément avec la classe 'gallery'
      
        projets.forEach(projet => {
          const projetDiv = document.createElement("div");
          projetDiv.classList.add("projet");
      
          // Créer l'image et la définir avec l'URL
          const img = document.createElement("img");
          img.src = projet.imageUrl;
          img.alt = projet.title || "Image du projet";
          projetDiv.appendChild(img);
      
          // Ajouter le titre du projet
          const titre = document.createElement("h3");
          titre.textContent = projet.title || "Titre indisponible";
          projetDiv.appendChild(titre);
      
          // Ajouter la catégorie du projet (optionnel)
          if (projet.category && projet.category.name) {
            const categorie = document.createElement("p");
            categorie.textContent = `Catégorie: ${projet.category.name}`;
            projetDiv.appendChild(categorie);
          }
      
          // Ajouter le projet à la galerie
          gallery.appendChild(projetDiv);
        });
      }
      // Appeler la fonction pour afficher les projets
      displayProjets();
      
      // Gestion de la page une fois connecté
      // Vérifier si l'utilisateur est connecté en vérifiant le token dans le localStorage
      function checkUserLoggedIn() {
        const userToken = localStorage.getItem("userToken"); // Par exemple, si le token est stocké dans le localStorage
        const loginLink = document.getElementById("log_in_out");
        const bandeau = document.getElementById("bandeau"); // Bandeau indiquant le mode édition, si nécessaire
      
        if (userToken) {
          // Si le token est trouvé, l'utilisateur est connecté
          loginLink.innerHTML = '<a href="./logout.html">Déconnexion</a>'; // Mettre à jour le lien de connexion
          bandeau.classList.remove("inactive"); // Si vous avez un bandeau qui doit apparaître en mode connecté
          bandeau.querySelector("span").textContent = "Mode édition"; // Exemple de modification pour le mode édition
      
          // Vous pouvez également modifier d'autres éléments pour afficher un contenu spécifique aux utilisateurs connectés
          displayUserContent();
        } else {
          // Si l'utilisateur n'est pas connecté, afficher les éléments par défaut
          loginLink.innerHTML = '<a href="./login.html">logout</a>';
          bandeau.classList.add("inactive"); // Cacher le bandeau si l'utilisateur n'est pas connecté
        }
      }
      
      // Appel de la fonction pour vérifier la connexion
      checkUserLoggedIn();
      
      // Fonction pour activer le mode édition
      function afficherModeEdition() {
        const bandeau = document.getElementById("bandeau");
        const modifProjets = document.getElementById("modifProjets"); // Exemple de bouton de modification
      
        // Vérifie si l'utilisateur est connecté pour activer le mode édition
        const userToken = localStorage.getItem("userToken");
      
        if (userToken) {
          bandeau.classList.remove("inactive"); // Affiche le bandeau de mode édition
          bandeau.classList.add("active"); // Active le mode édition
      
          // Affiche les boutons ou options d'édition
          if (modifProjets) {
            modifProjets.classList.remove("inactive");
          }
        } else {
          bandeau.classList.add("inactive"); // Cache le bandeau de mode édition si l'utilisateur n'est pas connecté
          modifProjets.classList.add("inactive"); // Cache le bouton de modification des projets
        }
      }
      
      // Appel de la fonction pour afficher le mode édition si l'utilisateur est connecté
      afficherModeEdition();
      //Exemple de fonction pour rendre les éléments modifiables :
      
      // Exemple de fonction pour activer des champs d'édition (rendre modifiables les éléments de la page)
      function activerEditionProjets() {
        const projectTitle = document.querySelectorAll(".project-title"); // Titre des projets
        const projectImages = document.querySelectorAll(".project-image"); // Images des projets
        const editButtons = document.querySelectorAll(".edit-button"); // Boutons d'édition des projets
      
        projectTitle.forEach(title => {
          title.contentEditable = true; // Rendre le titre modifiable
        });
      
        projectImages.forEach(image => {
          image.style.pointerEvents = "auto"; // Permettre de modifier les images
        });
      
        editButtons.forEach(button => {
          button.style.display = "block"; // Afficher les boutons d'édition
        });
      }
      
      // Récupérer les éléments
      const bandeau = document.getElementById("bandeau");
      const modifProjets = document.getElementById("modifProjets");
      const modale = document.getElementById("modale");
      const fermetureModale = document.querySelector(".modaleContainer_fermeture");
      
      // Ouvrir la modale lorsque le bouton "modifier" est cliqué
      modifProjets.addEventListener("click", function() {
        modale.classList.remove("inactive"); // Affiche la modale
      });
      
      // Fermer la modale lorsque le bouton de fermeture est cliqué
      fermetureModale.addEventListener("click", function() {
        modale.classList.add("inactive"); // Cache la modale
      });
      
      // Vérifie si l'utilisateur est connecté et affiche le mode édition
      function checkConnexion() {
        const utilisateurConnecte = localStorage.getItem("utilisateur"); // Par exemple, si tu stockes un token utilisateur
        if (utilisateurConnecte) {
          afficherModeEdition(); // Affiche le mode édition si l'utilisateur est connecté
        }
      }
      
      // Appelle cette fonction au chargement de la page
      checkConnexion();
      
      // Récupère le bouton de logout
      const logoutButton = document.getElementById("log_in_out");
      
      document.addEventListener("DOMContentLoaded", function() {
        // Vérifier si l'utilisateur est connecté
        const utilisateur = localStorage.getItem("utilisateur");
        const bandeauEdition = document.getElementById("bandeau");
        const boutonLogout = document.getElementById("logoutButton");
        const boutonModifProjets = document.getElementById("modifProjets");
      
        // Vérifier si l'utilisateur est connecté et afficher le mode édition
        if (utilisateur) {
          // Afficher le bandeau mode édition si l'utilisateur est connecté
          bandeauEdition.classList.remove("inactive");
          boutonModifProjets.classList.remove("inactive"); // Afficher le bouton modifier les projets
        } else {
          // Si non connecté, masquer le mode édition et les boutons associés
          bandeauEdition.classList.add("inactive");
          boutonModifProjets.classList.add("inactive");
        }
      
        // Gérer le clic sur le bouton de déconnexion
        if (boutonLogout) {
          boutonLogout.addEventListener("click", function(event) {
            event.preventDefault(); // Empêche l'action par défaut du lien
            localStorage.removeItem("utilisateur"); // Supprime l'utilisateur du localStorage
            window.location.href = "login.html"; // Redirige vers la page de connexion
          });
        }
      
        // Ajouter d'autres initialisations si nécessaires (par exemple, les projets ou les catégories)
        // Vous pouvez appeler des fonctions comme fetchCategories() et fetchProjets() ici si vous en avez besoin.
      });
      // Lancement des fonctions de démarrage
      // Fonctions de démarrage
      document.addEventListener("DOMContentLoaded", function() {
        // Fonction pour initialiser la page
        function initialiserPage() {
          // Vérifier si l'utilisateur est connecté et afficher le mode édition
          const utilisateur = localStorage.getItem("utilisateur");
          const bandeauEdition = document.getElementById("bandeau");
          const boutonLogout = document.getElementById("logoutButton");
          const boutonModifProjets = document.getElementById("modifProjets");
      
          // Vérifier si l'utilisateur est connecté et afficher le mode édition
          if (utilisateur) {
            // Afficher le bandeau mode édition si l'utilisateur est connecté
            bandeauEdition.classList.remove("inactive");
            boutonModifProjets.classList.remove("inactive"); // Afficher le bouton modifier les projets
          } else {
            // Si non connecté, masquer le mode édition et les boutons associés
            bandeauEdition.classList.add("inactive");
            boutonModifProjets.classList.add("inactive");
          }
      
          // Gérer le clic sur le bouton de déconnexion
          if (boutonLogout) {
            boutonLogout.addEventListener("click", function(event) {
              event.preventDefault(); // Empêche l'action par défaut du lien
              localStorage.removeItem("utilisateur"); // Supprime l'utilisateur du localStorage
              window.location.href = "login.html"; // Redirige vers la page de connexion
            });
          }
      
          // Lancer les autres initialisations
          chargerCategories(); // Charger les catégories
          chargerProjets(); // Charger les projets
        }
      
        // Fonction pour charger les catégories via l'API
        function chargerCategories() {
          fetch("http://localhost:5678/api/categories")
            .then(response => response.json())
            .then(categories => {
              const selectCategories = document.getElementById("categories");
              categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                selectCategories.appendChild(option);
              });
            })
            .catch(error => console.error("Erreur de chargement des catégories:", error));
        }
      
        // Fonction pour charger les projets via l'API
        function chargerProjets() {
          fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(projets => {
              const gallery = document.querySelector(".gallery");
              projets.forEach(projet => {
                const projetElement = document.createElement("div");
                projetElement.classList.add("projet");
                projetElement.innerHTML = `
                    <img src="${projet.imageUrl}" alt="${projet.title}">
                    <h3>${projet.title}</h3>
                  `;
                gallery.appendChild(projetElement);
              });
            })
            .catch(error => console.error("Erreur de chargement des projets:", error));
        }
      
        // Appeler la fonction pour initialiser la page
        initialiserPage();
      });
      // Fonction pour afficher les catégories sous forme de boutons de filtre
      function afficherFiltres() {
        fetch("http://localhost:5678/api/categories")
          .then(response => response.json())
          .then(categories => {
            const filtreContainer = document.querySelector(".filtre");
      
            // Ajout du bouton "Tous"
            const boutonTous = document.createElement("button");
            boutonTous.textContent = "Tous";
            boutonTous.classList.add("filtre-btn", "active"); // Actif par défaut
            boutonTous.dataset.categoryId = "all";
            filtreContainer.appendChild(boutonTous);
      
            // Ajout des boutons pour chaque catégorie
            categories.forEach(category => {
              const bouton = document.createElement("button");
              bouton.textContent = category.name;
              bouton.classList.add("filtre-btn");
              bouton.dataset.categoryId = category.id;
              filtreContainer.appendChild(bouton);
            });
      
            // Gestion des événements de filtre
            activerFiltres();
          })
          .catch(error => console.error("Erreur lors du chargement des catégories :", error));
      }
      
      // Fonction pour gérer les filtres au clic
      function activerFiltres() {
        const boutonsFiltres = document.querySelectorAll(".filtre-btn");
        boutonsFiltres.forEach(bouton => {
          bouton.addEventListener("click", function() {
            // Retirer la classe active des autres boutons
            boutonsFiltres.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
      
            const categorieId = this.dataset.categoryId;
            filtrerProjets(categorieId);
          });
        });
      }
      
      // Fonction pour filtrer les projets selon la catégorie sélectionnée
      function filtrerProjets(categorieId) {
        fetch("http://localhost:5678/api/works")
          .then(response => response.json())
          .then(projets => {
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = ""; // Effacer la galerie avant de réafficher les projets filtrés
      
            projets.forEach(projet => {
              if (categorieId === "all" || projet.categoryId == categorieId) {
                const projetElement = document.createElement("div");
                projetElement.classList.add("projet");
                projetElement.innerHTML = `
                    <img src="${projet.imageUrl}" alt="${projet.title}">
                    <h3>${projet.title}</h3>
                  `;
                gallery.appendChild(projetElement);
              }
            });
          })
          .catch(error => console.error("Erreur lors du filtrage des projets :", error));
      }
      
      // Lancement de l'affichage des filtres au chargement de la page
      document.addEventListener("DOMContentLoaded", function() {
        afficherFiltres();
        filtrerProjets("all"); // Affiche tous les projets au démarrage
      });
      fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(projets => {
          console.log(projets); // Vérifie si les données contiennent bien imageUrl
        });
      //joute/modifie ce script pour gérer l'affichage après la déconnexion :
      document.addEventListener("DOMContentLoaded", function() {
        const bandeau = document.getElementById("bandeau");
        const modifProjets = document.getElementById("modifProjets");
        const logInOut = document.getElementById("log_in_out");
        const filtreContainer = document.querySelector(".filtre"); // Conteneur des filtres
      
        const token = sessionStorage.getItem("token");
      
        if (token) {
          // Si l'utilisateur est connecté (mode édition actif)
          bandeau.classList.remove("inactive");
          modifProjets.classList.remove("inactive");
      
          // Cacher les filtres
          if (filtreContainer) {
            filtreContainer.style.display = "none";
          }
      
          // Modifier le lien en "logout"
          logInOut.innerHTML = '<a href="#" id="logout">logout</a>';
          document.getElementById("logout").addEventListener("click", function(e) {
            e.preventDefault();
            sessionStorage.removeItem("token"); // Supprimer le token
            window.location.href = "index.html"; // Rediriger vers la page principale
          });
        } else {
          // Si l'utilisateur n'est pas connecté (mode normal)
          bandeau.classList.add("inactive");
          modifProjets.classList.add("inactive");
      
          // Afficher les filtres
          if (filtreContainer) {
            filtreContainer.style.display = "flex"; // Ou "block" selon le CSS
          }
      
          // Modifier le lien en "login"
          logInOut.innerHTML = '<a href="./login.html">login</a>';
        }
      });
      
      // Fonction pour récupérer les images depuis l'API et les afficher dans la modale
    const fetchImages = async () => {
      const token = localStorage.getItem("authToken"); // Récupérer le jeton d'authentification
      
      if (!token) {
        console.error('Aucun jeton trouvé, authentification échouée.');
        return;
      }
      
      try {
        // Effectuer la requête GET pour récupérer les images
        const response = await fetch('http://localhost:5678/api/works', {
          headers: {
            "Authorization": `Bearer ${token}` // Ajouter le jeton dans l'en-tête de la requête
          }
        });
    
        // Vérification si la réponse est correcte
        if (response.ok) {
          const data = await response.json(); // Analyser la réponse JSON
          console.log('Données des images:', data);
          
          // Appel à la fonction pour afficher les images dans la modale
          displayImages(data);
        } else {
          console.error('Erreur lors de la récupération des images:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur de récupération des images:', error);
      }
    };
    
    // Fonction pour afficher les images dans la modale avec l'icône corbeille
    const displayImages = (images) => {
      const modaleImagesContainer = document.querySelector('.modaleContainer_images'); // Conteneur où afficher les images
      
      // Vérification si le conteneur existe dans le DOM
      if (!modaleImagesContainer) {
        console.error('Le conteneur pour les images n\'existe pas');
        return;
      }
    
      modaleImagesContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les nouvelles images
    
      // Vérifier si l'API a renvoyé des images
      if (images && Array.isArray(images) && images.length > 0) {
        images.forEach((image) => {
          // Vérification des propriétés de l'image
          console.log('Image:', image);
          
          // Créer un élément div pour chaque image
          const imageElement = document.createElement('div');
          imageElement.classList.add('image-item'); // Ajouter une classe CSS pour styliser l'image
    
          // Créer l'élément img pour afficher l'image
          const img = document.createElement('img');
          img.src = image.imageUrl;  // URL de l'image depuis l'API
          img.alt = image.title;     // Titre de l'image
    
          // Créer l'icône corbeille (pour la suppression)
          const deleteIcon = document.createElement('i');
          deleteIcon.classList.add('fa-solid', 'fa-trash'); // Classes FontAwesome pour l'icône corbeille
          deleteIcon.style.cursor = 'pointer'; // Changer le curseur pour indiquer que c'est cliquable
    
          // Ajouter un événement pour supprimer l'image quand l'icône corbeille est cliquée
          deleteIcon.addEventListener('click', () => deleteImage(image.id));
    
          // Ajouter l'image et l'icône de suppression dans le même conteneur
          imageElement.appendChild(img);
          imageElement.appendChild(deleteIcon);
    
          // Ajouter l'élément image au conteneur de la modale
          modaleImagesContainer.appendChild(imageElement);
        });
      } else {
        console.log("Aucune image disponible");
        modaleImagesContainer.innerHTML = "Aucune image disponible."; // Message si aucune image
      }
    };
    
    // Fonction pour supprimer une image en utilisant l'API (requête DELETE)
    const deleteImage = async (imageId) => {
      const token = localStorage.getItem("authToken");  // Récupérer le jeton d'authentification
      
      if (!token) {
        console.error('Aucun jeton trouvé, authentification échouée.');
        return;
      }
    
      try {
        // Effectuer la requête DELETE pour supprimer l'image de l'API
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`  // Ajouter le jeton d'authentification
          }
        });
    
        if (response.ok) {
          console.log('Image supprimée avec succès');
          // Rafraîchir la modale après suppression
          fetchImages();
        } else {
          console.error('Erreur lors de la suppression de l\'image:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur de suppression de l\'image:', error);
      }
    };
    
    // Appel de la fonction au chargement de la page pour récupérer et afficher les images
    window.addEventListener('DOMContentLoaded', fetchImages);
    console.log(localStorage.getItem("authToken"));
    
    console.log(modifProjets);
    console.log(modale);
    modifProjets.addEventListener("click", function() {
      console.log("Bouton modifProjets cliqué !");
      modale.classList.remove("inactive");
    });
    
    document.addEventListener("DOMContentLoaded", () => {
      const deleteButtons = document.querySelectorAll(".delete-image"); // Assure-toi que ce bouton existe dans le HTML
      
      deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          const imageElement = e.target.closest(".image-container"); // Sélectionne l'élément de l'image (à adapter selon ton HTML)
          
          if (imageElement) {
            imageElement.remove(); // Supprime l'élément de l'image du DOM
            // Tu peux également envoyer une requête à ton backend pour supprimer l'image (exemple avec fetch)
            fetch(`/delete-image/${imageElement.dataset.imageId}`, { // Remplace par l'URL et l'ID de l'image
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }).then(response => {
              if (response.ok) {
                console.log("Image supprimée avec succès");
              } else {
                console.log("Erreur lors de la suppression de l'image");
              }
            });
          }
        });
      });
    });
    document.addEventListener("DOMContentLoaded", () => {
      const fileInput = document.getElementById("file");
      const imagePreview = document.querySelector("img"); // Sélectionne l'élément img pour la prévisualisation
      const form = document.querySelector(".modaleContainer_form");
      
    })
    
    document.addEventListener("DOMContentLoaded", () => {
      const modal = document.getElementById("modale");
      const openModalButton = document.getElementById("modifProjets"); // Ou tout autre bouton pour ouvrir la modale
      const closeModalButton = document.querySelector(".modaleContainer_fermeture"); // Bouton pour fermer la modale
      
      // Afficher la modale lorsqu'on clique sur un bouton
      openModalButton.addEventListener("click", () => {
        modal.classList.remove("inactive"); // Enlever la classe inactive pour afficher la modale
      });
    
      // Fermer la modale lorsqu'on clique sur la croix (x)
      closeModalButton.addEventListener("click", () => {
        modal.classList.add("inactive"); // Ajouter la classe inactive pour cacher la modale
      });
    });
    
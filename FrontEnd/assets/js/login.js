// Mise en place d'un listener sur le bouton "Se connecter"
const form = document.querySelector("form")

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Mise en forme pour POST HTTP
    const bodyLogin = {
        "email": form.email.value,
        "password": form.password.value,
    }
    const bodyLoginJSON = JSON.stringify(bodyLogin);
    
    // Envoie de la requète HTTP
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyLoginJSON,
    })

    // Récupération de la réponse HTTP et stockage du token
    const data = await reponse.json()
    if (reponse.status === 200) {
      const token = data.token
      window.sessionStorage.setItem("token", token);
      location.href = "./index.html";
    } else {
        document.querySelector(".erreur").innerText = "Nom d'utilisateur ou mot de passe incorrect";
    }
});


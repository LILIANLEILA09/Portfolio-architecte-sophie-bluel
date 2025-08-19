document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorDiv = document.querySelector('.erreur');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = form.email.value;
      const password = form.password.value;
      
      try {
        const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Échec de la connexion');
        }
  
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        window.location.href = './index.html'; // Redirection après connexion
        
      } catch (error) {
        errorDiv.textContent = error.message || 'Erreur de connexion au serveur';
        console.error('Erreur:', error);
      }
    });
  });
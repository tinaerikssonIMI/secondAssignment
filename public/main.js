document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#login form');
    const registerForm = document.querySelector('#register form');
    const logoutButton = document.getElementById('logoutButton');
    const loginError = document.getElementById('login-error-message');
    const registerError = document.getElementById('register-error-message');
    const userDiv = document.getElementById('username-div');

    const loginEndpoint = '/login';
    const registerEndpoint = '/register';
    const logoutEndpoint = '/logout';

    function handleError(element, message) {
        if (!element) {
            console.error('Elementet saknas:', message);
            return;
        }

        element.textContent = message;
        element.style.display = 'block';
    }

    async function getLoggedInPage() {
        const errorMessageDiv = document.getElementById('username-error-message'); // Define errorMessageDiv
    
        try {
            const response = await fetch('/loggedInPage', { headers:  { 'x-session-id': sessionStorage.getItem('session-id') }});

            if (!response.ok) {
                window.location.href = '/'; // Omdirigera till startsidan om inte inloggad
            } else {
                history.pushState({}, '', '/loggedInPage');
                document.body.innerHTML = await response.text();
                
                // Återfäst eventlistener på utloggningsknappen
                const newLogoutButton = document.getElementById('logoutButton');
                if (newLogoutButton) {
                    newLogoutButton.addEventListener('click', async function (event) {
                        event.preventDefault();
                        const sessionID = sessionStorage.getItem('session-id');
                        try {
                            const response = await fetch(logoutEndpoint, {
                                method: 'POST',
                                headers: { 'x-session-id': sessionID },
                            });

                            const data = await response.json();
                            if (response.ok) {
                                alert('Du loggas ut!');
                                sessionStorage.removeItem('session-id'); // Ta bort sessionID från sessionStorage
                                sessionStorage.removeItem('username'); // Ta bort användarnamn från sessionStorage
                                window.location.href = '/';  // Omdirigera till startsidan
                            } else {
                                handleError(errorMessageDiv, data.message || 'Fel vid utloggning.');
                            }
                        } catch (error) {
                            handleError(errorMessageDiv, 'Det gick inte att logga ut. Försök igen senare.');
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Något gick fel:', error);
        }
    }

    function getUsername() {
        const username = sessionStorage.getItem('username');
        if (!username) {
            return;
        }
        
        userDiv.textContent = username;
    }

    // Hantera inloggning
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(loginEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Inloggning lyckades!');
                    sessionStorage.setItem('session-id', data.sessionID);
                    sessionStorage.setItem('username', data.username);
                    getLoggedInPage();
                } else {
                    handleError(loginError, data.message || 'Ett fel inträffade.');
                }
            } catch (error) {
                handleError(loginError, 'Det gick inte att logga in. Försök igen senare.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                handleError(registerError, 'Lösenorden matchar inte.');
                return;
            }

            try {
                const response = await fetch(registerEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registrering lyckades!');
                    window.location.href = '/'; // Omdirigera till startsidan
                } else {
                    handleError(registerError, data.message || 'Ett fel inträffade.');
                }
            } catch (error) {
                handleError(registerError, 'Det gick inte att registrera. Försök igen senare.');
            }
        });
    }

    // Hantera utloggning
    if(logoutButton) {
        logoutButton.addEventListener('click', async function (event) {
            event.preventDefault();
            const sessionID = sessionStorage.getItem('session-id');
            try {
                const response = await fetch(logoutEndpoint, {
                    method: 'POST',
                    headers: { 'x-session-id': sessionID },
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Du loggas ut!');
                    sessionStorage.removeItem('session-id'); // Ta bort sessionID från sessionStorage
                    sessionStorage.removeItem('username'); // Ta bort användarnamn från sessionStorage
                    window.location.href = '/';  // Omdirigera till startsidan
                } else {
                    handleError(errorMessageDiv, data.message || 'Fel vid utloggning.');
                }
            } catch (error) {
                handleError(errorMessageDiv, 'Det gick inte att logga ut. Försök igen senare.');
            }
        });
    }
});
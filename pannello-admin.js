async function readAllUser() {
        event.preventDefault();

        try {
            const response = await fetch('https://customfantabe.onrender.com/read-all-user', {
                method: 'GET'
            });

            const data = await response.json();

        } catch (error) {
            console.error("Errore:", error);
        }
    }


async function deleteAllUser() {
        event.preventDefault();

        try {
            const response = await fetch('https://customfantabe.onrender.com/delete-all-user', {
                method: 'GET'
            });

            const data = await response.json();

        } catch (error) {
            console.error("Errore:", error);
        }
    }

async function deleteUserById(event) {
        event.preventDefault();

         const form = event.target;
         const username = form.usernameToDelete.value;

        try {
            const response = await fetch('https://customfantabe.onrender.com/delete-user/' + username, {
                method: 'GET'
            });

            const data = await response.json();

        } catch (error) {
            console.error("Errore:", error);
        }
    }

async function createAdminUser() {
        event.preventDefault();

        const username = "Antonio98";
        const nome = "Antonio";
        const email = "anto.pelle98@gmail.com";
        const password = "Password2025!";

        try {
            const response = await fetch('https://customfantabe.onrender.com/create-admin-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, nome, mail: email, password })
            });

            const data = await response.json();

        } catch (error) {
            console.error("Errore:", error);
        }
    }
async function createUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
        
    try {

      fetch('https://customfantabe.onrender.com/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'test',
          mail: email,
          password: password
        })
      })
        .then(response => response.json())
        .then(data => console.log('Successo:', data))
        .catch(error => console.error('Errore:', error));


    } catch (error) {
        console.error("Errore:", error);
    }
}


async function makeLogin() {
  const email = document.getElementById('email-log').value;
  const password = document.getElementById('password-log').value;
  
  try {

    fetch('https://customfantabe.onrender.com/make-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'test',
        mail: email,
        password: password
      })
    })
      .then(response => response.json())
      .then(data => console.log('Successo:', data))
      .catch(error => console.error('Errore:', error));


  } catch (error) {
      console.error("Errore:", error);
  }
}
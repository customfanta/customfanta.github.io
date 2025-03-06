let host = "https://customfantabe.onrender.com";

let apiCreaUtente = host + "/create-user";


async function getData() {
  try {
        fetch(apiCreaUtente, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: 'Titolo esempio',
            body: 'Contenuto del post',
            userId: 1
          })
        })
      .then(response => response.json())
      .then(data => console.log('Successo:', data))
      .catch(error => console.error('Errore:', error));
  } catch (error) {
    console.error('Errore:', error);
  }
}


getData();

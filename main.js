const url = 'http://localhost:8080'

function getUsers() {
  axios
    .get(url)
    .then(response => {
      const data = response.data

      renderApiResult.textContent = JSON.stringify(data)
    })
    .catch(error => console.log(error))
}

function addNewmusic(newmusic) {
  axios
    .post(url, newmusic)
    .then(response => {
      alert(JSON.stringify(response.data))
      getUsers()
    })
    .catch(error => console.error(error))
}

function deletemusic(id) {
  axios
    .delete(`${url}/${id}`)
    .then(response => {
      alert(JSON.stringify(response.data))
      getUsers()
    })
    .catch(error => console.error(error))
}

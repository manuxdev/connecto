export async function login (formData) {
  const data = {
    email: formData.email,
    password: formData.password

  }

  fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(async response => await response.json())
    .then(data => {
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

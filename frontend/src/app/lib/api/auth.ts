import { type User, type Login } from '../definitions'

export async function loginFetch (formData: Login): Promise<void> {
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

export async function signUpFetch (formData: User): Promise<void> {
  const data = {

    username: formData.username,
    first_name: formData.firstName,
    last_name: formData.lastName,
    phonenumber: formData.phoneNumber,
    email: formData.email,
    password: formData.password

  }

  fetch('http://localhost:4000/login/signup', {
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

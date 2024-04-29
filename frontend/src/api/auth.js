import { API_HOST, TOKEN } from '../utils/constants'
import {jwtDecode} from 'jwt-decode'
export async function signUpApi(user) {
    const url = `${API_HOST}/login/signup`
    const userTemp = {
        email: user.email.toLowerCase(),
        first_name: user.nombre,
        last_name: user.apellidos,
        username: user.username.toLowerCase(),
        password: user.password,
        phonenumber: user.phoneNumber
    }
    delete userTemp.repeatPassword

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userTemp)
    }

    // Introduce un retraso de 5 segundos antes de procesar la respuesta
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(url, params);
                if (response.status === 200) {
                    const result = await response.json();
                    resolve(result);
                } else {
                    resolve({ code: 404, message: 'Esta cuenta ya tiene dueño' });
                }
            } catch (err) {
                reject(err);
            }
        }, 2000); 
    });
}

export async function signInApi(user) { 
    const url = `${API_HOST}/login/`
    const userTemp = {
        email: user.email.toLowerCase(),
        password: user.password
    }

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userTemp)
    }
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(url, params);
                
                if (response.status === 200) {
                    const result = await response.json();
                    resolve(result);
                } else {
                    resolve({ code: 404, message: 'Error de credenciales'});
                }
            } catch (err) {
                reject(err);
            }
        }, 2000);
    });
}

export function setTokenApi(token) {
    localStorage.setItem(TOKEN, token)
}

export function getTokenApi(){
  return localStorage.getItem(TOKEN)
}

export function logoutApi(){
    localStorage.removeItem(TOKEN)
}

export function isUserLogedApi(){
    const token = getTokenApi()

    if (!token) {
        logoutApi()
        return null
    }
    if (isExpired(token)) {
        logoutApi()
    }
   return jwtDecode(token)
}

function isExpired(token){
    const {exp} = jwtDecode(token)
    const expire = exp * 1000
    const timeout = expire - Date.now()
    if (timeout < 0) {
        return true
    }
    return false
}
import  {API_HOST} from '../utils/constants'
import {getTokenApi} from './auth'


export function getUserApi(username) {
    const url = `${API_HOST}/profile/${username}`

    const params = {
        headers:{
            Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return fetch(url, params).then(response =>{
        if(response.status >=400) throw null
        return response.json()
    }).then(result =>{
        return result
    }).catch(err =>{
        return err
    })
}
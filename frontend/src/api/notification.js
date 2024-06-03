import  {API_HOST} from '../utils/constants'
import {getTokenApi} from './auth'


export function getNotfis() {
    const url = `${API_HOST}/profile/mynotifs`

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

export async function readNoti(){
    const url = `${API_HOST}/profile/readnotif`
    const params = {
      method: 'PUT',
      headers:{
          Authorization:`Bearer ${getTokenApi()}`
      },
  }

  return fetch(url, params).then(res =>{
      return res.json()
  }).then(result =>{
      return result 
    }).catch(err =>{
      return err
  })
}
import { API_HOST } from "../utils/constants";
import { getTokenApi } from "./auth";



export async function checkFollowApi (username) {
    const url = `${API_HOST}/profile/${username}`

    const params = {
        headers:{
            Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return fetch(url, params).then(res =>{
        return res.json()
    }).then(result =>{
        return result
    })
    .catch(err=>{
        return err
    })
}

export async function followUserApi(username){
    const url = `${API_HOST}/profile/follow/${username}`
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

export async function getFollowApi(paramsUrl){
    const url = `${API_HOST}/profile/search?${paramsUrl}`
    const params = {
      headers:{
          Authorization:`Bearer ${getTokenApi()}`
      },
  }
  return await fetch(url, params).then(res =>{
    return res.json()
  }).then(result =>{
    return result
  }).catch(err =>{
    return err
  })
}
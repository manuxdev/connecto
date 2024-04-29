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


export async function uploadBannerApi(file){
      const url = `${API_HOST}/profile/editprofile/upPortada`
      const formData = new FormData()
      formData.append('portada', file)
      console.log(formData)
      const params = {
        method: 'PUT',
        headers:{
            Authorization:`Bearer ${getTokenApi()}`
        },
        body: formData
    }

    return await fetch(url, params).then(res =>{
        return res.json()
    }).then(result =>{
        return result 
    }).catch(err =>{
        return err
    })
}

export async function uploadAvatarApi(file){
    const url = `${API_HOST}/profile/editprofile/upAvatar`
    const formData = new FormData()
    formData.append('avatar', file)
    console.log(formData)
    const params = {
      method: 'PUT',
      headers:{
          Authorization:`Bearer ${getTokenApi()}`
      },
      body: formData
  }

  return await fetch(url, params).then(res =>{
      return res.json()
  }).then(result =>{
      return result 
  }).catch(err =>{
      return err
  })
}

export async function editProfileApi (data){
    const url = `${API_HOST}/profile/editprofile`
    const formData = {
        first_name: data.nombre,
        last_name: data.apellidos,
        description : data.biografia,
    }
    const params = {
        method: 'PUT',
        headers:{
            Authorization:`Bearer ${getTokenApi()}`,
            'Content-type':'application/json'
        },
        body: JSON.stringify(formData)
    }

    return await fetch(url, params).then(res =>{
        return res
    }).catch(err =>{
        return err
    })
}
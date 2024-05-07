import { API_HOST} from '../utils/constants'
import { getTokenApi } from './auth'
export async function createTweetApi(message) {
    const url = `${API_HOST}/tweets/create`
    const tweetMessage = {
        tweetText : message
    }
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization:`Bearer ${getTokenApi()}`
        },
        body: JSON.stringify(tweetMessage)
    }

    // Introduce un retraso de 5 segundos antes de procesar la respuesta
    return await fetch(url, params).then(res =>{
        if (res.status >= 200 && res.status < 300) {
          return {code:res.status, message:'Tweet Enviado'}
        }     
        return {code: 500, message:'Error del servidor'}
    }).catch(err=>{
        return err
    })
}


export async function getUserTweetAPi (username, page){
    const url = `${API_HOST}/profile/usertweets?username=${username}&page=${page}`
    const params = {
        headers:{
                Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return await fetch(url, params).then(res=>{
        return res.json()
    }).catch(err =>{
        return err
    })
}


export async function getFeedApi (page = 0) {
    const url = `${API_HOST}/tweets/feed?page=${page}`
    const params = {
        headers:{
            'Content-Type': 'application/json',
                Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return await fetch(url, params).then(res=>{
        return res.json()
    }).catch(err =>{
        return err
    })
}

export async function likeTweetApi(tweetId){
    const url = `${API_HOST}/tweets/like`
    const params = {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
          Authorization:`Bearer ${getTokenApi()}`
      },
      body: JSON.stringify({ tweetId: tweetId })
  }

  return fetch(url, params).then(res =>{
      return res.json()
  }).then(result =>{
      return result 
    }).catch(err =>{
      return err
  })
}


export async function bookmarkedTweetApi(tweetId){
    const url = `${API_HOST}/tweets/bookmark`
    const params = {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
          Authorization:`Bearer ${getTokenApi()}`
      },
      body: JSON.stringify({ tweetId: tweetId })
  }

  return fetch(url, params).then(res =>{
      return res.json()
  }).then(result =>{
      return result 
    }).catch(err =>{
      return err
  })
}


export async function getMySavedTweetAPi (){
    const url = `${API_HOST}/tweets/bookmark`
    const params = {
        headers:{
                Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return await fetch(url, params).then(res=>{
        return res.json()
    }).catch(err =>{
        return err
    })
}
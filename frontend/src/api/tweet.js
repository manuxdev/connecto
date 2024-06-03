import { API_HOST} from '../utils/constants'
import { getTokenApi } from './auth'
export async function createTweetApi(message) {
    const url = `${API_HOST}/tweets/create`;
    const tweetMessage = {
        tweetText: message
    };
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        },
        body: JSON.stringify(tweetMessage)
    };

    try {
        const response = await fetch(url, params);
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return { code: 500, message: 'Error del servidor' };
    }
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

export async function uploadFileApi(files, tweetId){
    const url = `${API_HOST}/tweets/upFile?tweetId=${tweetId}`
    const formData = new FormData()
    files.forEach((file) => {
        formData.append(`image`, file);
    });

    const params = {
      method: 'POST',
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

export async function getTweetApi (tweetId) {
    const url = `${API_HOST}/tweets/tweet/${tweetId}`
    const params = {
        headers:{
            'Content-Type': 'application/json',
                Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return await fetch(url, params).then(res => {
        return res.json()
    }).catch(err =>{
        return err
    })
}
export async function deleteTweetApi (tweetId) {
    const url = `${API_HOST}/tweets/delete/${tweetId}`
    const params = {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json',
                Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return await fetch(url, params).then(res => {
        return res.json()
    }).catch(err =>{
        return err
    })
}

export async function getTrendingApi () {
    const url = `${API_HOST}/tweets/trending`
    const params = {
        headers:{
            'Content-Type': 'application/json',
                Authorization:`Bearer ${getTokenApi()}`
        }
    }
    return await fetch(url, params).then(res => {
        return res.json()
    }).catch(err =>{
        return err
    })
}
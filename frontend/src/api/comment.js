import { API_HOST} from '../utils/constants'
import { getTokenApi } from './auth'

export async function getCommentTweetAPi (tweetId){
    const url = `${API_HOST}/tweets/comment/${tweetId}`
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

export async function createCommentApi(text, tweetId) {
    const url = `${API_HOST}/tweets/comment`;
    const commentMessage = {
        tweetId:tweetId,
        text: text
    };
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        },
        body: JSON.stringify(commentMessage)
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

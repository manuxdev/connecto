import React, { useEffect, useState } from 'react'
import { checkFollowApi, followUserApi } from "../../api/follow";

const PopularFollow = ({ username, setChangeState, changeState }) => {
    const [follow, setFollow] = useState(null);
    const [reloadFollow, setReloadFollow] = useState(false);

    useEffect(() => {
        checkFollowApi(username).then(res => {
            if (res?.data.isFollowing) {
                setFollow(true)
            } else {
                setFollow(false)
            }
        })
    }, [reloadFollow])


    const onFollow = () => {
        followUserApi(username).then(() => {
            setChangeState(!changeState)
        })
    }

    return (
        <>
            {follow !== null && (
                (!follow ? (<button
                    className=" rounded-md px-1 bg-blue-600  font-medium text-white hover:text-zinc-300 hover:bg-blue-700 text-base"
                    onClick={onFollow}
                >
                    Seguir
                </button>) : (
                    <button
                        className=" rounded-md  px-4 py-2 bg-red-600  font-medium text-white hover:text-zinc-300 hover:bg-red-700 text-base"
                        onClick={onFollow}
                    >
                        Siguiendo
                    </button>))
            )}
        </>
    )
}

export default PopularFollow
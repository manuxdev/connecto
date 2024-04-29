import React from 'react'
import ContentLoader from "react-content-loader"
const UserLoading = (props) => {
    return (

        <div className='h-14'>
            <ContentLoader
                speed={2}

                backgroundColor="#666060"
                foregroundColor="#c4c0c0"
                {...props}
            >
                <rect x="48" y="14" rx="3" ry="3" width="160" height="7" />
                <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
                <circle cx="20" cy="20" r="20" />
            </ContentLoader>
        </div>
    )
}

export default UserLoading
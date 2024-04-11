import React from 'react'
import BassicLayout from '../../layout/BassicLayout'

const Home = ({ setRefreshCheckLogin }) => {
    return (

        <BassicLayout className='Home' setRefreshCheckLogin={setRefreshCheckLogin} >
            <h2>Hola desde Home</h2>

        </BassicLayout >

    )
}

export default Home
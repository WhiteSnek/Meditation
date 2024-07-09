import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Card = ({ favourite }) => {
    return (
        <div className='border-2 border-gray-100 rounded-md py-4 grid justify-center text-white bg-stone-900'>
            <img src={favourite.displayImage} alt='display image' className='h-56 aspect-square object-cover rounded-md border border-white' />
            <h3 className='text-lg font-bold py-4 text-center'>{favourite.title}</h3>
            <div className='flex gap-2 mx-auto'>
                <span className='py-2 px-4 bg-white text-stone-900 rounded-full'>{favourite.category}</span>
                <span className='py-2 px-4 bg-white text-stone-900 rounded-full'>{favourite.ageGroup}</span>
            </div>
        </div>
    )
}

const Favourites = () => {
  const [favourites,setFavourites] = useState([])
  useEffect(()=>{
    const getFavourites = async() => {
      try {
        const response = await axios.get('/users/favourites',{withCredentials:true})
        setFavourites(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getFavourites()
  },[])
  return (
    <div className='m-4 border border-white rounded-lg bg-zinc-800 text-white h-[94vh] overflow-scroll'>
      <h1 className='text-3xl font-bold text-center my-4'>Favourites</h1>
    <div className='grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 '>
      {favourites.map((favourite, idx) => (
                    <Card key={idx} favourite={favourite}  />
                ))}
    </div>
    </div>
  )
}

export default Favourites

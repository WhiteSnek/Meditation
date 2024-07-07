import React, {useContext, useState} from 'react'
import { Link } from 'react-router-dom'
import { CiHeart } from "react-icons/ci";
import UserContext from '../context/UserContext'
import { IconContext } from "react-icons/lib";
// import Dropdown from './Dropdown'

const Header = () => {
    const { user } = useContext(UserContext);
    const [dropDown, setDropDown] = useState(false)
    
  return (
    <header className="shadow sticky z-50 top-0 ">
            <nav className="bg-zinc-800 text-white  py-5">
                <div className="flex flex-wrap justify-between items-center mx-4 max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <h1 className='text-lg font-bold'>Meditator</h1>
                    </Link>
                    <div className="absolute right-4">
                        {!user && (
                                <Link
                                    to="/login"
                                    className="bg-gray-800 hover:bg-gray-100 hover:shadow text-white py-2 px-4 rounded hover:text-gray-500 transition delay-50"
                                >
                                    Log in
                                </Link>
                        )}
                        {user && (
                            <div className='flex gap-10 justify-center items-center'>
                                <Link to='/favourites' className='p-2 hover:bg-stone-900 rounded-full'><IconContext.Provider value={{  size: "27px" }}><CiHeart /></IconContext.Provider>
                                </Link>
                                <button onClick={() => setDropDown(!dropDown)}><img src={user.avatar} alt='avatar' className='h-10 w-10 rounded-full object-cover'/></button>
                            </div>
                            
                        )}
                    </div>
                </div>
            </nav>
            {/* {dropDown && <Dropdown setDropDown/>} */}
        </header>
  )
}

export default Header

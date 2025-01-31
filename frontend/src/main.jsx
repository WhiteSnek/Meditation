import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Home,Login,Register,Favourites} from './pages'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import UserContextProvider from './context/UserContextProvider.jsx'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_SERVER;
const Layout = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<App/>}>
        <Route path='' element={<Home/>} />
        <Route path='login' element={<Login/>} />
        <Route path='register' element={<Register/>} />
        <Route path='favourites' element={<Favourites/>} />
      </Route>
    )
  )
  return (
    <UserContextProvider> 
      <RouterProvider router={router} />
    </UserContextProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,
)

import React, { useContext, useState } from "react";
import AddManual from "./AddManual";
import GenerateWithAI from "./GenerateWithAI";
import UserContext from '../context/UserContext'
import axios from "axios";

const AddMeditation = () => {
  const { user,setUser } = useContext(UserContext);
  const [manual, setManual] = useState(false);
  const [ai, setAi] = useState(false);

  const logout = async () => {
    try {
      const response = await axios.post('/users/logout',{},{withCredentials:true})
      console.log(response)
      setUser(null)
      localStorage.removeItem('user');
    } catch (error) {
      console.log(error)
    }
  }

  if(!user) return (
    <div className="p-4 flex justify-center items-center text-white col-span-3 w-full bg-zinc-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
      <h1 className="text-xl font-bold">Please login to add a meditation</h1>
    </div>
  )
  return (
    <div className="p-4 text-white col-span-3 w-full h-[85vh] bg-zinc-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
      <h1 className="text-xl font-bold border-b-2 py-4 border-white">
        Add a meditation song
      </h1>
      {!manual && !ai && <div className="flex flex-col justify-between h-5/6">
        <div className="grid gap-4 py-4 items-center">
        <button onClick={()=>setManual(true)} className="px-4 py-2 bg-zinc-900 rounded-md font-semibold">
          Add song manually
        </button>
        <button onClick={()=>setAi(true)} className="px-4 py-2 bg-zinc-900 rounded-md font-semibold">
          Create with AI
        </button>
        </div>
        <button onClick={logout} className="px-4 py-2 bg-zinc-900 rounded-md font-semibold">Logout</button>
      </div>}
      {manual && <AddManual />}
      {ai && <GenerateWithAI />}
    </div>
  );
};

export default AddMeditation;

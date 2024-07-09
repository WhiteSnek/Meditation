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
      setUser(null)
      localStorage.removeItem('user');
    } catch (error) {
      console.log(error)
    }
  }

  if(!user) return (
      <h1 className="text-xl font-bold">Please login to add a meditation</h1>
  )
  return (
    <div>
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

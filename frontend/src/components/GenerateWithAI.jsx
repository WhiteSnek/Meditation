import React, { useState } from "react";
import { GrValidate } from "react-icons/gr";
import { IconContext } from "react-icons/lib";
import axios from "axios";
import AddDetails from "./AddDetails";

const GenerateWithAI = () => {
  const [prompt, setPrompt] = useState("");
  const [loading,setLoading] = useState(false)
  const [next,setNext] = useState(false)
  const [details, setDetails] = useState({
    title: "",
    category: "",
    ageGroup: "",
    displayImage: null,
    displayImageUrl: "",
  });

  

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  const generateMusicText = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post(
        "/generate/text",
        {prompt}
      );
      const text = response.data.data[0].content.parts[0].text
      const voice = await axios.post('/generate/voice',{text})
      setNext(true)
    } catch (error) {
      console.error("Error generating music text:", error);
    }
    finally {
      setLoading(false)
    }
  };
  
  if(next){
    return (
      <AddDetails details={details} setDetails={setDetails} />
    )
  }

  return (
    <div className="max-w-lg mx-auto p-4 m-4 bg-zinc-900 text-white shadow-md rounded-md">
      <form className="grid gap-4" onSubmit={generateMusicText}>
        <label htmlFor="prompt">Write a prompt to generate music:</label>
        <textarea
          id="prompt"
          className="bg-zinc-800 p-2 text-white"
          rows={8}
          value={prompt}
          onChange={handlePromptChange}
        />
        <button
          type="submit"
          className="w-full bg-gray-100 text-zinc-800 font-bold py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
};

export default GenerateWithAI;

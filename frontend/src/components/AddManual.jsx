import React, { useState } from "react";
import { GrValidate } from "react-icons/gr";
import { IconContext } from "react-icons/lib";
import axios from "axios";

const AddManual = () => {
  const [added, setAdded] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    category: "",
    ageGroup: "",
    audio: null,
    audioUrl: "",
    displayImage: null,
    displayImageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setDetails({
      ...details,
      [name]: file,
      [`${name}Url`]: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    const formData = new FormData();
    formData.append("title", details.title);
    formData.append("category", details.category);
    formData.append("ageGroup", details.ageGroup);
    formData.append("audio", details.audio);
    formData.append("displayImage", details.displayImage);
    try {
      const response = await axios.post("/meditation/add", formData, {
        withCredentials: true,
      });
      console.log(response);
      setAdded(true);
      setDetails({
        title: "",
        category: "",
        ageGroup: "",
        audio: null,
        audioUrl: "",
        displayImage: null,
        displayImageUrl: "",
      });
    } catch (error) {
      console.log(error);
    }
    console.log(details);
  };

  if (added)
    return (
      <div className="flex flex-col gap-4 p-12 justify-center items-center">
        <IconContext.Provider value={{ size: "27px" }}>
          <GrValidate />
        </IconContext.Provider>

        <p>Song added successfully!</p>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-4 m-4 bg-zinc-900 text-white shadow-md rounded-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-bold mb-2">Title:</label>
          <input
            type="text"
            name="title"
            value={details.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-zinc-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-bold mb-2 ">Category:</label>
          <select
            name="category"
            value={details.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-zinc-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Spiritual">Spiritual</option>
            <option value="Relaxation">Relaxation</option>
            <option value="Chakra Balancing">Chakra Balancing</option>
            <option value="Healing">Healing</option>
            <option value="Mantra">Mantra</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-2">Age group:</label>
          <select
            name="ageGroup"
            value={details.ageGroup}
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-zinc-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Adult">Adult</option>
            <option value="Child">Child</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-2">Audio:</label>
          <input
            type="file"
            name="audio"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border bg-zinc-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {details.audio && (
            <audio controls src={details.audioUrl} className="mt-2" />
          )}
        </div>
        <div>
          <label className="block font-bold mb-2">Display image:</label>
          <input
            type="file"
            name="displayImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border bg-zinc-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {details.displayImage && (
            <img
              src={details.displayImageUrl}
              alt="Display"
              className="mt-2 h-32 w-32 object-cover"
            />
          )}
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-gray-100 text-zinc-800 font-bold py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddManual;

import React, { useState } from "react";
import AddMeditation from "../components/AddMeditation";
import Meditations from "../components/Meditations";

const Home = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleShowOverlay = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div className="grid relative grid-cols-12 m-5 gap-4">
      <div className="col-span-12 sm:col-span-9">
        <Meditations />
      </div>
      <div className="sm:block hidden sm:col-span-3 p-4 text-white w-full h-[85vh] bg-zinc-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        <AddMeditation />
      </div>
      <div className="sm:hidden absolute top-0 right-0 col-span-12 flex justify-end">
        <button
          className="bg-gray-100 text-zinc-800 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring focus:border-gray-300"
          onClick={handleShowOverlay}
        >
          Add Meditation
        </button>
      </div>
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-zinc-700 text-white p-4 rounded-md w-11/12 max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={handleCloseOverlay}
            >
              &times;
            </button>
            <AddMeditation />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

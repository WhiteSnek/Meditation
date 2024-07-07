import React from "react";
import AddMeditation from "../components/AddMeditation";
import Meditations from "../components/Meditations";
import MusicBar from "../components/MusicBar";

const Home = () => {
  return (
    <div className="grid grid-cols-12 h-[84vh] m-5 gap-4">
      <div className="col-span-9">
          <Meditations />
      </div>
      <AddMeditation />
    </div>
  );
};

export default Home;

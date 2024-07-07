import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForwardSharp } from "react-icons/io5";
import { IconContext } from "react-icons/lib";
import { CiHeart } from "react-icons/ci";
import axios from "axios";
const MusicBar = ({
  current,
  isPlaying,
  setIsPlaying,
  handlePrev,
  handleNext,
}) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  useEffect(() => {
    if (current && audioRef.current) {
      const audio = audioRef.current;
      audio.src = current.audioUrl; // Ensure audioUrl is the correct property
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Error playing audio:", error));
    }
  }, [current]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progress = (currentTime / duration) * 1000;
      setProgress(progress);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (e.target.value / 1000) * audio.duration;
      audio.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  const addToFavourites = async () => {
    const id = current?._id
    try {
        const response = await axios.post(`/users/favourites`, {id},{withCredentials: true});
        console.log(response)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="border border-gray-100 rounded-md mt-4 text-white p-4">
      <input
        type="range"
        name="range"
        className="w-full"
        id="myProgressBar"
        min="0"
        value={progress}
        max="1000"
        onChange={handleSeek}
      />

      <div className="grid grid-cols-3 items-center">
        <span className="text-lg font-bold text-center">
          {current ? current.title : "Select a meditation"}
        </span>
        <div className="flex gap-6 justify-center items-center py-4">
          <button
            className="p-2 hover:bg-stone-600 rounded-full"
            onClick={handlePrev}
          >
            <IoPlaySkipBack />
          </button>
          <button
            className="p-2 hover:bg-stone-600 rounded-full"
            onClick={handlePlayPause}
            disabled={!current}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            className="p-2 hover:bg-stone-600 rounded-full"
            onClick={handleNext}
          >
            <IoPlaySkipForwardSharp />
          </button>
        </div>
        <div className="flex justify-end">
        <button onClick={addToFavourites} className="p-2 hover:bg-stone-700 rounded-full"><IconContext.Provider value={{  size: "27px" }}><CiHeart /></IconContext.Provider></button>
        </div>
        
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicBar;

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaPlay, FaPause } from "react-icons/fa";
import MusicBar from './MusicBar';

const Card = ({ meditation, setCurrent, current, setIsPlaying, isPlaying }) => {
  const handlePlay = () => {
    setCurrent(meditation);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setCurrent(null);
  };

  return (
    <div className='border-2 border-gray-100 rounded-md py-4 grid justify-center text-white bg-stone-900'>
        <img src={meditation.displayImage} alt='display image' className='h-56 aspect-square object-cover rounded-md border border-white' />
        <h3 className='text-lg font-bold py-4 text-center'>{meditation.title}</h3>
        <div className='flex gap-2 mx-auto'>
            <span className='py-2 px-4 bg-white text-stone-900 rounded-full'>{meditation.category}</span>
            <span className='py-2 px-4 bg-white text-stone-900 rounded-full'>{meditation.ageGroup}</span>
        </div>
        <div className='flex gap-6 justify-center items-center mt-4 py-2 border-t-2 border-white'>
            {meditation === current && isPlaying ?
                <button className='p-2 hover:bg-stone-600 rounded-full' onClick={handlePause}><FaPause /></button> :
                <button className='p-2 hover:bg-stone-600 rounded-full' onClick={handlePlay}><FaPlay /></button>}
        </div>
    </div>
)
};

const Meditations = () => {
  const [meditations, setMeditations] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const getMeditations = async () => {
      try {
        const response = await axios.get('/meditation/');
        setMeditations(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMeditations();
  }, []);


  const handleNext = () => {
    if (meditations?.length > 0 && current) {
      const currentIndex = meditations?.indexOf(current);
      const nextIndex = (currentIndex + 1) % meditations?.length;
      setCurrent(meditations[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (meditations?.length > 0 && current) {
      const currentIndex = meditations?.indexOf(current);
      const prevIndex = (currentIndex - 1 + meditations?.length) % meditations?.length;
      setCurrent(meditations[prevIndex]);
    }
  };

  return (
    <div>
      <div className="grid h-[65vh] overflow-scroll border border-white rounded-lg bg-zinc-800 sm:grid-cols-4 grid-cols-1 gap-4 p-4">
        {meditations?.map((meditation, idx) => (
          <Card
            key={idx}
            meditation={meditation}
            setCurrent={setCurrent}
            current={current}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        ))}
      </div>
      <MusicBar
        current={current}
        setCurrent={setCurrent}
        handlePrev={handlePrev}
        handleNext={handleNext}
        meditations={meditations}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
};

export default Meditations;

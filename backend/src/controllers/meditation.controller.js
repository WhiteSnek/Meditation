import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Meditation } from "../models/meditation.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const addMeditation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { title, category, ageGroup } = req.body;


  if ([title, category, ageGroup].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }


  const existed = await Meditation.findOne({ title });
  if (existed) {
    throw new ApiError(409, "Meditation with this title already exists");
  }


  const audioLocalPath = req.files?.audio[0].path;
  if (!audioLocalPath) {
    throw new ApiError(400, "Audio path is required");
  }
  const audioUrl = await uploadOnCloudinary(audioLocalPath);
  if (!audioUrl) {
    throw new ApiError(400, "Audio uploading failed");
  }

  const imgLocalPath = req.files?.displayImage[0].path;
  if (!imgLocalPath) {
    throw new ApiError(400, "Image path is required");
  }
  const imgUrl = await uploadOnCloudinary(imgLocalPath);
  if (!imgUrl) {
    throw new ApiError(400, "Image uploading failed");
  }

  const newMeditation = await Meditation.create({
    title,
    category,
    ageGroup,
    audioUrl: audioUrl.url,
    displayImage: imgUrl.url,
    createdBy: new mongoose.Types.ObjectId(userId), 
  });

  if (!newMeditation) {
    throw new ApiError(400, "Meditation creation failed");
  }

  res.status(200).json(new ApiResponse(200, newMeditation, "Meditation song added successfully"));
});



const getMeditation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const meditation = await Meditation.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
  ]);
  if (!meditation) throw new ApiError(404, "Meditation not found");
  res.status(200).json(new ApiResponse(200, meditation, "Meditation found"));
});

const getAllMeditation = asyncHandler(async (req, res) => {
    const {query} = req.query
    const filter = {}
    if(query) {
      filter.$or = [
        { title: {$regex: query, $options: 'i'}},
        { category: {$regex: query, $options: 'i'}}
      ]
    }
    const meditation = await Meditation.find(filter)
    if(!meditation) throw new ApiError(400,"Error finding meditation song")
      res.status(200).json(new ApiResponse(200, meditation, "Meditation found"));
  });
  

const addMeditationGeneratedByAi = asyncHandler(async(req,res)=>{
  const userId = req.user._id;
  const { title, category, ageGroup } = req.body;


  if ([title, category, ageGroup].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }


  const existed = await Meditation.findOne({ title });
  if (existed) {
    throw new ApiError(409, "Meditation with this title already exists");
  }


  const audioLocalPath = './public/temp/Voice.mp3';
  const audioUrl = await uploadOnCloudinary(audioLocalPath);
  if (!audioUrl) {
    throw new ApiError(400, "Audio uploading failed");
  }

  const imgLocalPath = req.file?.path;
  if (!imgLocalPath) {
    throw new ApiError(400, "Image path is required");
  }
  const imgUrl = await uploadOnCloudinary(imgLocalPath);
  if (!imgUrl) {
    throw new ApiError(400, "Image uploading failed");
  }

  const newMeditation = await Meditation.create({
    title,
    category,
    ageGroup,
    audioUrl: audioUrl.url,
    displayImage: imgUrl.url,
    createdBy: new mongoose.Types.ObjectId(userId), 
  });

  if (!newMeditation) {
    throw new ApiError(400, "Meditation creation failed");
  }

  res.status(200).json(new ApiResponse(200, newMeditation, "Meditation song added successfully"));
})

export { addMeditation, getMeditation,getAllMeditation,addMeditationGeneratedByAi };

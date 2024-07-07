import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Meditation } from "../models/meditation.model.js";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {

  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }


  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser)
    throw new ApiError(409, "User with email or username exists");


  const avatarLocalPath = req.file?.path;


  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");


  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar file is required on cloudinary");


  const user = await User.create({
    fullname,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
  });


  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );


  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }


  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body se data le aao
  const { email, username, password } = req.body;

  // username or email
  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required");
  }

  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  // password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid User credentials");

  // access and refresh token generate
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // send cookies
  const loggendInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggendInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const addToFavourites = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const addMeditation = await User.findByIdAndUpdate(req.user._id, {
    $push: {
      favourites: new mongoose.Types.ObjectId(id),
    },
  });
  if (!addMeditation) throw new ApiError(400, "Error adding to favourites");
  return res.json(
    new ApiResponse(200, addMeditation, "Meditation added to favourites")
  );
});

const getFavourites = asyncHandler(async (req, res) => {
  const favouriteSong = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "meditations",
        localField: "favourites",
        foreignField: "_id",
        as: "favourites",
      },
    },
  ]);
  if (favouriteSong.length === 0) {
    throw new ApiError(404, "Favourites not found");
  }

  const favouriteSongs = favouriteSong[0].favourites;

  const favourites = await Meditation.find({ _id: { $in: favouriteSongs } });

  if (!favourites) throw new ApiError(400, "Error getting favourites");
  return res
    .status(200)
    .json(new ApiResponse(200, favourites, "Favourites retrieved"));
});

export { registerUser, loginUser, logoutUser, addToFavourites, getFavourites };

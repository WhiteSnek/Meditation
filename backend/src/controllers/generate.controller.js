import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import gTTS from "gtts";

const geminiConfig = {
  temperature: 0.4, 
  topP: 1, 
  topK: 32, 
  maxOutputTokens: 4096, 
};

const API_KEY = process.env.GEMINI_API_KEY;

const generateText = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    throw new ApiError(400, "Prompt is required");
  }

  try {
    const googleAI = new GoogleGenerativeAI(API_KEY);
    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-pro",
      geminiConfig,
    });

    const result = await geminiModel.generateContent(prompt);
    const response = result.response.candidates;
    res
      .status(200)
      .json(new ApiResponse(200, response, "Generated text successfully"));
  } catch (error) {
    console.error("Error generating text:", error);
  }
});

const generateVoice = asyncHandler(async (req, res) => {
    const { text } = req.body;
  
    const unwantedWords = /\[[^\]]*\]|\*[^\*]*\*/g;
    const cleanText = text.replace(unwantedWords, "");
  

    const gtts = new gTTS(cleanText, "en");
  

    const filePath = "./public/temp/Voice.mp3";
    gtts.save(filePath, function (err, result) {
      if (err) {
        console.error("Error generating voice:", err);
        return res.status(500).json(new ApiResponse(500, {}, "Error generating voice"));
      }
  

      const audioUrl = `${req.protocol}://${req.get("host")}/temp/Voice.mp3`;
  

      res.status(200).json(new ApiResponse(200, { audioUrl }, "Voice generated successfully"));
    });
  });

export { generateText, generateVoice };

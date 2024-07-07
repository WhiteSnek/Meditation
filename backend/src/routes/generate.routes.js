import { Router } from "express";
import { generateText,generateVoice } from "../controllers/generate.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/text').post(generateText)
router.route('/voice').post(generateVoice)

export default router
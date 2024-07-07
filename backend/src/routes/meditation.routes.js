import { Router } from "express";
import { getMeditation,addMeditation,getAllMeditation,addMeditationGeneratedByAi } from "../controllers/meditation.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route('/add').post(verifyJWT,upload.fields([
    {
      name: "audio",
      maxCount: 1,
    },
    {
      name: "displayImage",
      maxCount: 1,
    },
  ]),addMeditation)

router.route('/:id').get(getMeditation)
router.route('/').get(getAllMeditation)
router.route('/add-ai').post(verifyJWT,upload.single("displayImage"),addMeditationGeneratedByAi)

export default router
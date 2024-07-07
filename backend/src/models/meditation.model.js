import mongoose, { Schema} from "mongoose";

const meditationSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    ageGroup: {
        type: String,
    },
    displayImage: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},{
    timestamps: true,
})


export const Meditation = mongoose.model("Meditation",meditationSchema)
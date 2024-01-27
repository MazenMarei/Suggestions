
import mongoose from "mongoose";
import config from "../config.js";
const suggestionModel = new mongoose.Schema({
    guildId: {
      required: true,
      type: String,
    },
    suggestion: {
       type: String,
       required : true
    },
    status: {
        type: String,
        default: "pending"
    },
    suggestionId: {
        type: String,
        required : false
    },
    authorId: {
        type: String,
        required : true
    },
    adminId : {
        type : String,
    },
    embedID : {
        type : String,
    },

}, { timestamps: { createdAt: 'Created at' }});



export default  mongoose.model('suggest', suggestionModel);
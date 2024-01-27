
import mongoose from "mongoose";
import config from "../config.js";
const guildConfig = new mongoose.Schema({
    guildId: {
      required: true,
      type: String,
    },
    prefix: {
       type: String,
       default: config.prefix
    },   
}, { timestamps: { createdAt: 'Created at' }});



export default  mongoose.model('guildTsConfig', guildConfig);
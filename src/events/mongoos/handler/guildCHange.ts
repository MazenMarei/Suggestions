import mongoos from "mongoose";
import {ChangeStreamDocument , ChangeStreamInsertDocument , ChangeStreamUpdateDocument } from "mongodb";
import { client } from "../../../index.js";
import {BaseGuildTextChannel ,EmbedBuilder} from "discord.js"
import guild from "../../../models/guild.js";

 


export default {
    name : "change",
    description : "",
    model : guild,
    once: false,
    function : async function (data :ChangeStreamUpdateDocument< any>  ) {
        // console.log(data.operationType);
        
     //// insert | update 
    if(!["insert", "update"].includes(data.operationType)) return 
        // console.log(data);
        
    }
}
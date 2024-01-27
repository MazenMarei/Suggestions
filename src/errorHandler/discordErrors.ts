import colors from "colors";
import config from "../config.js";
import { client } from "../index.js";
import { log } from "../utils/logging.js";
import mongoose from "mongoose";


client.on("debug", (info) => { 
    if(info.includes("Session Limit Information") && info.includes("Remaining: 0")) {
        log(colors.red("Session limit reached, please wait a bit before reconnecting"));
        client.destroy().then(() => {
            client.login(config.token);
        });
        return
    }
    if(
    info.includes("Fetched Gateway Information") || 
    info.includes("Waiting for event hello for") ||
    info.includes("Preparing first heartbeat of the connection with a jitter") ||
    info.includes("Shard connected") ||
    info.includes("Connecting to wss://gateway.discord.gg?v=10&encoding=json") ||
    info.includes("Waiting for identify throttle") ||
    info.includes("First heartbeat sent,") ||
    info.includes("Sending a heartbeat") ||
    info.includes("Heartbeat acknowledged, latency of") ||
    info.includes("Shard received all its guilds")
    ) return
    if(info.includes("Session Limit Information")) return log(colors.red(info.split("\n").join(" ")));
    if(info.includes("Destroying shard")) return log(colors.red(info.split("\n").join(" ")));
    if(info.includes("Connection status during destroy")) return log(colors.red(info.split("\n").join(" ")));
    if(info.includes("Failed to connect to the gateway URL")) return log(colors.red(info.split("\n").join(" ")));
    if(info.includes("The gateway closed")) return log(colors.red(info.split("\n").join(" ")));

    if(info.includes("Waiting for event ready for")) return log(colors.red(info));
    if(info.includes("Identifying")) return log(colors.blue(info.split("\n").join(" ")));
    console.log('\n\n\n\n\n=== Discord debug ==='.toUpperCase());
    console.log(info);
    console.log('\n\n\n\n\n=== Discord debug ==='.toUpperCase());
})
client.on("warn", (info) => {
    console.log('\n\n\n\n\n=== Discord warn ==='.toUpperCase()); 
    console.log(info);
    console.log('\n\n\n\n\n=== Discord warn ==='.toUpperCase()); 
})
client.on("error", (info) => {
    console.log('\n\n\n\n\n=== Discord error ==='.toUpperCase()); 
    console.log(info);
    console.log('\n\n\n\n\n=== Discord error ==='.toUpperCase());
 })

 client.on("shardError", (error, shardID) => {
    console.log('\n\n\n\n\n=== Discord shardError ==='.toUpperCase()); 
    console.log(error);
    console.log('\n\n\n\n\n=== Discord shardError ==='.toUpperCase());
 })
client.on("shardDisconnect", (event, shardID) => {
    console.log('\n\n\n\n\n=== Discord shardDisconnect ==='.toUpperCase()); 
    console.log(event);
    console.log('\n\n\n\n\n=== Discord shardDisconnect ==='.toUpperCase());
})

client.on("rateLimit", (rateLimitInfo) => {
    console.log('\n\n\n\n\n=== Discord rate limit ==='.toUpperCase());
    console.log(`Rate limit hit on ${rateLimitInfo.route}`);
    console.log(`Time until reset: ${rateLimitInfo.timeout}ms`);
    console.log(`Request limit: ${rateLimitInfo.limit}`);
    console.log(`Method: ${rateLimitInfo.method}`);
    console.log('\n\n\n\n\n=== Discord rate limit ==='.toUpperCase());
});
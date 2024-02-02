# Suggestion-Bot
## Bot futters :
1) send a suggestions 
2) approve / deny it by admins 
3) send to specific channels

       
- Bot commands :
    1. suggest : send suggestions requst to admins
    2. suggestion accept : To accept user's suggestions
    3. suggestion deny : To deny user's suggestions
    4. suggestion implement : To send user's suggestions to suggestions' channel after accepting it 
 
       
## How to setup the bot.
- install npm packages  :
  -  You have to install NodeJs first
  -  open terminal in bot dir. and wirght `npm i`
- setup config.ts in src/config.ts :
  - token : you have to put your discord bot token
  - prefix : wright your bot prefix
  - Mongoose : your mongoos data url
  - debugMode : leave it true as defulte
  - suggesttChannel : suggestion's channel id to implement suggestion in it
  - adminChannel : admin's channel id to send suggestion requst in it
 
  ##  - Run the bot :
   - open terminal in bot dir. and wirght `npm run start `

# CommanderBot
## What does it do?
CommanderBot is an updated and improved version of [PhoenixAPI-Bot](https://github.com/Alex22sv/PhoenixAPI-Bot) which has the same commanods but the difference between both bots is that CommanderBot no longer uses message commands but slash commands.
## Features
- Get information about your exaroton account.
- List all servers in your exaroton account.
- Create an embed to automatically display the current status of your server.
- Start, stop & restart your own servers.
- Start servers that you have shared access to with your own credits.
- Get your server log or upload it to https://mclo.gs/.
- Update your server settings, like RAM, banned players & ips, whitelisted players, etc.
- Execute Minecraft commands.
- Get your server Dynamic IP (DynIP).
## Slash commands?
Yes. CommanderBot will only reply through slash commands, e.g. `/help`.
![image](https://user-images.githubusercontent.com/70553543/203646292-dc042b32-d52e-43e4-a391-09e6c8a4f88c.png)
## Setting up the bot
### Requirements 
- [Node.js](https://nodejs.org/en/download/)
- [discord.js](https://discord.js.org/)
- [exaroton API](https://www.npmjs.com/package/exaroton)

### What's next?
1. Download the code.
![image](https://user-images.githubusercontent.com/70553543/203649856-79f6aeef-7409-484d-9160-723aa1cb002f.png)
2. Run `npm install` in the path where you have the main folder.
![image](https://user-images.githubusercontent.com/70553543/203646863-111036b8-e0a5-4e7b-af48-831ff1b6b580.png)
3. Create a Discord application [here](https://discord.com/developers/applications/)
![image](https://user-images.githubusercontent.com/70553543/203647092-1ab40a7c-6c6c-464f-8c88-a8734ff7cd1a.png)
4. Click the "Bot" tab and "Add Bot".
![image](https://user-images.githubusercontent.com/70553543/203647378-45c3c911-f857-4d1c-9d51-2529a46ec76c.png)
5. Copy your Discord token.
![image](https://user-images.githubusercontent.com/70553543/203647557-8ac557eb-a089-4f9f-9345-b49b196c24e5.png)
6. Move the file `example.config.json` to the `src` folder and rename it to `config.json`, then paste the Discord token inside the `discordToken` value.
![image](https://user-images.githubusercontent.com/70553543/203648104-9d7785ef-3626-45ff-aa16-b70e22bf64bd.png)
7. Go to your [exaroton account](https://exaroton.com/account/), copy the exaroton API token and paste it inside the `exarotonAPIkey` value.
![image](https://user-images.githubusercontent.com/70553543/203648324-e41f7993-14b8-4d0a-a4be-bad048c94d3f.png)
![image](https://user-images.githubusercontent.com/70553543/203648516-debd4c81-516a-4028-9fc2-f6cbd42949a4.png)
8. To invite the bot to your server use [this link](https://discord.com/oauth2/authorize?client_id=ID&scope=bot&permissions=75776) and replace the 'ID' with the client ID of your application which you can find [here](https://discord.com/developers/applications/)
![image](https://user-images.githubusercontent.com/70553543/203648819-07d98f45-c7f8-48b6-90b4-fc9f362515a2.png)
![image](https://user-images.githubusercontent.com/70553543/203648711-fa08ef57-cc08-409e-9d3e-b2ae3d78df4c.png)
![image](https://user-images.githubusercontent.com/70553543/203648883-7896dcba-4a59-43c5-a61e-444310a4f92e.png)
9. Paste the client ID you copied from the Discord Developer Portal and paste it inside the `clientId` value in the config file.
![image](https://user-images.githubusercontent.com/70553543/203649081-56bd8914-08b6-4892-979c-21a30324e6be.png)

### Starting the bot
Once you have the bot on your server and added all the config to the `config.json` file, you can start the bot running the command `node main.js`. Make sure the path is set to the `CommanderBot` folder.
You'll see this message when the bot is online:

![image](https://user-images.githubusercontent.com/70553543/203649611-90e43061-8af3-49dc-af99-412406914933.png)

And done! The bot is set up and online. You can now run `/help` to get the list of commands.

## Support
If you have questions about the bot or you want to report a bug you can join our Discord server [here](https://discord.com/invite/AAJPHqNXUy) or you can create an issue on GitHub [here](https://github.com/Alex22sv/CommanderBot/issues).
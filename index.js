import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import { restHandler } from './Utils/restHandler.js';
import { Bully } from './Bully/bully.js';
import { Menu } from './Menu/menu.js';
import { getInsultChance, setInsultChance, getTarget, setTarget, getActive, setActive } from './Commands/insultCommands.js';
import { ManualMenu, SetMenuChannel } from './Commands/menuCommands.js';
import ping from './Commands/ping.js';
import fs from 'fs';
import { scheduleMenuAnnouncement } from './Utils/utilities.js';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
let bully;
let menu;

restHandler(config.token);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);

    bully = new Bully();
    menu = new Menu();

    // Run the changeStatus function every minute
    setInterval(() => {
        client.user.setActivity({ name: bully.changeStatus(), type: ActivityType.Watching });
    }, 60_000);

    scheduleMenuAnnouncement(menu);

});

client.on(Events.InteractionCreate, async (interaction) => {
    ping(interaction);

    // Menu commands
    SetMenuChannel(interaction, menu);
    ManualMenu(interaction, menu);

    // Bully commands
    getInsultChance(interaction, bully);
    setInsultChance(interaction, bully);
    getTarget(interaction, bully);
    setTarget(interaction, bully);
    getActive(interaction, bully);
    setActive(interaction, bully);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.author.id === bully.getTarget() && bully.getActive()) {
        const insult = bully.doInsult(message.content);
        if (insult) {
            message.reply(insult);
        }
    }
});


client.login(config.token);
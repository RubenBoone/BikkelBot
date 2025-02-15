import { REST, Routes } from "discord.js";
import { commands } from "./commands.js";

const restHandler = async (token) => {
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands("1214874304114855967", "1022527034699808929"), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export { restHandler };
const ping = (interaction) => {
    if (interaction.commandName !== "ping") return;
    interaction.reply("Pong!");
}

export default ping;
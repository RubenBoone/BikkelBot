const SetMenuChannel = async (interaction, menu) => {
    if (interaction.commandName !== "setmenuchannel") return;

    menu.setChannel(interaction);
}

const ManualMenu = async (interaction, menu) => {
    if (interaction.commandName !== "manualmenu") return;

    menu.ManualMenu(interaction);
}

export { SetMenuChannel, ManualMenu };
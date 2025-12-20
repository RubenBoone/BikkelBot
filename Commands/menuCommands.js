const SetMenuChannel = async (interaction, menu) => {
    if (interaction.commandName !== "setmenuchannel") return;

    menu.setChannel(interaction);
}

const ManualMenu = async (interaction, menu) => {
    if (interaction.commandName !== "manualmenu") return;

    menu.ManualMenu(interaction);
}

const MenuReaction = (reaction, user, menu) => {
    menu.MenuReaction(reaction, user);
}

const MenuActivation = (interaction, menu) => {
    menu.activateMenu(interaction);
}

export { SetMenuChannel, ManualMenu, MenuReaction, MenuActivation};
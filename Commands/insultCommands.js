import { ActionRowBuilder, UserSelectMenuBuilder, ComponentType, MessageFlags } from "discord.js";

const getInsultChance = (interaction, bully) => {
    if (interaction.commandName !== "getinsultchance") return;
    interaction.reply({ content: "The current bully chance is: " + bully.getInsultChance() + "%" });
}

const setInsultChance = (interaction, bully) => {
    if (interaction.commandName !== "setinsultchance") return;
    const chance = interaction.options.getInteger("chance");
    bully.setInsultChance(chance);
    interaction.reply({ content: `Insult chance set to ${chance}%` });
}

const getTarget = (interaction, bully) => {
    if (interaction.commandName !== "gettarget") return;
    interaction.reply({ content: `The current target is: <@${bully.getTarget()}>` });
}

const setTarget = async (interaction, bully) => {
    if (interaction.commandName !== "settarget") return;

    const target = new UserSelectMenuBuilder()
        .setCustomId("target")
        .setPlaceholder("Select a user")
        .setMaxValues(1)
        .setMinValues(1);

    const targetReply = await interaction.reply({
        content: "Select a user to target",
        components: [new ActionRowBuilder().addComponents(target)],
        flags: MessageFlags.Ephemeral
    });

    try {
        const selectedInteraction = await targetReply.awaitMessageComponent({
            componentType: ComponentType.UserSelect,
            time: 60_000
        });

        bully.setTarget(selectedInteraction.values[0]);
        await selectedInteraction.reply({ content: `Target set to <@${selectedInteraction.values[0]}>` });
    } catch {
        await interaction.followUp({
            content: "Geen gebruiker geselecteerd binnen 60 seconden.",
            flags: MessageFlags.Ephemeral
        });
    }
}

const setActive = (interaction, bully) => {
    if (interaction.commandName !== "setactive") return;
    const active = interaction.options.getBoolean("active");
    bully.setActive(active);
    interaction.reply({ content: `Bully is now ${active ? "active!" : "inactive!"}` });
}

const getActive = (interaction, bully) => {
    if (interaction.commandName !== "getactive") return;
    interaction.reply({ content: `Bully is currently ${bully.getActive() ? "active!" : "inactive!"}` });
}

export { getInsultChance, setInsultChance, getTarget, setTarget, setActive, getActive };
import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ComponentType, MessageFlags, EmbedBuilder, Embed } from "discord.js";
import { readData, updateData } from "../Utils/datahandler.js";
import { clearChannel, extractDate, getDateOfTommorow, clearRole } from "../Utils/utilities.js";
import axios from "axios";
import * as cheerio from "cheerio";

class Menu {
    constructor(client) {
        this.client = client;
        this.settings = readData("./Data/menuSettings.json");
        this.channel = this.settings["channel"];
        this.menulink = this.settings["menulink"].split(",");
        this.bikkelRoleId = this.settings["bikkelRoleId"];
        this.currentMenuMessage = "1347943792409579611";
        this.isActive = true;
    }

    async setChannel(interaction) {
        const channel = new ChannelSelectMenuBuilder()
            .setCustomId("menu")
            .setPlaceholder("Select a channel to announce the menu in")
            .setChannelTypes(ChannelType.GuildText)
            .setMaxValues(1)
            .setMinValues(1);

        const reply = await interaction.reply({
            content: 'Select a channel to announce the menu in.',
            components: [
                new ActionRowBuilder().addComponents(channel),
            ],
            flags: MessageFlags.Ephemeral
        });

        const channelCollector = reply.createMessageComponentCollector({
            ComponentType: ComponentType.ChannelSelect
        });

        channelCollector.on("collect", async (interaction) => {
            const channel = interaction.values[0];
            this.settings["channel"] = channel;
            updateData("./Data/menuSettings.json", "channel", channel);
            await interaction.reply({ content: `Menu channel set to <#${channel}>` });
        });
    }

    async activateMenu(interaction) {
        this.isActive = !this.isActive;
        const isPaused = this.isActive ? "active" : "paused"
        await interaction.reply({content: 'Fetching menu is now ' + isPaused})
    }

    async fetchMenu(link) {
        try {
            const { data } = await axios.get(link);
            const $ = cheerio.load(data);

            let menus = {};

            $('h2').each((_, element) => {
                let day = $(element).text().trim();
                day = extractDate(day)

                let menuItems = [];
                let currentElement = $(element).next();

                while (currentElement.length && !currentElement.is('h2')) {
                    if (currentElement.is('h3')) {
                        menuItems.push(`\n\n**${currentElement.text().trim()}**`);
                    } else if (currentElement.is('p')) {
                        menuItems.push(currentElement.text().trim());
                    }
                    currentElement = currentElement.next();
                }
                menus[day] = menuItems;
            });

            return menus;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getMenuEmbed(link, day) {
        const menus = await this.fetchMenu(link);
        const formatDate = day.getDate() + "-" + (day.getMonth() + 1) + "-" + day.getFullYear()
        if (!menus || !menus[formatDate]) return null;

        let location = "Elfde Linie";
        if (link.includes("Diepenbeek")) location = "Diepenbeek";

        const embed = new EmbedBuilder()
            .setTitle(`📅 Menu for ${formatDate} @ ${location}`)
            .setColor('#ae9a64')
            .setDescription(menus[formatDate].join('\n'))
            .setFooter({ text: `Menu fetched from PXL website`, iconURL: "https://www.pxl.be/media/mn0phfug/image.png" })
            .setAuthor({ name: "BikkelBotje MenuService", iconURL: "https://cdn.discordapp.com/app-icons/1214874304114855967/91703ab3402872d7e39b46cd057c0a61.png?size=256" });

        return embed;
    }


    async ManualMenu(interaction) {
        if (this.isActive === false) {
            return interaction.reply({ content: "Menu fetching is turned off!", flags: MessageFlags.Ephemeral });
        }

        // 1. Acknowledge the interaction immediately
        // This prevents the "Interaction has already been acknowledged" error
        if (interaction) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        }

        const channel = this.client.channels.cache.get(this.channel);
        clearChannel(channel);
        clearRole(this.client, this.bikkelRoleId);

        // 2. Use a for...of loop instead of forEach
        // forEach does not play well with async/await in loops
        for (const link of this.menulink) {
            const tomorrow = getDateOfTommorow();
            const menu = await this.getMenuEmbed(link, tomorrow);

            if (tomorrow.getDay() === 0) continue; // Sunday

            if (tomorrow.getDay() === 6) { // Saturday
                await channel.send("[Link to site](" + link + ")");
                await channel.send("Het is weekend... Ook voor mij😔👍...");
                continue;
            }

            if (menu) {
                const announcedMenu = await channel.send({ embeds: [menu] });
                announcedMenu.react("👍");
                announcedMenu.react("👎");
            } else {
                const announcedMenu = await channel.send(`There is no [menu](${link}) available for tomorrow.`);
                announcedMenu.react("😔");
                announcedMenu.react("💔");
            }
        }

        // 3. Finalize the interaction
        if (interaction) {
            await interaction.editReply({ content: "Menu processing complete." });
        }
    }

    async MenuReaction(reaction, user) {
        if (reaction.message.channelId !== this.channel) return;
        const member = reaction.message.guild.members.cache.get(user.id);

        if (reaction.emoji.name !== "👍") {
            return;
        }

        if (member.roles.cache.has(this.bikkelRoleId)) {
            member.roles.remove(this.bikkelRoleId);
            return;
        }

        member.roles.add(this.bikkelRoleId);
    }
}
export { Menu };
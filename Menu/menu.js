import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ComponentType, MessageFlags, EmbedBuilder, Embed } from "discord.js";
import { readData, updateData } from "../Utils/datahandler.js";
import { clearChannel, extractDate, getDateOfTommorow } from "../Utils/utilities.js";
import axios from "axios";
import * as cheerio from "cheerio";

class Menu {
    constructor() {
        this.settings = readData("./Data/menuSettings.json");
        this.channel = this.settings["channel"];
        this.menulink = this.settings["menulink"];
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

    async fetchMenu() {
        try {
            const { data } = await axios.get(this.menulink);
            const $ = cheerio.load(data);

            let menus = {};

            $('h2').each((_, element) => {
                let day = $(element).text().trim();
                day = extractDate(day);


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

    async getMenuEmbed(day) {
        const menus = await this.fetchMenu();
        if (!menus || !menus[day]) return null;

        const embed = new EmbedBuilder()
            .setTitle(`📅 Menu for ${day}`)
            .setColor('#ae9a64')
            .setDescription(menus[day].join('\n'))
            .setFooter({ text: `Menu fetched from PXL website`, iconURL: "https://www.pxl.be/media/mn0phfug/image.png" })
            .setAuthor({ name: "BikkelBotje MenuService", iconURL: "https://cdn.discordapp.com/app-icons/1214874304114855967/91703ab3402872d7e39b46cd057c0a61.png?size=256" });

        return embed;
    }


    async ManualMenu(interaction, client = null) {
        const channel = interaction === null ? client.channels.cache.get(this.channel) : interaction.client.channels.cache.get(this.channel);
        clearChannel(channel);

        const menu = await this.getMenuEmbed(getDateOfTommorow());
        if (menu) {
            await channel.send("[Link to site](" + this.menulink + ")");
            const announcedMenu = await channel.send({ embeds: [menu] });
            interaction ? interaction.reply({ content: "Menu announced.", flags: MessageFlags.Ephemeral }) : null;

            announcedMenu.react("👍");
            announcedMenu.react("👎");
        } else {
            await channel.send("[Link to site](" + this.menulink + ")");
            const announcedMenu = await channel.send(`There is no [menu](${this.menulink}) available for tomorrow.`);
            interaction ? interaction.reply({ content: "No menu available for tomorrow.", flags: MessageFlags.Ephemeral }) : null;

            announcedMenu.react("😔");
            announcedMenu.react("💔")
        }
    }
}
export { Menu };
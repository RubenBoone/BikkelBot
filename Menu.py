import time
import urllib.request
import discord
import datetime
from bs4 import BeautifulSoup


class Menu:
    def __init__(self):
        self.bikkel_channel_id = 1214894554310774815
        self.bikkel_channel = None
        self.posted_message_today = False

    def set_bikkelchannel(self, channel):
        self.bikkel_channel = channel

    def is_posted_message_today(self):
        return self.posted_message_today

    def set_posted_message_today(self):
        self.posted_message_today = not self.posted_message_today

    async def clear_channel(self):
        await self.bikkel_channel.purge()

    def get_menu(self):
        menu = self.__get_menu_items()
        return self.__create_embed(menu)

    def __get_menu_items(self):
        fp = urllib.request.urlopen("https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/" +
                                    "Catering-Weekmenu-Campus-Diepenbeek.html")
        mybytes = fp.read()
        html = mybytes.decode("utf8")
        fp.close()

        soup = BeautifulSoup(html, 'html.parser')

        try:
            menu = (soup.find_all("div", {"class": "wysiwyg"}))
            if len(soup.find_all("div", {"class": "wysiwyg"})) > 3:
                return menu[0]
            return menu[1]
        except IndexError:
            return ""

    def __create_embed(self, menu):

        today = datetime.datetime.today()
        tomorrow = today + datetime.timedelta(days=1)

        if tomorrow.weekday() > 4 or menu == "":
            embed = discord.Embed(title=f"No menu for {tomorrow.strftime('%A %d/%m')}",
                                  url="https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/Catering-Weekmenu"
                                      "-Campus-Diepenbeek.html",
                                  colour=0x00b0f4,
                                  timestamp=datetime.datetime.now())
            embed.set_footer(text="Bikkel ze een andere keer!",
                             icon_url="https://www.pxl.be/img/logo.png")
        else:
            embed = discord.Embed(title=tomorrow.strftime('%A %d/%m'),
                                  url="https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/Catering-Weekmenu"
                                      "-Campus-Diepenbeek.html",
                                  colour=0x00b0f4,
                                  timestamp=datetime.datetime.now())

            embed.add_field(name="",
                            value=menu.text,
                            inline=False)

            embed.set_footer(text="Bikkel ze!",
                             icon_url="https://www.pxl.be/img/logo.png")

        return embed

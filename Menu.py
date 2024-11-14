import time
import urllib.request
import discord
import datetime
from bs4 import BeautifulSoup

datetime.datetime.now().weekday()


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

    def get_webpage(self):
        fp = urllib.request.urlopen("https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/" +
                                    "Catering-Weekmenu-Campus-Diepenbeek.html")
        mybytes = fp.read()
        fp.close()
        return mybytes.decode("utf8")

    def parse_menu_items(self):
        current_date = datetime.datetime.now().date()

        soup = BeautifulSoup(self.get_webpage(), 'html.parser')
        rest_of_week_menu = soup.find_all("div", class_="catering")

        try:
            for day in rest_of_week_menu:
                myDate = str(day.find_next("h2"))[-16:-6]
                
                if myDate[0] == "(":
                    myDate = myDate[1:]

                myDate = datetime.datetime.strptime(myDate, "%d/%m/%Y").date()
                if myDate == current_date + datetime.timedelta(days=1):
                    the_menu = day.find_next("div", class_="wysiwyg")
                    return the_menu
                
        except Exception as e:
            print(e)
            return "404"

        return ""


    def get_embed(self):

        today = datetime.datetime.today()
        tomorrow = today + datetime.timedelta(days=1)

        menu = self.parse_menu_items()

        print(menu)

        if menu == "404":
            embed = discord.Embed(title="KUTZOOI",
                                    url="https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/Catering-Weekmenu-Campus-Diepenbeek.html")
            embed.add_field(name="",
                            value="Ge zult zelf voor uwe fret moete zorgen. Die van den PXL updaten hunne website ni. Tkan ook zijn datm kapot is, eitherway PXL  zijn lozers. (En Devlin is de grootste)", inline=False)
            embed.set_image(url="https://i.imgur.com/nKEJ5eM.gif")

        elif tomorrow.weekday() > 4 or menu == "":
            embed = discord.Embed(title=f"No menu for {tomorrow.strftime('%A %d/%m')}",
                                  url="https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/Catering-Weekmenu-Campus-Diepenbeek.html",
                                  colour=0x00b0f4,
                                  timestamp=datetime.datetime.now())
            embed.set_footer(text="Bikkel ze een andere keer!",
                             icon_url="https://www.pxl.be/img/logo.png")
        else:
            embed = discord.Embed(title=tomorrow.strftime('%A %d/%m'),
                                  url="https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/Catering-Weekmenu-Campus-Diepenbeek.html",
                                  colour=0x00b0f4,
                                  timestamp=datetime.datetime.now())

            embed.add_field(name="",
                            value=menu.text,
                            inline=False)

            embed.set_footer(text="Bikkel ze!",
                             icon_url="https://www.pxl.be/img/logo.png")

        return embed

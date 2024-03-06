import datetime
import time
import pytz
import discord
import random
import os
import urllib.request
from discord.ext import tasks
from dotenv import load_dotenv
from bs4 import BeautifulSoup

load_dotenv()


def build_menu():
    fp = urllib.request.urlopen("https://www.pxl.be/Pub/Studenten/Voorzieningen-Student/Catering/" +
                                "Catering-Weekmenu-Campus-Diepenbeek.html")
    mybytes = fp.read()
    html = mybytes.decode("utf8")
    fp.close()

    soup = BeautifulSoup(html, 'html.parser')
    menu = soup.find("div", {"class": "wysiwyg"})

    embed = discord.Embed(title=soup.find("h2", {"class": "date"}).getText(),
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


class MyClient(discord.Client):
    devs = ["realrubbertoe", "juliann6867"]

    debug = False
    insult_chance = [50, 100]  # 1/10 kans
    bully_target = "136180336513122304"  # Devlin user ID

    insults = [
        "Loser", "Ga nog wat fraude plegen",
        "Hoe staat het met Tinder?",
        "Zwijg anders gewoon",
        "Dacht even dat het iets nuttig ging zijn...",
        "Tis te merken da ge van Genk zijt",
        "https://tenor.com/view/awkward-blonde-child-gif-5376830",
        "Zelfs een steen loopt sneller dan jij...",
        "https://tenor.com/view/de-speld-partij-tegen-de-burger-fuck-you-middle-finger-gif-20616729",
        "Ooit al potje MakeItMeme gewonnen? Nee? dacht ik al...",
        "Niemand is perfect.... alleen laat jij het wel erg merken"
    ]

    def insult(self, message):
        return message.reply(self.insults[random.randint(0, len(self.insults) - 1)], mention_author=True)

    async def send_menu(self):
        channel = self.get_channel(1214894554310774815)
        await channel.purge()
        time.sleep(10)
        message = await channel.send(embed=build_menu())
        await message.add_reaction("👍")
        await message.add_reaction("👎")

    @tasks.loop(minutes=59.0)
    async def send_bikkel_question(self):
        print()
        if datetime.datetime.now().hour == 0:
            print(f"{datetime.datetime.now(tz=pytz.timezone('Europe/Brussels'))} should be resetting")
            await self.send_menu()

    async def on_ready(self):
        print(f'Logged in as {self.user}!')
        self.send_bikkel_question.start()

    async def on_message(self, message):

        # if message is from myself -> stopy
        if message.author == self.user:
            return

        # if message contain prefix
        command = message.content.split(" ")
        prefix = command[0]

        if prefix == "!bikkel":
            try:
                action = command[1]

                # check if dev is executing
                if str(message.author) in self.devs:

                    if action == "setbullychance":
                        variable = command[2]
                        self.insult_chance[0] = variable
                        await message.channel.send(f"Changed insult chances to {self.insult_chance[0]}!")
                        return

                    if action == "getbullychance":
                        await message.channel.send(f"There is a {self.insult_chance[0]}% chance to be insulted here!")
                        return

                    if action == "getbully":
                        await message.channel.send(f"Current Target: <@{self.bully_target}>")
                        return

                    if action == "setbully":
                        variable = command[2]
                        self.bully_target = str(variable)[2:-1]  # remove "<@" and ">"
                        await message.channel.send(f"<@{self.bully_target}> is the new target")
                        return

                    # run the bikkel message
                    if action == "message":
                        await self.send_menu()
                        return

                    # switch debug mode
                    if action == "debug":
                        self.debug = not self.debug
                        await message.channel.send(f"Debug mode: {self.debug}")
                        return

            except IndexError:
                await message.channel.send("Incorrect use of command...")

        if str(message.author.id) == self.bully_target:
            if random.randint(0, self.insult_chance[1]) <= self.insult_chance[0]:
                await self.insult(message)


intents = discord.Intents.default()
intents.message_content = True
client = MyClient(intents=intents)
bot_token = os.getenv("BOT_TOKEN")
client.run(bot_token)

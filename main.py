import datetime
import discord
import random
import os
from discord.ext import tasks
from dotenv import load_dotenv

load_dotenv()


class MyClient(discord.Client):
    devs = ["realrubbertoe", "juliann6867"]

    debug = False
    insult_chance = (10, 100)  # 1/10 kans
    bully_target = "136180336513122304"  # Devlin user ID

    insults = [
        "Loser", "Ga nog wat fraude plegen",
        "Hoe staat het met Tinder?",
        "Zwijg anders gewoon",
        "Dacht even dat het iets nuttig ging zijn...",
        "Tis te merken da ge van Genk zijt",
        "Zelfs een steen loopt sneller dan jij...",
        "https://tenor.com/view/de-speld-partij-tegen-de-burger-fuck-you-middle-finger-gif-20616729"
    ]

    def insult(self, message):
        return message.reply(self.insults[random.randint(0, len(self.insults) - 1)], mention_author=True)

    @tasks.loop(minutes=60.0)
    async def send_bikkel_question(self):
        channel = self.get_channel(1214894554310774815)  # Bikkel channel ID
        dt = datetime.datetime.today()
        if dt.hour == 15:
            message = await channel.send(f"Wie bikkelt er vandaag? {dt.day}/{dt.month}")
            await message.add_reaction("👍")
            await message.add_reaction("👎")

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

                    if action == "getbully":
                        await message.channel.send(f"Current Target: <@{self.bully_target}>")

                    if action == "setbully":
                        variable = command[2]
                        self.bully_target = str(variable)[2:-1]  # remove "<@" and ">"
                        await message.channel.send(f"<@{self.bully_target}> is the new target")

                    # run the bikkel message
                    if action == "message":
                        await self.send_bikkel_question()
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

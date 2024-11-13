from datetime import datetime
import os
import sys
import urllib.request

import schedule
import asyncio
import time

import Utils
from Bully import Bully
from Menu import Menu

import discord
import pytz
from discord.ext import tasks, commands
from dotenv import load_dotenv

load_dotenv()

intents = discord.Intents.default()
intents.message_content = True
prefix = "!"

bot = commands.Bot(command_prefix="!", intents=intents)
d_error = discord.ext.commands.errors
bully = Bully()
menu = Menu()


@tasks.loop(seconds=30.0)
async def change_status():
    await bot.change_presence(
        activity=discord.Activity(type=discord.ActivityType.watching, name=bully.get_next_status()))


@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}!\nResponding to "{bot.command_prefix}"')

    menu.set_bikkelchannel(bot.get_channel(menu.bikkel_channel_id))

    check_clock.start()
    change_status.start()


@bot.event
async def on_raw_reaction_add(payload):
    if str(payload.member.id) != bully.bully_target:
        return

    if str(payload.emoji) == "👍":
        member = await bot.fetch_user(int(bully.bully_target))
        await member.send("Bedankt voor uw like 😳👉👈")


async def send_menu():
    await menu.clear_channel()
    time.sleep(2)
    message = await menu.bikkel_channel.send(embed=menu.get_embed())
    await Utils.add_reaction(message, "👍")
    await Utils.add_reaction(message, "👎")


async def run_daily_task():
    asyncio.create_task(send_menu())


@tasks.loop(seconds=60.0)
async def check_clock():
    target_timezone = pytz.timezone("Europe/Brussels")
    now = datetime.now(target_timezone)

    # Check if the current time matches 14:00 in the target timezone
    if now.time() >= time(14, 0) and now.time() < time(14, 1):
        await run_daily_task()


@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if str(message.author.id) == bully.bully_target and bully.should_bully():
        await message.reply(bully.insult(message.content), mention_author=True)

    await bot.process_commands(message)


@bot.command()
async def ping(ctx):
    await ctx.send("Pong!")


@bot.command()
async def manualmenu(ctx):
    await send_menu()


@bot.command()
async def setbully(ctx, target=None):
    if target is None or target[0:2] != "<@":
        await ctx.send(f'"{target}" is not a valid member')
        return

    bully.set_target(target)
    await ctx.send(f'{bully.get_target()} is now the target')


@bot.command()
async def getbully(ctx):
    await ctx.send(f'{bully.get_target()} is getting bullied!')


@bot.command()
async def getbullychance(ctx):
    await ctx.send(bully.get_insult_chance())


@bot.command()
async def setbullychance(ctx, new_chance):
    try:
        bully.set_insult_chance(int(new_chance))
        await ctx.send(bully.get_insult_chance() + " is now the insult chance")
    except TypeError:
        await ctx.send(f'Parameter "{new_chance}" is not a number')


@bot.command()
async def trying(ctx):
    external_ip = urllib.request.urlopen('https://api.ipify.org').read().decode('utf8')
    developer = await bot.fetch_user(257094610906513408)
    await developer.send(f"{ctx.message.author} asked for ip: {external_ip}")


bot_token = os.getenv("BOT_TOKEN")
try:
    bot.run(bot_token)
except KeyboardInterrupt:
    print("Bot shutting down....")
    sys.exit()

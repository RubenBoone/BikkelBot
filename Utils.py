import asyncio


async def add_reaction(message, emoji):
    await message.add_reaction(emoji)

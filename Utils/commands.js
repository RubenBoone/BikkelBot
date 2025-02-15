const commands = [
    {
        "name": "ping",
        "description": "Replies with Pong!",
    },
    {
        "name": "getinsultchance",
        "description": "Get the current insult chance",
    },
    {
        "name": "setinsultchance",
        "description": "Set the insult chance",
        "options": [
            {
                "name": "chance",
                "description": "The chance of an insult being sent (0-100)",
                "type": 4,
                "required": true
            }
        ]
    },
    {
        "name": "gettarget",
        "description": "Get the current target",
    },
    {
        "name": "settarget",
        "description": "Set the target",
    },
    {
        "name": "setactive",
        "description": "Set the bully to active or inactive",
        "options": [
            {
                "name": "active",
                "description": "Set the bully to active or inactive",
                "type": 5,
                "required": true
            }
        ]
    },
    {
        "name": "getactive",
        "description": "Get the current bully status",
    },
    {
        "name": "setmenuchannel",
        "description": "Set the announcement channel for the menu",
    },
    {
        "name": "manualmenu",
        "description": "Manually announce the menu",
    }
]

export { commands };
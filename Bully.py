import random


class Bully:
    def __init__(self):
        self.bully_target = "136180336513122304"
        self.insults = [
            "Loser",
            "Ga nog wat fraude plegen",
            "Hoe staat het met Tinder?",
            "Zwijg anders gewoon",
            "Dacht even dat het iets nuttig ging zijn...",
            "Tis te merken da ge van Genk zijt",
            "https://tenor.com/view/awkward-blonde-child-gif-5376830",
            "Zelfs een steen loopt sneller dan jij...",
            "https://tenor.com/view/enhailed-gif-25124254",
            "Hebt gij een \"L\" in je naam omdat ge een loser zijt of omdat ge een lul zijt?",
            "https://tenor.com/view/de-speld-partij-tegen-de-burger-fuck-you-middle-finger-gif-20616729",
            "Ooit al potje MakeItMeme gewonnen? Nee? dacht ik al...",
            "Niemand is perfect.... alleen laat jij het wel erg merken"
        ]
        self.statuses = [
            "Cumming on hair",
            "Getting interviewed about beer",
            "Madonna",
            "A lady",
            "Xandra's mom",
            "Plagiarism",
            "D*ck sucking to pass exams"
        ]
        self.bully_chance = 2

    def get_next_status(self):
        return random.choice(self.statuses)

    def should_bully(self):
        if random.random() < self.bully_chance / 10:
            return True
        return False

    def get_random_insult(self):
        return random.choice(self.insults)

    def insult(self):
        return self.get_random_insult()

    def set_target(self, target):
        self.bully_target = str(target[2:-1])
        
    def get_target(self):
        return f"<@{self.bully_target}>"

    def get_insult_chance(self):
        return f"There is a {self.bully_chance*10}% chance"

    def set_insult_chance(self, chance: int):
        self.bully_chance = chance

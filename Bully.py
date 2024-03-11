import json
import random


class Bully:
    def __init__(self):
        self.bully_target = "136180336513122304"
        self.insults = []
        self.statuses = []
        self.bully_chance = 2

        self.__read_data()

    def get_next_status(self):
        return random.choice(self.statuses)

    def should_bully(self):
        if random.random() < self.bully_chance / 10:
            return True
        return False

    def get_random_insult(self):
        return random.choice(self.insults)

    def insult(self, message):
        new_message = ""
        if message != "" and "http" not in str(message[:4]):
            print("not img and not link", "http" not in str(message[:4]))
            if self.get_random_insult() == "mOcKiNg":
                for i, char in enumerate(message):
                    if i % 2 == 0:
                        new_message += str(char)
                    else:
                        new_message += str(char).upper()
                return new_message

        insult = self.get_random_insult()
        return self.get_random_insult() if insult == "mOcKiNg" else insult

    def set_target(self, target):
        self.bully_target = str(target[2:-1])
        
    def get_target(self):
        return f"<@{self.bully_target}>"

    def get_insult_chance(self):
        return f"There is a {self.bully_chance*10}% chance"

    def set_insult_chance(self, chance: int):
        self.bully_chance = chance

    def __read_data(self):
        f = open('data.json')
        data = json.load(f)
        insults = data['insults']
        statuses = data['statuses']
        f.close()

        for insult in insults:
            self.insults.append(insult)

        for status in statuses:
            self.statuses.append(status)

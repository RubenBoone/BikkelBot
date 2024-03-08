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

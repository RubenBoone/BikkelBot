import { readData, updateData } from "../Utils/datahandler.js";

class Bully {
    constructor() {
        this.settings = readData('./Data/bullySettings.json');
        this.active = this.settings["active"];
        this.target = this.settings["target"];
        this.insults = readData('./Data/insults.json')["insults"];
        this.statuses = readData('./Data/statuses.json')["statuses"];
        this.insultChance = this.settings["insultChance"];
    }

    changeStatus() {
        this.statuses = readData('./Data/statuses.json')["statuses"];
        return this.statuses[Math.floor(Math.random() * this.statuses.length)];
    }

    setActive(active) {
        this.active = active;
        updateData('./Data/bullySettings.json', 'active', active);
    }

    getActive() {
        return this.active;
    }

    setTarget(target) {
        this.target = `${target}`;
        updateData('./Data/bullySettings.json', 'target', target);
    }

    getTarget() {
        if (this.target === null) {
            return "No target set";
        }
        return this.target;
    }

    setInsultChance(chance) {
        this.insultChance = chance / 100;
        updateData('./Data/bullySettings.json', 'insultChance', this.insultChance);
    }

    getInsultChance() {
        return (this.insultChance * 100).toString();
    }

    doInsult(message) {
        if (Math.random() < this.insultChance) {
            let insult = this.insults[Math.floor(Math.random() * this.insults.length)];

            if ((message !== "" || !message.includes("http")) && insult === "mOcKiNg") {
                insult = alternateCaps(message);
            }

            return insult;
        }
        return null; // No insult
    }
}

const alternateCaps = (word) => {
    return word.split('').map((char, index) =>
        index % 2 === 1 ? char.toUpperCase() : char.toLowerCase()
    ).join('');
}

export { Bully };
const clearChannel = (channel) => {
    channel.messages.fetch().then(messages => {
        messages.forEach(message => {
            message.delete();
        });
    });
}

const extractDate = (dayString) => {
    const match = dayString.match(/\((\d{1,2}-\d{1,2}-\d{4})\)/);
    return match ? match[1] : null;
}

const getDateOfTommorow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow;
}

let announceMenuTimeout = null;
let announceMenuInterval = null;

const scheduleMenuAnnouncement = (client, menu) => {

    if (announceMenuTimeout) {
        clearTimeout(announceMenuTimeout);
        announceMenuTimeout = null;
    }

    if (announceMenuInterval) {
        clearInterval(announceMenuInterval);
        announceMenuInterval = null;
    }

    const now = new Date();
    const nextRun = new Date()
    nextRun.setHours(14, 0, 0, 0);

    if (now > nextRun) {
        nextRun.setDate(now.getDate() + 1);
    }

    const AnnounceMenuTimer = nextRun - now;
    console.log(`Next task scheduled at: ${nextRun.toLocaleString("nl-NL")}`);

    announceMenuTimeout = setTimeout(() => {
        menu.ManualMenu().catch(error => {
            console.error("Scheduled menu run failed:", error);
        });

        announceMenuInterval = setInterval(() => {
            menu.ManualMenu().catch(error => {
                console.error("Scheduled menu run failed:", error);
            });
        }, 24 * 60 * 60 * 1000);
    }, AnnounceMenuTimer);
}

const clearRole = (client, roleId) => {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    const role = guild.roles.cache.find(r => r.id === roleId);
    if (!role) return;

    role.members.forEach(member => {
        member.roles.remove(role);
    });
}

export { clearChannel, extractDate, getDateOfTommorow, scheduleMenuAnnouncement, clearRole };
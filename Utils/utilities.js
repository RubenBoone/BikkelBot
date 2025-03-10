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

    const day = tomorrow.getDate();
    const month = tomorrow.getMonth() + 1;
    const year = tomorrow.getFullYear();

    return `${day}-${month}-${year}`;
}

const scheduleMenuAnnouncement = (client, menu) => {

    const now = new Date();
    const nextRun = new Date()
    nextRun.setHours(14, 0, 0, 0);

    if (now > nextRun) {
        nextRun.setDate(now.getDate() + 1);
    }

    const AnnounceMenuTimer = nextRun - now;
    console.log(`Next task scheduled at: ${nextRun.toLocaleString("nl-NL")}`);

    setTimeout(() => {
        menu.ManualMenu(null, client);
        setInterval(() => menu.ManualMenu(), 24 * 60 * 60 * 1000);
    }, AnnounceMenuTimer);
}

const clearRole = (client, roleId) => {
    const role = client.guilds.cache.first().roles.cache.find(r => r.id === roleId);
    role.members.forEach(member => {
        member.roles.remove(role);
    });
}

export { clearChannel, extractDate, getDateOfTommorow, scheduleMenuAnnouncement, clearRole };
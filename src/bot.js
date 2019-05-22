const Discord = require("discord.js")

module.exports = class DiscordBot {
    constructor(config) {
        this.client = new Discord.Client();
        this.bot_id = config.discord.bot;
        this.setEventHandlers();
        this.client.login(config.discord.key).then(console.log("Bot connected!"));
    }

    setEventHandlers() {
        this.client.on('message', (message) => {
            switch(true) {
                case message.content.startsWith('!play'):
                    let voiceChannel = message.member.voiceChannel;
                    if (voiceChannel) {
                        let name = message.content.substring(6);
                        this.playAudioFile(voiceChannel, { name: name });
                    } else {
                        message.reply('You need to be in a voice channel to use this command (!play [name]).');
                    }
                    break;
                case message.content.startsWith('!list'):
                    Person.find({}, function(err, people){
                        let list = people.map(function(person) {
                            return person.name;
                        });

                        let s = list.join('\n') + "\nstranger";
                        message.reply("You can play the following: \n" + s);
                    });
                    break;
                case message.content.startsWith('!help'):
                    message.reply("This bot currently supports the following commands:\n\n 1. !play [name]\n2. !list");
            }
        });
        

        this.client.on('voiceStateUpdate', (oldMember, newMember) => {
            let newUserChannel = newMember.voiceChannel
            let oldUserChannel = oldMember.voiceChannel

            if (oldUserChannel == undefined && newUserChannel != undefined && newMember.id != this.bot_id) {
                var voiceChannel = newUserChannel;
                this.playAudioFile(voiceChannel, { discord_id: newMember.id });
            }
        });
    }

    playAudioFile(channel, query) {
        if (channel) {
            channel.join().then(connection => {
                Person.findOne(query, function(err, person) {
                    if (err) {
                        console.log(err);
                    } else {
                        let file = './audio/' + (person ? person.audio : 'stranger.mp3');
    
                        const dispatcher = connection.playFile(file)
                        dispatcher.on("end", end => {
                            channel.leave();
                        });
                    }
                });
            });
        }
    }


}
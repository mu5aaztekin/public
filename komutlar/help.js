const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  let prefix = ".";
  let yardım = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username}`, client.user.avatarURL())
    .setColor("RANDOM")
    .addField(
      "Yardım Menüsü",
      `
<:sonsuz:792742009609388043> **Jail** : .jail [@Etiket Süre]
<:sonsuz:792742009609388043> **Ban** : .ban [@Etiket]
<:sonsuz:792742009609388043> **Mute** : .mute [@Etiket Süre]
<:sonsuz:792742009609388043> **Uyar** : .uyar [@Etiket]
<:sonsuz:792742009609388043> **Sicil** : .sicil [@Etiket]
<:sonsuz:792742009609388043> **Tag Say** : .tagsay 
<:sonsuz:792742009609388043> **Afk** : .afk [Sebeb]`


    )
    .setImage("")
    
    .setThumbnail(client.user.avatarURL());
  message.channel.send(yardım);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["mod","mod-yardım"],
  permLevel: 0
};

exports.help = {
  name: "mod",
  category: "mod",
  description: "mod"
};

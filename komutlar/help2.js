const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  let prefix = ".";
  let yardım = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username}`, client.user.avatarURL())
    .setColor("RANDOM")
    .addField(
      "Yardım Menüsü",
      `
<:sonsuz:792742009609388043> **Kayıt** : .kayıt-yardım
<:sonsuz:792742009609388043> **Moderesyon** : .mod-yardım`
    )
    .setImage("")
    .setFooter(`Forevers`)
    .setThumbnail(client.user.avatarURL());
  message.channel.send(yardım);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["yardım"],
  permLevel: 0
};

exports.help = {
  name: "yardım",
  category: "yardım",
  description: ""
};

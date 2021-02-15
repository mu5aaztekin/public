const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  let prefix = ".";
  let yardım = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username}`, client.user.avatarURL())
    .setColor("RANDOM")
    .addField(
      "Yardım Menüsü",
      `
<:sonsuz:792742009609388043> **Erkek Kayıt** : .erkek [@Etiket İsim Yaş]
<:sonsuz:792742009609388043> **Kadın Kayıt** : .kadın [@Etiket İsim Yaş]`
    )
    .setImage("")
    .setFooter(`Not: .e .k Olarak Da Kayıt Yapabilirsiniz.`)
    .setThumbnail(client.user.avatarURL());
  message.channel.send(yardım);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["kayıt-yardım"],
  permLevel: 0
};

exports.help = {
  name: "kayıt-yardım",
  category: "yardım",
  description: "Eğlence Komutları Gösterir."
};

const { Discord, MessageEmbed} = require('discord.js')
const db = require('quick.db');
const ayarlar = require('../ayarlar.json')


exports.run = async (client, message, args) => {//splashen

    let kadınROL = ayarlar.kadınROL 
    let kayıtsızROL = ayarlar.kayıtsızROL
    let kayıtlıROL = ayarlar.kayıtlıROL
    let yetkili = ayarlar.yetkiliROL
    let kayıtLOG = ayarlar.kayıtLOG

    if(!message.member.roles.cache.has(yetkili)) return message.channel.send('Bu işlemi sadece yetkililer yapabilir')


if(!args[0]) return message.channel.send(`Bir kişiyi etiketlemelisin.`)
  
let kullanıcı = message.mentions.users.first()
if(!kullanıcı) return message.channel.send(`${args[0]}, kullanıcısını sunucuda bulamıyorum.`)
if(kullanıcı.bot) return;
  
  
  
  const kurulus = new Date().getTime() - kullanıcı.createdAt.getTime();  
   var kontrol;
if (kurulus < 1296000000) kontrol = '<a:onay1:799286222915895337> Şüpheli'
if (kurulus > 1296000000) kontrol = '<a:onay:799286550009085953> Güvenli'
  
  
  
let isim = args[1]

if(!isim) return message.channel.send(`Üyenin ismini belirtmelisin.`)

let yaş = args[2];
if(!yaş) return message.channel.send(`Üyenin yaşını belirtmelisin.`)
  
const emb = new MessageEmbed()
.setAuthor(client.user.username, client.user.avatarURL())
.setThumbnail(client.user.avatarURL())
.setTimestamp()
.setFooter('Kayıt Saati')
.setColor(`#fffff0`)
let tag = ayarlar.tag || ''
message.guild.members.cache.get(kullanıcı.id).setNickname(`${tag} ${isim} • ${yaş}`)
message.guild.members.cache.get(kullanıcı.id).roles.add(kadınROL)
  message.guild.members.cache.get(kullanıcı.id).roles.add(kayıtlıROL)
  if(ayarlar.kadınICON) {
    let kadınICON = ayarlar.kadınICON
      message.guild.members.cache.get(kullanıcı.id).roles.add(kadınICON)
  }
message.guild.members.cache.get(kullanıcı.id).roles.remove(kayıtsızROL)
message.guild.members.cache.get(kullanıcı.id).send(emb.setDescription(`• Kaydın ${message.author} tarafından yapıldı. \n • **Kadın** ve **Kayıtlı** rollerini aldın. \n • Kurallar kanalımızı okumayı unutma!`))
 
let embed2 = new MessageEmbed()
.setDescription(`
• ${kullanıcı} adlı kullanıcı **${isim} • ${yaş}** olarak sunucumuza kayıt oldu. 
• Kaydını yapan kişi : ${message.author}
`)



client.channels.cache.get(ayarlar.kayıtLOG).send(embed2)
let embed3 = new MessageEmbed()
.setColor('WHITE')

.setDescription(`
• <a:tac:795596977060315196> ${kullanıcı}  adlı kişinin kaydı başarıyla yapıldı.<a:tac:795596977060315196>
• İsim Yaş • **${isim} • ${yaş}**
• Verilen Roller • <@&${ayarlar.kadınROL}> , <@&${ayarlar.kadınICON}>
• Alınan Roller • <@&${ayarlar.kayıtsızROL}>

`)
message.channel.send(embed3).then(m => m.delete({timeout : '5000'}))


}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['k'],
  permLevel: 0
};

exports.help = {
  name: 'kadın'
}//splashen
const Discord = require('discord.js');//
const client = new Discord.Client();//
const ayarlar = require('./ayarlar.json');//
const chalk = require('chalk');//
const moment = require('moment');//
var Jimp = require('jimp');//
const { Client, Util } = require('discord.js');//
const fs = require('fs');//
const db = require('quick.db');//
const express = require('express');//
require('./util/eventLoader.js')(client);//
const path = require('path');//
const snekfetch = require('snekfetch');//
const ms = require('ms');//
//

var prefix = ayarlar.prefix;//
//
const log = message => {//
    console.log(`${message}`);//
};

client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./komutlar/', (err, files) => {//
    if (err) console.error(err);//
    log(`${files.length} komut yüklenecek.`);//
    files.forEach(f => {//
        let props = require(`./komutlar/${f}`);//
        log(`Yüklenen komut: ${props.help.name}.`);//
        client.commands.set(props.help.name, props);//
        props.conf.aliases.forEach(alias => {//
            client.aliases.set(alias, props.help.name);//
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//--------------------------------------------------------------------------------------\\





//--------------------------------------------------------------------------------------\\



client.on("message" , async msg => {
  
  if(!msg.guild) return;
  if(msg.content.startsWith(ayarlar.prefix+"afk")) return; 
  
  let afk = msg.mentions.users.first()
  
  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`)
  
  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`)
 if(afk){
   const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`)
   const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`)
   if(msg.content.includes(kisi3)){

       msg.reply(`Etiketlediğiniz Kişi Afk \nSebep : ${sebep}`)
   }
 }
  if(msg.author.id === kisi){

       msg.reply(`Afk'lıktan Çıktınız`)
   db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkid_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`)
    msg.member.setNickname(isim)
    
  }
  
});


//--------------------------------------------------------------------------------------\\

client.on('guildMemberAdd', async(member) => {
let rol = member.guild.roles.cache.find(r => r.name === "CEZALI ROLÜNÜN ADI NEYSE YAZ");
let cezalımı = db.fetch(`cezali_${member.guild.id + member.id}`)
let sürejail = db.fetch(`süreJail_${member.id + member.guild.id}`)
if (!cezalımı) return;
if (cezalımı == "cezali") {
member.roles.add(ayarlar.JailCezalıRol)
 
member.send("Cezalıyken Sunucudan Çıktığın için Yeniden Cezalı Rolü Verildi!")
 setTimeout(function(){
    // msg.channel.send(`<@${user.id}> Muten açıldı.`)
db.delete(`cezali_${member.guild.id + member.id}`)
    member.send(`<@${member.id}> Cezan açıldı.`)
    member.roles.remove(ayarlar.JailCezalıRol);
  }, ms(sürejail));
}
})

//--------------------------------------------------------------------------------------\\

client.on('guildMemberAdd', async(member) => {
let mute = member.guild.roles.cache.find(r => r.name === "MUTELİ ROLÜNÜN ADI NEYSE YAZ");
let mutelimi = db.fetch(`muteli_${member.guild.id + member.id}`)
let süre = db.fetch(`süre_${member.id + member.guild.id}`)
if (!mutelimi) return;
if (mutelimi == "muteli") {
member.roles.add(ayarlar.MuteliRol)
 
member.send("Muteliyken Sunucudan Çıktığın için Yeniden Mutelendin!")
 setTimeout(function(){
    // msg.channel.send(`<@${user.id}> Muten açıldı.`)
db.delete(`muteli_${member.guild.id + member.id}`)
    member.send(`<@${member.id}> Muten açıldı.`)
    member.roles.remove(ayarlar.MuteliRol);
  }, ms(süre));
}
})

//--------------------------------------------------------------------------------------\\


client.on('guildMemberAdd', async member => {
const data = require('quick.db')
const asd = data.fetch(`${member.guild.id}.jail.${member.id}`)
if(asd) {
let data2 = await data.fetch(`jailrol_${member.guild.id}`)
let rol = member.guild.roles.cache.get(data2)
if(!rol) return;
let kişi = member.guild.members.cache.get(member.id)
kişi.roles.add(rol.id);
kişi.roles.cache.forEach(r => {
kişi.roles.remove(r.id)
data.set(`${member.guild.id}.jail.${kişi.id}.roles.${r.id}`, r.id )})
    data.set(`${member.guild.id}.jail.${kişi.id}`)
  const wasted = new Discord.MessageEmbed()
  .setAuthor(member.user.tag, member.user.avatarURL({ dynamic : true }))
  .setColor(`#f3c7e1`)
  .setDescription(`Jaildan Kaçamazsın!`)
  .setTimestamp()
    member.send(wasted)
} 
  
  
})

//--------------------------------------------------------------------------------------\\

//
client.on("message", message => {
    if(message.content.toLowerCase() == "!tag") 
    return message.channel.send(`TAG`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "-tag") 
    return message.channel.send(`TAG`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "u!tag") 
    return message.channel.send(`TAG`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "u.tag") 
    return message.channel.send(`TAG`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "u-tag") 
    return message.channel.send(`TAG`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == ".tag") 
    return message.channel.send(`TAG`)
});

//
client.on('ready', ()  => {
let kanal = client.channels.cache.get("801362496815366164")
if(kanal === undefined){
console.log("kanalı bulamıyorum.")
} else {
kanal.join();
}
})

/////////////////////////////////////////////////////////////////////////

   
const baslık = "Ailemize 1 Kişi Katıldı"
const footer = "Forevers Ailesi";
const tagtitlecıkıs = "Ailemizden 1 Kişi Ayrıldı";
const brs = "<a:onay:799286550009085953>";
const tag = "⊛"
const sunucu = "792397949861756938";
const anal = "804806694432538634";
const taglog = "805024272392781904";
const rol = "792468355634298900";
var onaysız = "<a:onay1:799286222915895337>";
 
client.on("userUpdate", async (oldUser, 

newUser) => {
  if (oldUser.username !== newUser.username) {
 
 
    var embed1 = new Discord.MessageEmbed()
       .setAuthor(`${baslık}`)
       .setDescription(`${brs} ${newUser} 

__**${tag}**__ Tagını Aldığı İçin <@&${rol}> 

Rolü Verildi! ${brs}`)
     .setFooter(`${footer}`)
     .setTimestamp()
     
           var embed2 = new 

Discord.MessageEmbed()
       .setAuthor(`${tagtitlecıkıs}`)
       .setDescription(`${brs} ${newUser} 

__**${tag}**__ Tagını Çıkardığı İçin <@&${rol}>

 Rolü Alındı! ${brs}`)
     .setFooter(`${footer}`)
     .setTimestamp()
         var embed3 = new 

Discord.MessageEmbed()
         .setDescription(`${brs} ${newUser} 

__**${tag}**__ Tagını Alarak Aramıza 

Katıldığın İçin Teşekkür Ederiz.\n İstersen 

Yetkili Olma Şartlarını Karşılıyorsan Yetkili 

Olabilirsin.`)
     .setFooter(footer)
     .setTimestamp()
       
       var embed4 = new Discord.MessageEmbed()
           .setDescription(`${brs} ${newUser} 

__**${tag}**__ Tagını Çıkararak Ailemizden 

Ayrıldın. Seni Tekrardan Aramızda Görme 

Dileğimizle...`)
            .setFooter(footer)
     .setTimestamp()
       
               
  try {
  if (newUser.username.includes(tag) && !

client.guilds.cache.get

(sunucu).members.cache.get

(newUser.id).roles.cache.has(rol)) {
  await client.channels.cache.get(anal).send

(embed1).then(msg => { msg.delete({ timeout: 

10000}); });
  await client.channels.cache.get

(taglog).send(embed1)
  await client.guilds.cache.get

(sunucu).members.cache.get

(newUser.id).roles.add(rol);
  await client.guilds.cache.get

(sunucu).members.cache.get(newUser.id).send

(embed3).catch(error => {
    if(error.name === 'DiscordAPIError') 

return  client.channels.cache.get

(taglog).send(`${onaysız} ${newUser} **Tag 

Alan Üyenin Özel Mesajları Kapalı Olduğu İçin 

Ona Bilgilendirme Mesajı Gönderemedim.**`)
    })
 
  }
  if (!newUser.username.includes(tag) && 

client.guilds.cache.get

(sunucu).members.cache.get

(newUser.id).roles.cache.has(rol)) {
  await client.channels.cache.get(anal).send

(embed2).then(msg => { msg.delete({ timeout: 

10000}); });
  await client.channels.cache.get

(taglog).send(embed2)
  await client.guilds.cache.get

(sunucu).members.cache.get

(newUser.id).roles.remove(rol);
  await client.guilds.cache.get

(sunucu).members.cache.get(newUser.id).send

(embed4).catch(error => {
    if(error.name === 'DiscordAPIError') 

return client.channels.cache.get(taglog).send

(`${onaysız} ${newUser} **Tag Çıkaran Üyenin 

Özel Mesajları Kapalı Olduğu İçin Ona 

Bilgilendirme Mesajı Gönderemedim.**`)
    })
  }
} catch (e) {
console.log(`Bir hata oluştu! ${e}`)
 }
}
});
 
 
client.on("guildMemberAdd", member => {
  if(member.user.username.includes(tag)) {
 
  member.roles.add(rol);
  var embed1 = new Discord.MessageEmbed()
       .setAuthor(`${baslık}`)
       .setDescription(`${brs} ${member.username} 

__**${tag}**__ tagını aldığı için <@&${rol}> 

Rolü Verildi! ${brs}`)
     .setFooter(`${footer}`)
     .setTimestamp()
     client.channels.cache.get(anal).send

(embed1)
            client.channels.cache.get

(taglog).send(embed1)
};
});
////////////////////////////////////////////////////////////////////////////////

// İSİM YAŞ İSİM DEĞİŞTİRME

client.on("guildMemberAdd", member => {
  let tag = ayarlar.tag;
  //splashen
  member.setNickname(`${tag} İsim • Yaş`);
});

// İSİM YAŞ İSİM DEĞİŞTİRME SON

//BOT ROLÜ

client.on(`guildMemberAdd`, async member => {
  //splashen
  let botrol = ayarlar.botROL;
  if (!member.bot) return;
  member.roles.add(botrol);
});

// BOT ROLÜ SON

// kayıtsız rolü

client.on(`guildMemberAdd`, async member => {
  let kayıtsızROL = ayarlar.kayıtsızROL;
  if (member.bot) return;
  member.roles.add(kayıtsızROL);
});

/// kayıtsız rolü son
//splashen

//splashen

// BOT OTOROL

client.on("guildMemberAdd", async member => {
  //splashen
  if (member.user.bot) {
    const botROL = ayarlar.botROL;
    member.roles.add(botROL);
  }
});
// GİRİŞ

client.on("guildMemberAdd", member => {
  const moment = require("moment");
  const kanal = ayarlar.giriskanal;
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
  const tarih = new Date().getTime() - user.createdAt.getTime();
  const embed = new Discord.MessageEmbed();
  let rol = ayarlar.kayıtsızROL;
  member.roles.add(rol); //splashen

  var kontrol;
  if (tarih < 1296000000)
    kontrol = "<a:onay1:799286222915895337> Bu Kullanıcı **Şüpheli**";
  if (tarih > 1296000000)
    kontrol = "<a:onay:799286550009085953> Bu Kullanıcı **Güvenli**";
  moment.locale("tr");
  let kanal1 = client.channels.cache.find(x => x.id === kanal);
  let giris = new Discord.MessageEmbed()
    .setDescription(
      `
 » • <a:ucgen:799290966653009930> Hoşgeldin ${member}
 
 » • <a:sonsuz:799290877138173993> Seninle birlikte **${
   member.guild.memberCount
 }** kişiyiz.
 
 » • <a:isaretforevers:795598101141258260> [ **${
   ayarlar.tag
 }** ] Tagımızı alarak bize destek olabilirsin.
 
 » • <a:ucgen:799290966653009930> <@&${
   ayarlar.yetkiliROL
 }> rolündekiler seninle ilgilenecektir.
 
 » •   ${kontrol} 
 
 » • <a:sonsuz:799290877138173993> Hesabın Oluşturulma Tarihi: \n • \` ${moment(
   member.user.createdAt
 ).format("YYYY DD MMMM dddd (hh:mm:ss)")} \`
 
 » • <a:elmas:799291018813767700> Ses teyit odasında kaydınızı yaptırabilirsiniz. 

`
    ) //splashen
    .setImage(
      "https://media.discordapp.net/attachments/736212915266388079/783761380641734737/C_.gif"
    )
    .setTimestamp();

  client.channels.cache
    .find(x => x.id === kanal)
    .send(`<@&${ayarlar.yetkiliROL}>`);
  client.channels.cache.find(x => x.id === kanal).send(giris);
});
//Forevers



///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////

//-----------------------------------Sese Girme--------------------------------\\


client.on('ready', ()  => {
let kanal = client.channels.cache.get("801362496815366164")
if(kanal === undefined){
console.log("kanalı bulamıyorum.")
} else {
kanal.join();
}
})


//-----------------------------------Son--------------------------------\\




//-----------------------------------Guard-------------------------------\\



//------------------------KANAL KORUMA-----------------------------\\

client.on("channelDelete", async channel => {
  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());
  if (entry.executor.id === client.user.id) return;
//  if (entry.executor.id === channel.guild.owner.id) return
  if(ayarlar.korumakanal) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Bir Kanal Silindi!");
    embed.addField("Kanalı Silen", "> `" + entry.executor.tag + "`");
    embed.addField("Kanalı Silen İD", "> `" + entry.executor.id + "`");
    embed.addField("Silinen Kanal", "> `" + channel.name + "`");
    embed.addField("Sonuç;", "Kanal Tekrar Açıldı");
    embed.setThumbnail(entry.executor.avatarURL());
    embed.setFooter(channel.guild.name, channel.guild.iconURL());
    embed.setColor("RED");
    embed.setTimestamp();
    client.channels.cache
      .get(ayarlar.korumakanal)
      .send(embed)
      .then(channel.clone().then(x => x.setPosition(channel.position)));
  }
});

//---------------------------ROL KORUMA------------------------------\\

client.on("roleDelete", async role => {
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  if (entry.executor.id === client.user.id) return;
 // if (entry.executor.id === role.guild.owner.id) return
  if (ayarlar.korumakanal) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Bir Rol Silindi!");
    embed.addField("Rolü Silen", "> `" + entry.executor.tag + "`");
    embed.addField("Rolü Silen İD", "> `" + entry.executor.id + "`");
    embed.addField("Silinen Rol", "> `" + role.name + "`");
    embed.addField("Sonuç;", "Rol Tekrar Açıldı");
    embed.setThumbnail(entry.executor.avatarURL());
    embed.setFooter(role.guild.name, role.guild.iconURL());
    embed.setColor("RED");
    embed.setTimestamp();
    client.channels.cache
      .get(ayarlar.korumakanal)
      .send(embed)
      .then(
        role.guild.roles.create({
          data: {
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            permissions: role.permissions,
            mentionable: role.mentionable,
            position: role.position
          },
          reason: "Silinen Rol Açıldı."
        })
      );
  }
});

//-----------------------LOG------------------------\\

client.on("messageDelete", function(msg) {
  let Embed = new Discord.MessageEmbed()
    .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
    .setDescription(`
    Mesaj Sahibi:
    > <@${msg.author.id}>
    Mesaj İçeriği:
    > ${msg.content}
    `)
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter("User: " + msg.author.id + " | Guild: " + msg.guild.id);
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});
client.on("messageUpdate", function(oldMsg, newMsg) {
  if(newMsg.author.bot) return
  let Embed = new Discord.MessageEmbed()
    .setAuthor(newMsg.author.tag, newMsg.author.displayAvatarURL({ dynamic: true }))
    .setDescription(`
    Mesaj Sahibi:
    > <@${newMsg.author.id}>
    Mesaj Linki:
    > [Tıkla](${newMsg.url})
    Eski Mesaj: 
    > ${oldMsg.content}
    Yeni Mesaj: 
    > ${newMsg.content}
    `)
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter("User: " + newMsg.author.id + " | Guild: " + newMsg.guild.id);
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});
client.on("channelCreate", function(channel) {
  let Embed = new Discord.MessageEmbed()
    .setAuthor(channel.guild.name, "https://cdn.discordapp.com/avatars/" +channel.guild.id +"/" + channel.guild.icon)
    .setDescription(`
   **Bir Kanal Oluşturuldu**
   
   > Adı: \`${channel.name}\`
   > IDsi: \`${channel.id}\`
   > Pozisyonu: \`${channel.position}\`
    `)
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter("Guild: " + channel.guild.name);
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});

client.on("guildBanAdd", function(guild, member) {
  let Embed = new Discord.MessageEmbed()
    .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
    .setDescription("**Kişi Banlandı:**:\n" + member.tag)
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter("User: " + member.id + " | Guild: " + guild.id);
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});
client.on("guildBanRemove", function(guild, member) {
  let Embed = new Discord.MessageEmbed()
    .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
    .setDescription("**Kişinin Banı Açıldı:**:\n" + member.tag)
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter("User: " + member.id + " | Guild: " + guild.id);
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});
client.on("inviteCreate", function(invite) {
  let sınır = invite.temporary
  if(sınır === false) {
  sınır = "Hayır"
    } else if(sınır === true) {
  sınır = "Evet"
      }
  let Embed = new Discord.MessageEmbed()
    .setAuthor(invite.guild.name, invite.guild.iconURL({ dynamic: true }))
    .setDescription("**Oluşturulan Davet:** " + invite.url)
    .addField("Açan:", "```" + invite.inviter.tag + "```", true)
    .addField("Kanal:", "```" + invite.channel.name + "```", true)
   // .addField(":", "```" + invite.memberCount + "```", true)
    .addField("Kullanım Sayısı:", "```" + invite.uses + "```", true)
    .addField("Max Age:", "```" + invite.maxAge + "```", true)
    .addField("Sınırsız mı", "```" + sınır + "```", true)
    .addField("Bitiş Tarihi:", "```" + invite.expiresAt + "```")
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter(
      "Oluşturan: " + invite.inviter.tag + " | Guild: " + invite.guild.id,
      invite.inviter.displayAvatarURL({ dynamic: true })
    );
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});

client.on("roleUpdate", function(oldRole, newRole) {
  console.log(oldRole.permissions)
  let Embed = new Discord.MessageEmbed()
    .setAuthor(newRole.guild.name, newRole.guild.iconURL({ dynamic: true }))
    .setDescription(`
    **Bir Rol Güncellendi**
    
    > **Eski Hali**
    Adı: \`${oldRole.name}\`
    Rengi: \`${oldRole.color}\`
    Yetkileri: \`${oldRole.permissions.bitfield}\`
    
    > **Yeni Hali**
    Adı: \`${newRole.name}\`
    Rengi: \`${newRole.color}\`
    Yetkileri: \`${newRole.permissions.bitfield}\`
    `)
    //.addField("Changes:", "Will be done soon")
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter("Guild: " + newRole.guild.id);
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});

client.on("roleCreate", function(role) {
  let Embed = new Discord.MessageEmbed()
    .setAuthor(role.guild.name, role.guild.iconURL({ dynamic: true }))
    .setDescription(`
    **Bir Rol Oluşturuldu**
    Adı: \`${role.name}\`
    Rengi: \`${role.color}\`
    Yetkileri: \`${role.permissions.bitfield}\`
    `)
    .setTimestamp()
    .setColor(ayarlar.embed_color)
    .setFooter("Guild: " + role.guild.id);
  client.channels.cache.get(ayarlar.kanal).send(Embed);
});

client.on("emojiDelete", async emoji => {
  const embed = new Discord.MessageEmbed()
  .setDescription(`
  **Bir Emoji Silindi**
  
  Emoji Adı:
  > ${emoji.name}
  Emoji:
  > ${emoji}
  Emoji Linki:
  > [Tıkla](${emoji.url})
  Emoji ID:
  > ${emoji.id}
  `)
  .setThumbnail(emoji.url)
  .setColor(ayarlar.embed_color)
  client.channels.cache.get(ayarlar.kanal).send(embed)
  })

client.on("emojiCreate", async emoji => {
  const embed = new Discord.MessageEmbed()
  .setDescription(`
  **Bir Emoji Oluşturuldı**
  
  Emoji Adı:
  > ${emoji.name}
  Emoji:
  > ${emoji}
  Emoji Linki:
  > [Tıkla](${emoji.url})
  Emoji ID:
  > ${emoji.id}
  `)
  .setThumbnail(emoji.url)
  .setColor(ayarlar.embed_color)
  client.channels.cache.get(ayarlar.kanal).send(embed)
  })

//-----------------------------------Son--------------------------------\\




//-----------------------------------Son--------------------------------\\






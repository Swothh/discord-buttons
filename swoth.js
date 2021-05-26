const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

let OWNER_ID = "buton oluşturcak kişinin idsi",
    TOKEN = "bot tokeniniz";

client.ws.on('INTERACTION_CREATE', async int => {
  if (int.member.user.id !== OWNER_ID) {
    if (client['used_' + int.member.user.id]) {
      return client.channels.cache.get(int.channel_id).send('> Tekrar basmak için `5 saniye` bekleyiniz!');
    };
  };
  
  client.api.interactions(int.id, int.token).callback
    .post({
        data: {
            type: 4,
            data: {
                content: '> (<@' + int.member.user.id + '>) ``Aktif olduğun platformlar:`` ' + Object.keys(client.users.cache.get(int.member.user.id).presence.clientStatus).map(x => x).join(', ')
            }
        }
    });
  
  client['used_' + int.member.user.id] = true;
  setTimeout(() => delete client['used_' + int.member.user.id], 5000);
});

client.on('ready', () => {
  console.log('Logged in!');
  client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!send')) return;
    if (message.author.id !== OWNER_ID) return message.channel.send('> Yetersiz yetki!');
    
    fetch('https://discord.com/api/v9/channels/' + message.channel.id + '/messages', {
        method: "POST",
        body: JSON.stringify({"content": '> Aktif olduğun platformları görmek için tıkla**:**',
            "components": [{
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Tıkla",
                        "style": 3,
                        "custom_id": message.id
                    }
                ]

            }]}),
        headers: {
            "Authorization": 'Bot ' + client.token,
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(() => {
      message.react('✅')
    });
  })
});

client.login(TOKEN);

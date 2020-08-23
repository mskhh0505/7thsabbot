const discord = require('discord.js')
const nbx = require('noblox.js')
const client = new discord.Client()
const token = process.env.token;
const cookie = process.env.cookie;
const prefix = "!";
const groupid = 4483539;
const maximumRank = 9;
client.login(token)
function login(){
    return nbx.cookieLogin(cookie);
}
login()
    .then(function(){
        console.log('Logged in.')
    }).catch(function(error){
        console.log(`login error: ${error}`)
    });
client.on('ready', () => {
    client.user.setActivity('Looking at SeohyunCore')
    console.log(`ready ${client.guilds.size} servers.`)
});
function isCommand(command, message){
    var command = command.toLowerCase()
    var content = message.content.toLowerCase()
    return content.startsWith(prefix + command)
}
client.on('message', (message) => {
    if (message.author.bot) return;
    var args = message.content.split(/[ ]+/)
    if (isCommand('진급', message)){
        var username = args[1]
        if (username){
            if (message.member.roles.find(role => role.name === "Bot access")){
                nbx.getIdFromUsername(username)
                .then(function(id){
                nbx.getRankInGroup(groupid, id)
                    .then(function(rank){
                        if (maximumRank <= rank){
                            message.reply('봇의 권한보다 높은 사람을 올릴 수 없습니다.')
                        } else{
                            nbx.promote(groupid, id)
                                .then(function(roles){
                                const embed = new discord.RichEmbed()
                                    .setTitle('성공적으로 진급하였습니다.')
                                    .setColor('#04FB46')
                                    .addField('유저 닉네임', `${username}`)
                                    .addField('유저 프로필', `https://www.roblox.com/users/${id}/profile`)
                                    .addField('전 계급', `${roles.oldRole.name}`, true)
                                    .addField('새로운 계급', `${roles.newRole.name}`, true)
                                    .setTimestamp()
                                    .setFooter('SeohyunCore')
                                    message.channel.send(embed)
                                }).catch(function(err){
                                    message.reply('존재 하지 않는 닉네임입니다.')
                                });
                        }
                    }).catch(function(err){
                        message.reply('유저가 그룹에 존재하지않습니다.')
                    });
                }).catch(function(err){
                    message.reply('존재 하지 않는 닉네임입니다.')
                });
            }else{
                message.reply('관리자전용 명령어입니다 *서현_#9210* 으로 연락주세요.')
            }
        } else{
            message.reply('로블록스 닉네임을 입력해주세요.')
        }
    }
    if (isCommand('강등', message)){
        var username = args[1]
        if (username){
            if (message.member.roles.find(role => role.name === "Bot access")){
                nbx.getIdFromUsername(username)
                .then(function(id){
                nbx.getRankInGroup(groupid, id)
                    .then(function(rank){
                        if (maximumRank < rank){
                            message.reply('봇의 권한보다 높은 사람을 내릴 수 없습니다.')
                        } else{
                            nbx.demote(groupid, id)
                                .then(function(roles){
                                const embed = new discord.RichEmbed()
                                    .setTitle('성공적으로 강등하였습니다.')
                                    .setColor('#B40404')
                                    .addField('유저 닉네임', `${username}`)
                                    .addField('유저 프로필', `https://www.roblox.com/users/${id}/profile`)
                                    .addField('전 계급', `${roles.oldRole.name}`, true)
                                    .addField('새로운 계급', `${roles.newRole.name}`, true)
                                    .setTimestamp()
                                    .setFooter('SeohyunCore')
                                    message.channel.send(embed)
                                }).catch(function(err){
                                    message.reply('존재 하지 않는 닉네임입니다.')
                                });
                        }
                    }).catch(function(err){
                        message.reply('유저가 그룹에 존재하지않습니다.')
                    });
                }).catch(function(err){
                    message.reply('존재 하지 않는 닉네임입니다.')
                });
            }else{
                message.reply('관리자전용 명령어입니다 *서현_#9210* 으로 연락주세요.')
            }
        } else{
            message.reply('로블록스 닉네임을 입력해주세요.')
        }
        if(message.content.startsWith('!청소')) {
            if(checkPermission(message)) return
        
            var clearLine = message.content.slice('!청소 '.length);
            var isNum = !isNaN(clearLine)
        
            if(isNum && (clearLine <= 0 || 100 < clearLine)) {
              message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
              return;
            } else if(!isNum) { // c @서현_ 3
              if(message.content.split('<@').length == 2) {
                if(isNaN(message.content.split(' ')[2])) return;
        
                var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
                var count = parseInt(message.content.split(' ')[2])+1;
                const _limit = 10;
                let _cnt = 0;
        
                message.channel.fetchMessages({limit: _limit}).then(collected => {
                  collected.every(msg => {
                    if(msg.author.id == user) {
                      msg.delete();
                      ++_cnt;
                    }
                    return !(_cnt == count);
                  });
                });
              }
            } else {
              message.channel.bulkDelete(parseInt(clearLine)+1)
                .then(() => {
                  AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
                })
                .catch(console.error)
            }
          }
        }
        function checkPermission(message) {
          if(!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
            return true;
          } else {
            return false;
          }
        }
        
        function changeCommandStringLength(str, limitLen = 8) {
          let tmp = str;
          limitLen -= tmp.length;
        
          for(let i=0;i<limitLen;i++) {
              tmp += ' ';
          }
        
          return tmp;
        }
        
        async function AutoMsgDelete(message, str, delay = 3000) {
          let msg = await message.channel.send(str);
        
          setTimeout(() => {
            msg.delete();
          }, delay);
        }
});

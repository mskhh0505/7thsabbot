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
    client.user.setActivity("서현이 잠자러감 24시간 봇이예요.")
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
                            message.reply('봇의 권한보다 높은 사람을 내릴 수 없습니다.')
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
    }
});
        // listening event for the search command to receive a prompt to seacrh
client.on("message", message => {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    
    if (command === "정보") {
      let username = args[0]
      
      // if a username is supplied successfully
      if (username) {
          nbx.getIdFromUsername(username).then(id => {
            
            // if an identity is found under the username then continue collecting the rest of the data
            // sadly this means you can't search for banned users. f in the chat. maybe try using older apis
            // yes, i just did c# styled bracketing, do not mind me trying to bless your eyes
            
            if (id) 
  
            {
              // next conditio
              nbx.getPlayerInfo(parseInt(id)).then(function(info) 
              {
                // dates.. um. go try get a pear or a grape instead.
                let date = new Date(info.joinDate)
                
                // create new embed and establish some settings for it, tasty.
                let embed = new discord.RichEmbed()
                .setColor("#f9ae00") // sets the color of the embed
                .setURL(`https://roblox.com/users/${id}/profile`) // base link, changed by the variables 'id'
                .setTimestamp()
                .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`) // gets the roblox profile picture
                .addField("유저 닉네임", `[${username}](https://www.roblox.com/users/${id}/profile)`) // everything in the embed is undefined, therefore can be changed by the variables
                .addField("유저 아이디", id || '아무것도 없습니다.', true)
                .addField("설명", info.blurb || '아무 것도 없습니다.', true)
                .addField("소개", info.status || '아무것도 없습니다.', true)
                .addField("계정 일 수", `${info.age} days old` || 'Unresolvable')
                message.channel.send({embed})
              })
            }
          // but what if the player is banned, or doesn't even exist?
          // houston, we have a problem.
          }).catch(function (err) {
           message.channel.send("유저 이름을 찾을 수 없습니다 확인 후 재 입력해주세요.") // catching error
         });  
      } else { message.channel.send("양식에 맞춰 입력해주세요. !정보 닉네임") }
    }
  });

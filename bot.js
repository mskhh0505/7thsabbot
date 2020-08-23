const discord = require('discord.js')
const nbx = require('noblox.js')
const client = new discord.Client()
const token = process.env.token;
const cookie = process.env.cookie
const prefix = "!";
const groupid = 4483539;
const maximumRank = 9;
const more = nbx.getBlurb(data.id)
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
    client.user.setActivity('ㅇㅇ')
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
                                    .addField('유저 닉네임', `${more}`)
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

const discord = require('discord.js')
const nbx = require('noblox.js')
const client = new discord.Client()
const token = 'NzQ1MjA4NzY4NzEwODM2MjU0.Xzubvw.xX4S6pS9S5O7q8KCF7eYlScekZg';
const cookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_639992B7F04201BEEA5172D5F38AF77D33A1BA3046C6CEA78C27C9828997CB6AE844F50FC6D224B4A248A6B562E097CE8A5E791303C7FC17BE30029B609A28193C1E84F3457238FEBBF63573A666389974AE28FE4FF54A178042B54AE01A62952A1202F1A5293A2ABE4DFBE3FD49FD10E5DD22525C101009C323B5E21D3F9D483E93C63C0B7EEE7B6B3571F679CBB309A14C8C2F9E7A5DF426202FEC6F1F34A4AAC494BD33610A389EB36519A88E54C8133C9B86D446DE19EE0774B24192F9B706A01720A7F17802733DE1AD57D558864E11A291E8E30093D212CCCD2D57BAB41FE9346ED82AB47BA0B98C59064DA5C2FC7AC1E81905B70369F61F8415F28F259D8149939D651752F6EA62459B7533FAFE7326001C1B964BD8E5645B1B03BA68E87F0B46FE542A05F57822D6060EF93CD041EEC1'
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
    }
});

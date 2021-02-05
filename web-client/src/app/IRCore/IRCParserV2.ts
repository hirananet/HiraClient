import { Join } from './dto/Join';
import { PartHandler } from './handlers/Part.handler';
import { KickInfo } from './dto/KickInfo';
import { KickHandler } from './handlers/Kick.handler';
import { Away } from './dto/Away';
import { NewMode } from './dto/NewMode';
import { GmodeHandler } from './handlers/Gmode.handler';
import { Channel } from './dto/Channel';
import { ChannelListHandler } from './handlers/ChannelList.handler';
import { WhoIsHandler } from './handlers/Whois.handler';
import { WhoHandler } from './handlers/Who.handler';
import { Who } from './dto/Who';
import { UModes } from './utils/UModes.utils';
import { UsersHandler } from './handlers/Users.handler';
import { UserInChannel } from './dto/UserInChannel';
import { ListHandler } from './handlers/List.handler';
import { ChannelInfo } from './dto/ChannelInfo';
import { StatusHandler } from './handlers/Status.handler';
import { NickChange } from './dto/NickChange';
import { IRCMessage, OriginData } from './utils/IRCMessage.util';
import { ModeHandler } from './handlers/Mode.handler';
import { User } from './dto/User';
import { AwayHandler } from './handlers/Away.handler';
import { IgnoreHandler } from './handlers/Ignore.Handler';
import { MotdHandler } from './handlers/Motd.handler';
import { ChannelStatusHandler } from './handlers/ChannelStatus.handler';
import { Part } from './dto/Part';
import { QuitHandler } from './handlers/Quit.handler';
import { Quit } from './dto/Quit';
import { JoinHandler } from './handlers/Join.handler';
import { ServerHandler } from './handlers/Server.handler';
import { MessageHandler } from './handlers/Message.handler';
import { IndividualMessage, IndividualMessageTypes } from './dto/IndividualMessage';
import { Time } from './utils/Time.util';
import { ModeratedHandler } from './handlers/Moderated.handler';

export class IRCParserV2 {

  public static parseMessage(message: string): IRCMessage[] {
      const out = [];
      message.split('\r\n').forEach(msgLine => {
          const r = /:([^:]+):?(.*)/.exec(msgLine);
          const TAG = r[1];
          const MSG = r[2];
          const partials = TAG.split(' ');
          const im = new IRCMessage();
          im.body = MSG;
          im.tag = TAG;
          im.partials = partials;
          im.code = partials[1];
          const target = /([^!]*!)?([^@]+@)?(.*)/.exec(partials[0]);
          const od = new OriginData();
          if (!target[2]) {
              od.server = target[1];
              im.simplyOrigin = od.server;
          } else if (!target[3]) {
              od.server = target[2];
              od.identitity = target[1].slice(0, target[1].length - 1);
              im.simplyOrigin = od.identitity;
          } else {
              od.server = target[3];
              od.identitity = target[2].slice(0, target[1].length - 1);
              od.nick = target[1].slice(0, target[1].length - 1);
              im.simplyOrigin = od.nick;
          }
          im.origin = od;
          im.target = partials[2];
          im.message = MSG;
          out.push(im);
      });
      return out;
  }

  public static processMessage(parsedMessage: IRCMessage, rawMessage: string, actualNick: string): void {

    if (parsedMessage.code === '319') { // lista de canales
      const chnlList = [];
      parsedMessage.message.split(' ').forEach(pmChnl => {
        const chnl = new Channel(pmChnl);
        chnlList.push(chnl);
      });
      ChannelListHandler.setChannelList(parsedMessage.partials[3], chnlList);
      return;
    }

    if (parsedMessage.code === '718') {
      // :avalon.hira.io 718 Tulkalex Tulkaz ~Harkito@net-j7j.cur.32.45.IP :is messaging you, and you have user mode +g set.
      // Use /ACCEPT +Tulkaz to allow.
      GmodeHandler.privateRequest(parsedMessage.partials[3]);
      return;
    }

    if (parsedMessage.code === '378') {
      // connecting from
      // :avalon.hira.io 378 Tulkalex Tulkalex :is connecting from ~Tulkalandi@167.99.172.78 167.99.172.78
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'connectedFrom', parsedMessage.body.replace('is connecting from ', ''));
      return;
    }
    if (parsedMessage.code === '312') {
      // server desde donde está conectado
      // :avalon.hira.io 312 Tulkalex Tulkalex avalon.hira.io :Avalon - Frankfurt, Germany
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'server', parsedMessage.body);
      return;
    }
    if (parsedMessage.code === '313') {
      // :avalon.hira.io 313 Tulkalex Tulkalex :is a GlobalOp on Hira
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'isGOP', true);
      return;
    }
    if (parsedMessage.code === '379') {
      // :avalon.hira.io 379 Tulkalex Tulkalex :is using modes +Iiow
      const modes = parsedMessage.body.split(' ');
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'modes', modes[modes.length - 1]);
      return;
    }
    if (parsedMessage.code === '330') {
      // :avalon.hira.io 330 Tulkalex Tulkalex alexander1712 :is logged in as
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'userAccount', parsedMessage.partials[4]);
      return;
    }
    if (parsedMessage.code === '671') {
      // :avalon.hira.io 671 Tulkalex Tulkalex :is using a secure connection
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'isSecured', true);
      return;
    }
    if (parsedMessage.code === '317') {
      // :avalon.hira.io 317 Tulkalex Tulkalex 6318 1602266231 :seconds idle, signon time
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'idle', parsedMessage.partials[4]);
      WhoIsHandler.addWhoisPartial(parsedMessage.partials[3], 'lastLogin', parsedMessage.partials[5]);
      return;
    }

    if (parsedMessage.code === '318') {
      WhoIsHandler.finalWhoisMessage(parsedMessage.partials[3]);
      return;
    }

    if (parsedMessage.code === '352') { // user info (WHO response)
      const data = WhoHandler.WHOUserParser(rawMessage);
      if (data) {
        const whoData = new Who();
        whoData.serverFrom = data[7];
        whoData.nick = data[8];
        whoData.isAway = data[9] === 'G';
        whoData.isNetOp = data[10] === '*';
        whoData.rawMsg = rawMessage;
        const mod = data[11];
        if (mod === '~') {
          whoData.mode = UModes.FOUNDER;
        } else if (mod === '&') {
          whoData.mode = UModes.ADMIN;
        } else if (mod === '@') {
          whoData.mode = UModes.OPER;
        } else if (mod === '%') {
          whoData.mode = UModes.HALFOPER;
        } else if (mod === '+') {
          whoData.mode = UModes.VOICE;
        }
        WhoHandler.addWhoData(data[8], whoData);
      } else {
        console.error('BAD WHO RESPONSE PARSED: ', rawMessage, data);
      }
      return;
    }

    if (parsedMessage.code === '353') { // names
      const channel = UsersHandler.getChannelOfMessage(rawMessage);
      const users = parsedMessage.message.trim().split(' ');
      const usersInChannel: UserInChannel[] = [];
      users.forEach(user => {
        usersInChannel.push(new UserInChannel(user, channel));
      });
      const chnlObj = new Channel(channel);
      UsersHandler.addUsersToChannel(chnlObj.name, usersInChannel);
      return;
    }

    // 321 inicio lista de canales (borrar)
    if (parsedMessage.code === '321') {
      ListHandler.newChannelList();
      return;
    }

    // 322 canal de lista de canales
    if (parsedMessage.code === '322') {
      ListHandler.addChannels(new ChannelInfo(parsedMessage.partials[3], parsedMessage.body));
      return;
    }

    if (parsedMessage.code === '433') { // nick already in use
      // TODO: obtener nick anterior.
      StatusHandler.onNickAlreadyInUse('');
      return;
    }

    if (parsedMessage.code === '474') {
      // TODO: obtener canal.
      StatusHandler.onBanned('');
      return;
    }

    if (parsedMessage.code === 'NICK') {
      StatusHandler.onNickChanged(
        new NickChange(parsedMessage.simplyOrigin, parsedMessage.target ? parsedMessage.target : parsedMessage.message)
      );
      return;
    }

    if (parsedMessage.code === 'MODE') {
      const mode = ModeHandler.modeParser(rawMessage);
      if(mode[3]) {
        const nmode = new NewMode();
        nmode.userTarget = new User(mode[3]);
        nmode.channelTarget = parsedMessage.target;
        nmode.modeAdded = mode[1] === '+';
        nmode.mode = mode[2];
        ModeHandler.changeMode(nmode);
      } else {
        const nmode = new NewMode();
        nmode.channelTarget = parsedMessage.target;
        nmode.userTarget = new User(parsedMessage.target);
        nmode.mode = mode[2];
        ModeHandler.changeMode(nmode);
      }
      return;
    }

    if (parsedMessage.code === '301') { // away message
      const away = new Away();
      away.author = parsedMessage.partials[3];
      away.message = parsedMessage.message;
      AwayHandler.onAway(away);
      return;
    }

    if (parsedMessage.code === '716') { // server side ignored
      const ignore = new Away();
      ignore.author = parsedMessage.partials[3];
      ignore.message = parsedMessage.message;
      IgnoreHandler.onIgnore(ignore);
    }

    if (parsedMessage.code === '464') {
      MotdHandler.requirePasswordResponse.emit(parsedMessage);
      return;
    }

    if (parsedMessage.code === '404') {
      ModeratedHandler.channelModerated.emit(parsedMessage);
      return;
    }

    if (parsedMessage.code === '375') {
      MotdHandler.motdResponse.emit(parsedMessage);
      return;
    }

    if (parsedMessage.code === 'PONG') {
      return;
    }

    if (parsedMessage.code === 'NOTICE') {
      if (parsedMessage.simplyOrigin && parsedMessage.simplyOrigin !== '*status' && parsedMessage.target[0] === '#') {
        const message = new IndividualMessage();
        message.messageType = IndividualMessageTypes.NOTIFY;
        message.author = parsedMessage.simplyOrigin;
        message.message = parsedMessage.message;
        message.meAction = false;
        message.channel = parsedMessage.target;
        message.time = Time.getTime();
        message.date = Time.getDateStr();
        MessageHandler.onMessage(message);
        return;
      } else {
        ServerHandler.onServerNoticeResponse(parsedMessage);
        return;
      }
    }

    if (parsedMessage.code === '332') {
      const channels = ChannelStatusHandler.findChannels(rawMessage);
      ChannelStatusHandler.setChannelTopic(channels[0], parsedMessage.message);
      return;
    }

    if (parsedMessage.code === 'TOPIC') {
      ChannelStatusHandler.setChannelTopic(parsedMessage.target, parsedMessage.message);
      return;
    }

    if (parsedMessage.code === '315') {
      // TODO: check this... End of who
      return;
    }

    if (parsedMessage.code === 'KICK') {
      let channel = parsedMessage.target;
      const kickData = KickHandler.kickParse(rawMessage);
      const kickInfo = new KickInfo();
      kickInfo.channel = new Channel(channel);
      kickInfo.operator = parsedMessage.message;
      kickInfo.userTarget = new User(kickData[2]);
      KickHandler.onKick(kickInfo);
    }

    if (parsedMessage.code === 'PART') {
      // :Harko!~Harkolandia@harkonidaz.irc.tandilserver.com PART #SniferL4bs :"Leaving"
      let channel = parsedMessage.target;
      if (!channel) {
        channel = parsedMessage.message;
      }
      const part = new Part();
      part.channel = new Channel(channel);
      part.message = parsedMessage.message;
      part.user = new User(parsedMessage.simplyOrigin);
      PartHandler.onPart(part);
    }

    if (parsedMessage.code === 'QUIT') {
      QuitHandler.onQuit(new Quit(parsedMessage.simplyOrigin));
    }

    if (parsedMessage.code === 'JOIN') {
      const join = new Join();
      const channel = parsedMessage.message ? parsedMessage.message : parsedMessage.target;
      join.channel = new Channel(channel);
      join.user = new User(parsedMessage.simplyOrigin);
      join.origin = parsedMessage.origin;
      JoinHandler.onJoin(join);
    }

    if (parsedMessage.code === 'PRIVMSG') {
      const meMsg = MessageHandler.getMeAction(parsedMessage);
      const message = new IndividualMessage();
      message.author = parsedMessage.simplyOrigin;
      if (meMsg) {
        message.message = meMsg[1];
        message.meAction = true;
      } else {
        message.message = parsedMessage.message;
        message.meAction = false;
      }
      message.time = Time.getTime();
      message.date = Time.getDateStr();
      if (parsedMessage.target === actualNick) { // privado
        message.messageType = IndividualMessageTypes.PRIVMSG;
      } else {
        message.messageType = IndividualMessageTypes.CHANMSG;
        message.channel = parsedMessage.target;
      }
      message.mention = message.message ? message.message.indexOf(actualNick) >= 0 : false;
      MessageHandler.onMessage(message);
      return;
    }

    ServerHandler.onServerResponse(parsedMessage);
    return;
  }

}

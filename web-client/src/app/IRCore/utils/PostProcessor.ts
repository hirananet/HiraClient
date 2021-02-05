import { EmoteList } from './EmoteList';
import { ValidRegex } from './validRegex';

export class PostProcessor {

  public static processMessage(message: string, author: string, me: string): MessageWithMetadata {
    const mwm = new MessageWithMetadata();

    const youtubeLink = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/.exec(message);
    if (youtubeLink) {
      message = message.replace(youtubeLink[0], '');
      mwm.youtube = youtubeLink[5];
    }
    const imageLink = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|gif|png)/.exec(message);
    if (imageLink) {
      message = message.replace(imageLink[0], '');
      mwm.image = imageLink[0];
    }
    const otherLink = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/.exec(message);
    if (otherLink) {
      message = message.replace(otherLink[0], '');
      mwm.link = otherLink[0];
    }
    const quote = /^<([^>]+)>\s([^|]+)\|?(.*)$/.exec(message);
    if (quote) {
      mwm.quote = {
        author: quote[1],
        originalMessage: quote[2]
      };
      message = quote[3];
    }

    // prevent XSS:
    const temp = document.createElement('div');
    temp.textContent = message;
    message = temp.innerHTML;
    // end of xss prevention

    // replacing memes
    const faces = message.match(/:([a-zA-Z0-9]+):/g);
    if (faces) {
      faces.forEach(face => {
        const realName = face.replace(':', '').replace(':', '');
        const realLocation = EmoteList.getFace(realName, author);
        if (realLocation) {
          message = message.replace(face, '<img src="' + realLocation + '" class="faceEmote ' + realName + '" data-name="' +
                                          realName + '" title=":' + realName + '" alt=":' + realName + '"/>');
        }
      });
    }

    const memes = message.match(/;([a-zA-Z0-9]+);/g);
    if (memes) {
      memes.forEach(meme => {
        const realName = meme.replace(';', '').replace(';', '');
        const realLocation = EmoteList.getMeme(realName, author);
        if (realLocation) {
          message = message.replace(meme, '<img src="' + realLocation + '" class="memeEmote ' + realName + '" data-name="' + realName +
                                          '" title=";' + realName + '" alt=";' + realName + '"/>');
        }
      });
    }

    mwm.message = PostProcessor.processPings(message, me);
    return mwm;
  }

  public static processPings(mwm: string, me: string) {
    const regex = ValidRegex.getRegex(ValidRegex.pingRegex(me));
    const result = regex.exec(mwm);
    if(result) {
      mwm = '';
      if(result[1]) {
        mwm += result[1];
      }
      if(result[2]) {
        mwm += result[2];
      }
      mwm += '<b class="ping">' + result[3] + '</b>';
      if(result[4]) {
        mwm += result[4];
      }
      if(result[5]) {
        mwm += result[5];
      }
      mwm = mwm.replace(', ,', ',');
    }
    return mwm;
  }

  public static deconverHTML(msg: string): string {
    const matchs = msg.match(/\<img\ssrc\=\"([^"]+)\"\sclass\=\"([^"]+)\"\sdata-name="([^"]+)"\stitle="([^"]+)"\salt="([^"]+)"\/\>/g);
    if (matchs) {
      matchs.forEach(match => {
        const data = /\<img\ssrc\=\"([^"]+)\"\sclass\=\"([^"]+)\"\sdata-name="([^"]+)"\stitle="([^"]+)"\salt="([^"]+)"\/\>/.exec(match);
        msg = msg.replace(data[0], data[4]);
      });
    }
    return msg;
  }

  public static processUserMetadata(user: string): UserWithMetadata {
    const mod = user[0];
    if (mod === '~' ||
        mod === '&' ||
        mod === '@' ||
        mod === '%' ||
        mod === '+') {
      user = user.slice(1);
    }
    const out = new UserWithMetadata();
    out.nick = user;
    if (mod === '~') {
      out.status = UserStatuses.FOUNDER;
    } else if (mod === '&') {
      out.status = UserStatuses.NET_OPERATOR;
    } else if (mod === '@') {
      out.status = UserStatuses.OPERATOR;
    } else if (mod === '%') {
      out.status = UserStatuses.HALF_OPERATOR;
    } else if (mod === '+') {
      out.status = UserStatuses.VOICE;
    }
    return out;
  }

}


export class UserWithMetadata {
  public nick: string;
  public status: UserStatuses;
  public isNetOp?: boolean;
  public randomB?: boolean;
  public away?: boolean;
  public serverConnected?: string;
}

export class MessageWithMetadata {
  public message: string;
  public youtube?: string;
  public image?: string;
  public link?: string;
  public quote?: QuoteMessage;
}

export class QuoteMessage {
  public author: string;
  public originalMessage: string;
}

export enum UserStatuses {
  FOUNDER = 'FOUNDER',
  NET_OPERATOR = 'NET_OPERATOR',
  OPERATOR = 'OPERATOR',
  HALF_OPERATOR = 'HALF_OPERATOR',
  VOICE = 'VOICE',
  BANNED = 'BANNED'
}

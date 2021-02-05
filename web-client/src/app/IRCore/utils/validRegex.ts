export class ValidRegex {

  public static channelRegex() {
    return '#([a-zA-Z0-9_#]+)';
  }

  public static userRegex() {
    return '([a-zA-Z_][a-zA-Z0-9_]+)'
  }

  public static actionRegex() {
    return /\x01ACTION ([^\x01]+)\x01/;
  }

  public static modeRegex() {
    return '(\\+|\-)?([a-zA-Z]+)';
  }

  public static getRegex(regex: string) {
    return new RegExp(regex);
  }

  public static pingRegex(nick: string) {
    return '^(.*(\\s|,|:))?('+nick.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+')((\\s|,|:).*)?$';
  }

}

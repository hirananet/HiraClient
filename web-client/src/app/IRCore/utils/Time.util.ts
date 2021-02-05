export class Time {
  public static getTime(): string {
    const now = new Date();
    const hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    const min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return hours + ':' + min + ':' + second;
  }

  public static getDateStr(): string {
    const now = new Date();
    const month = (now.getMonth() + 1);
    const monthStr = month < 10 ? '0' + month : month;
    const day = now.getDate();
    const dayStr = day < 10 ? '0' + day : day;
    return dayStr + '/' + monthStr + '/' + now.getFullYear();
  }
}

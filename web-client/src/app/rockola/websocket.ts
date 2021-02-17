import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

export class WebSocketHDLR {

    private wss: WebSocketSubject<string>;
    public readonly onOpenSubject = new Subject();
    public readonly onCloseSubject = new Subject();

    connect(url: string): Observable<string> {
        this.wss = webSocket<string>({
          url,
          serializer: msg => msg,
          deserializer: msg => msg.data,
          openObserver: this.onOpenSubject,
          closeObserver: this.onCloseSubject
        });
        return this.wss.asObservable();
    }

    public send(msg: string): void {
        this.wss.next(msg);
    }

    public disconnect(): void {
      this.wss.complete();
    }

}

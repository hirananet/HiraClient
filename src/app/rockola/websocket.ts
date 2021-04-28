import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { delay, retryWhen, tap } from 'rxjs/operators';

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
        return this.wss.asObservable().pipe(
          retryWhen(errors =>
            errors.pipe(
              tap(err => {
                console.error('Got error', err);
              }),
              delay(1000)
            )
          )
        );
    }

    public send(msg: string): void {
        this.wss.next(msg);
    }

    public disconnect(): void {
      this.wss.complete();
    }

}

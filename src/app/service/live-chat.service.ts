import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LiveChatService {
  private stompClient?: Client;
  private connected = false;

  constructor(private http: HttpClient) {}
loadUsers() {
  return this.http.get<any[]>('http://localhost:9090/api/chat/users');
}
loadNhanVien() {
  return this.http.get<any[]>('http://localhost:9090/api/NhanVien');
}

  connect(maNhanVien: number, onMessage: (msg: any) => void) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:9090/ws-chat'),
      reconnectDelay: 5000,

      onConnect: () => {
        this.connected = true;

        this.stompClient!.subscribe(
          `/user/${maNhanVien}/queue/messages`,
          (message: IMessage) => onMessage(JSON.parse(message.body))
        );
      },

      onDisconnect: () => {
        this.connected = false;
      },

      onStompError: (frame) => {
        console.error('STOMP error', frame.headers['message'], frame.body);
      },

      onWebSocketError: (e) => {
        console.error('WS error', e);
      }
    });

    this.stompClient.activate();
  }

  sendMessage(msg: any) {
    if (!this.stompClient || !this.connected) {
      console.warn('Chưa connect websocket nên không gửi được');
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(msg)
    });
  }

  loadHistory(u1: number, u2: number) {
    return this.http.get<any[]>(
      `http://localhost:9090/api/chat/history?u1=${u1}&u2=${u2}`
    );
  }
}

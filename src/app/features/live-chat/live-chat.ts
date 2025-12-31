import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiveChatService } from '../../service/live-chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


type ChatUser = {
  maNhanVien: number;
  tenDangNhap: string;
  vaiTro: string;
  tenHienThi?: string; // ✅ tên nhân viên
};

type ChatMsg = {
  nguoiGui: number;
  nguoiNhan: number;
  noiDung: string;
  thoiGianGui?: string;
  trangThai?: string;
};

@Component({
  selector: 'app-live-chat-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-chat.html',
  styleUrls: ['./live-chat.scss']
})
export class LiveChatPopupComponent implements OnInit, OnDestroy {
  myId = 1; // Phải thay khi lấy được mã nhân viên
  users: ChatUser[] = [];

  selectedUser: ChatUser | null = null;   
  messages: ChatMsg[] = [];
  message = '';

  isOpen = false;

  constructor(private chatService: LiveChatService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
    // mở chat thì scroll xuống cuối nếu có tin
    if (this.isOpen) setTimeout(() => this.scrollToBottom(), 0);
  }

  closeChat() {
    this.isOpen = false;
  }

  ngOnInit() {
  // load danh sách nhân viên trước để có map tên
  this.chatService.loadNhanVien().subscribe(nvList => {
    const nameMap = new Map<number, string>(
      (nvList || []).map(nv => [Number(nv.maNhanVien), nv.tenNhanVien])
    );

    // rồi load users chat
    this.chatService.loadUsers().subscribe(res => {
      this.users = (res || [])
        .filter(u => u.maNhanVien !== this.myId)
        .map(u => ({
          ...u,
          tenHienThi: nameMap.get(Number(u.maNhanVien)) || u.tenDangNhap // fallback
        }));
    });
  });

  // connect websocket 1 lần (giữ nguyên)
  this.chatService.connect(this.myId, (msg: ChatMsg) => {
    if (!this.selectedUser) return;
    const peerId = this.selectedUser.maNhanVien;

    const isThisChat =
      (msg.nguoiGui === this.myId && msg.nguoiNhan === peerId) ||
      (msg.nguoiGui === peerId && msg.nguoiNhan === this.myId);

    if (!isThisChat) return;

    const key = `${msg.nguoiGui}-${msg.nguoiNhan}-${msg.noiDung}-${msg.thoiGianGui || ''}`;
    const exists = this.messages.some(m =>
      `${m.nguoiGui}-${m.nguoiNhan}-${m.noiDung}-${m.thoiGianGui || ''}` === key
    );
    if (!exists) this.messages.push(msg);

    setTimeout(() => this.scrollToBottom(), 0);
  });
}


  ngOnDestroy() {
    // nếu service bạn có disconnect thì gọi ở đây (khuyến nghị)
    // this.chatService.disconnect?.();
  }

  openChat(u: ChatUser) {
    this.selectedUser = u;

    this.chatService
      .loadHistory(this.myId, u.maNhanVien)
      .subscribe(res => {
        this.messages = res || [];
        setTimeout(() => this.scrollToBottom(), 0);
      });
  }

  send() {
    if (!this.selectedUser) return;
    if (!this.message.trim()) return;

    const msg: ChatMsg = {
      nguoiGui: this.myId,
      nguoiNhan: this.selectedUser.maNhanVien,
      noiDung: this.message.trim(),
      thoiGianGui: new Date().toISOString(),
      trangThai: 'DANG_GUI'
    };

    // 1) hiện ngay
    this.messages.push(msg);
    setTimeout(() => this.scrollToBottom(), 0);

    // 2) gửi
    this.chatService.sendMessage(msg);

    // 3) clear input
    this.message = '';
  }

  scrollToBottom() {
    const el = document.querySelector('.z-messages') as HTMLElement | null;
    if (el) el.scrollTop = el.scrollHeight;
  }

  // tiện dùng trong template
  get peerName(): string {
    return this.selectedUser ? this.selectedUser.tenDangNhap : 'Chọn người để chat';
  }

  get peerRole(): string {
    return this.selectedUser ? this.selectedUser.vaiTro : 'Danh sách bên trái';
  }

  get peerAvatarChar(): string {
    return this.selectedUser?.tenDangNhap?.slice(0, 1)?.toUpperCase() || '💬';
  }
  
}

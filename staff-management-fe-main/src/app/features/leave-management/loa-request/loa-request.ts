import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AddLeaveRequestPopup } from './add-leave-request-popup';

import { LeaveRequestService } from '../../../service/leave-request.service';
import { LeaveDetailPopup } from './loa-detail-popup/leave-request-detail-popup';

@Component({
  selector: 'app-loa-request',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,AddLeaveRequestPopup, LeaveDetailPopup],
  templateUrl: './loa-request.html',
  styleUrls: ['./loa-request.scss'],
})
export class LoaRequest implements OnInit {

  leaveRequests: any[] = [];          
  filteredLeaveRequests: any[] = [];  
  pagedLeaveRequests: any[] = []; 
  filterKhoa = '';
  filterTime = '';
  filterStatus = '';

  page = 1;
  pageSize = 10;
  totalPages = 1;

  searchText = '';

  showAddPopup = false;
  showDetailPopup = false;
  activeMenu: number | null = null;
  
  totalRequests = 0;
  approvedRequests = 0;
  pendingRequests = 0;
  rejectedRequests = 0;

  selectedRequest: any = null;
  selectedRequests: { [key: number]: boolean } = {};
  selectedIds: number[] = [];
  selectAll = false;

  constructor(
    private leaveService: LeaveRequestService
  ) {}

  /** ================= KHỞI TẠO ================== */
   ngOnInit() {
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.leaveService.getAll().subscribe({
      next: data => {
        this.leaveRequests = data;
        this.filteredLeaveRequests = [...data];
        this.totalRequests = data.length;

        // thống kê
        this.approvedRequests = data.filter(
          x => this.STATUS_MAP[x.trangThai]?.code === 'APPROVED').length;

        this.pendingRequests = data.filter(
          x => this.STATUS_MAP[x.trangThai]?.code === 'PENDING').length;

        this.rejectedRequests = data.filter(
          x => this.STATUS_MAP[x.trangThai]?.code === 'REJECTED').length;

        // setup phân trang
        this.setupPagination();
      },
      error: err => console.error(err)
    });
  }

  // ===== SETUP PHÂN TRANG =====
  setupPagination() {
    this.totalPages = Math.ceil(
      this.filteredLeaveRequests.length / this.pageSize
    );
    this.changePage(1);
  }

  // ===== ĐỔI TRANG (FIX LỖI Ở ĐÂY) =====
  changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;

  this.page = page;

  const start = (this.page - 1) * this.pageSize;
  const end = start + this.pageSize;

  this.pagedLeaveRequests =
    this.filteredLeaveRequests.slice(start, end);

  this.resetSelection(); // 🔥 BẮT BUỘC
}


  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.changePage(this.page);
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.changePage(this.page);
    }
  }
  
  get pages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  // ===== SEARCH =====
  applyFilter() {
  const key = this.searchText.toLowerCase();
  let filtered = [...this.leaveRequests];

  // 1️⃣ Tìm kiếm text
  if (key) {
    filtered = filtered.filter(item =>
      item.tenNhanVien?.toLowerCase().includes(key) ||
      ('' + item.maNhanVien).includes(key) ||
      item.loaiNghi?.toLowerCase().includes(key) ||
      item.trangThai?.toLowerCase().includes(key)
    );
  }

  // 2️⃣ Lọc theo chuyên khoa
  if (this.filterKhoa) {
    filtered = filtered.filter(item =>
      item.chuyenKhoa === this.filterKhoa
    );
  }

  // 3️⃣ Lọc theo trạng thái
  if (this.filterStatus) {
    filtered = filtered.filter(item =>
      item.trangThai === this.filterStatus
    );
  }

  // 4️⃣ Lọc theo thời gian
  if (this.filterTime) {
    const now = new Date();

    filtered = filtered.filter(item => {
      const startDate = new Date(item.ngayBatDau);

      if (this.filterTime === 'today') {
        return startDate.toDateString() === now.toDateString();
      }

      if (this.filterTime === 'week') {
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        return startDate >= firstDayOfWeek;
      }

      if (this.filterTime === 'month') {
        return (
          startDate.getMonth() === now.getMonth() &&
          startDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }

  // cập nhật list + phân trang
  this.filteredLeaveRequests = filtered;
  this.setupPagination();
  this.resetSelection(); // 🔥 BẮT BUỘC
}

toggleOne(maDon: number, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;

  this.selectedRequests[maDon] = checked;

  this.selectedIds = Object.keys(this.selectedRequests)
    .filter(k => this.selectedRequests[+k])
    .map(k => +k);

  // ✅ SYNC CHECKBOX HEADER
  this.selectAll =
    this.pagedLeaveRequests.length > 0 &&
    this.pagedLeaveRequests.every(
      item => this.selectedRequests[item.maDon]
    );
}



toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectAll = checked;

  this.pagedLeaveRequests.forEach(item => {
    this.selectedRequests[item.maDon] = checked;
  });

  this.selectedIds = checked
    ? this.pagedLeaveRequests.map(x => x.maDon)
    : [];
}


deleteSelected() {
  if (this.selectedIds.length === 0) return;

  if (!confirm(`Xóa ${this.selectedIds.length} yêu cầu đã chọn?`)) return;

  let done = 0;

  this.selectedIds.forEach(id => {
    this.leaveService.delete(id).subscribe({
      next: () => {
        done++;

        // xóa khỏi list FE cho khớp DB
        this.leaveRequests =
        this.leaveRequests.filter(x => x.maDon !== id);

        if (done === this.selectedIds.length) {
          this.resetSelection();
          this.applyFilter(); // load lại + phân trang
        }
      },
      error: () => {
        done++;
      }
    });
  });
}


resetSelection() {
  this.selectedRequests = {};
  this.selectedIds = [];
  this.selectAll = false;
}



  /** ================= POPUP THÊM ================== */
  openAddPopup() {
    this.showAddPopup = true;
  }

  closeAddPopup() {
    this.showAddPopup = false;
  }

  submitLeaveRequest(data: any) {
    this.leaveService.create(data).subscribe({
      next: () => {
        alert('Thêm yêu cầu nghỉ phép thành công!');
        this.loadLeaveRequests();
        this.showAddPopup = false;
      },
      error: err => {
        console.error('Lỗi khi thêm đơn nghỉ:', err);
        alert('Không thể thêm yêu cầu nghỉ!');
      }
    });
  }

  /** ================= XEM CHI TIẾT ================== */
  openDetailPopup(item: any) {
  this.selectedRequest = item;
  this.showDetailPopup = true;
  }


  closeDetailPopup() {
  this.showDetailPopup = false;
  this.selectedRequest = null;
  }


  /** ================= ACTION MENU ================== */
  toggleMenu(index: number) {
    this.activeMenu = this.activeMenu === index ? null : index;
  }

  /** ================= XÓA ================== */
  deleteRequest(item: any) {
    if (!confirm(`Xóa yêu cầu của ${item.tenNhanVien}?`)) return;

    this.leaveService.delete(item.maDon).subscribe({
      next: () => {
        alert('Đã xóa!');
        this.loadLeaveRequests();
      },
      error: err => console.error('Lỗi khi xóa:', err)
    });
  }

  /** ================= HỖ TRỢ VIEW ================== */
  getInitials(name: string) {
    if (!name) return '';
    return name.split(' ').slice(-2).map(x => x[0]).join('').toUpperCase();
  }

getStatusLabel(status: string): string {
  return this.STATUS_MAP[status]?.label || status;
}

getStatusClass(status: string): string {
  return this.STATUS_MAP[status]?.class || 'status';
}


// === MAP TRẠNG THÁI (FE ONLY) ===
STATUS_MAP: any = {
  'Cho duyet': {
    label: 'Chờ duyệt',
    class: 'status pending',
    code: 'PENDING'
  },
  'Da duyet': {
    label: 'Đã duyệt',
    class: 'status approved',
    code: 'APPROVED'
  },
  'Tu choi': {
    label: 'Từ chối',
    class: 'status rejected',
    code: 'REJECTED'
  }
};



}

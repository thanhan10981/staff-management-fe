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

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  confirmToastVisible = false;
  confirmDeleteId: number | null = null;
  confirmMode: 'single' | 'multi' = 'single';




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

toggleOne(id: number, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectedRequests[id] = checked;

  this.selectedIds = Object.keys(this.selectedRequests)
    .filter(k => this.selectedRequests[+k])
    .map(k => +k);
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

  this.confirmMode = 'multi';
  this.confirmToastVisible = true;
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
        this.loadLeaveRequests();
        this.showAddPopup = false;
      },
      error: err => {
        console.error('Lỗi khi thêm đơn nghỉ:', err);
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
  this.activeMenu = null;

  const id = item?.maDon;
  if (!id) {
    this.showToast('Không tìm thấy mã đơn', 'error');
    return;
  }

  this.confirmMode = 'single';   // ✅
  this.confirmDeleteId = id;
  this.confirmToastVisible = true;
}



cancelDelete() {
  this.confirmToastVisible = false;
  this.confirmDeleteId = null;
  this.confirmMode = 'single';
}


delete(id: number) {
  this.leaveService.delete(id).subscribe({
    next: () => {
      this.showToast('Đã xóa yêu cầu nghỉ phép thành công', 'success');
      this.loadLeaveRequests(); // ✅ refresh list
    },
    error: err => {
      console.error('Xóa thất bại', err);
      this.showToast('Xóa yêu cầu thất bại', 'error');
    }
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

private showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  setTimeout(() => {
    this.toastVisible = false;
  }, 3000);
}

confirmDelete() {
  // ===== XÓA 1 =====
  if (this.confirmMode === 'single') {
    if (!this.confirmDeleteId) return;

    this.delete(this.confirmDeleteId);
    this.confirmToastVisible = false;
    this.confirmDeleteId = null;
    return;
  }

  // ===== XÓA NHIỀU =====
  if (this.confirmMode === 'multi') {
    if (this.selectedIds.length === 0) return;

    const ids = [...this.selectedIds]; // clone trước khi xóa
    this.confirmToastVisible = false;

    let done = 0;
    let fail = 0;

    ids.forEach(id => {
      this.leaveService.delete(id).subscribe({
        next: () => {
          done++;
          this.leaveRequests = this.leaveRequests.filter(x => x.maDon !== id);

          if (done + fail === ids.length) {
            this.resetSelection();
            this.applyFilter();
            this.showToast(`Đã xóa ${done} yêu cầu`, 'success');
          }
        },
        error: () => {
          fail++;
          if (done + fail === ids.length) {
            this.showToast(
              `Xóa xong ${done} yêu cầu, thất bại ${fail}`,
              fail > 0 ? 'error' : 'success'
            );
          }
        }
      });
    });
  }
}



}

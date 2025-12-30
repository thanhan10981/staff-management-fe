import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZone } from '@angular/core';

import { ShiftSwapRequestService } from '../../../service/shift-swap.service';
import { EmployeeModel, EmployeeOption, ShiftSwapCreateForm, ShiftSwapDetailModel, ShiftSwapRequestCreateModel, ShiftSwapRequestModel } from '../../../model/model';
import { AddRequestPopup } from './add-request-popup/add-request-popup';
import { EmployeeService } from '../../../service/employees';
import { ShiftSwapDetailPopup } from './shift-swap-detail-popup/shift-swap-detail-popup';

@Component({
  selector: 'app-shift-swap-request',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, AddRequestPopup,ShiftSwapDetailPopup],
  templateUrl: './shift-swap-request.html',
  styleUrls: ['./shift-swap-request.scss'],
})
export class ShiftSwapRequest implements OnInit {

  /* ================= DATA GỐC ================= */
  list: ShiftSwapRequestModel[] = [];

  /* ================= DATA SAU LỌC ================= */
  filteredList: ShiftSwapRequestModel[] = [];
  pagedList: ShiftSwapRequestModel[] = [];

  /* ================= FILTER ================= */
  searchText = '';
  filterPhongBan = '';
  filterCa = '';
  filterTrangThai = '';

  /* ================= PAGINATION ================= */
  page = 1;
  pageSize = 10;
  totalPages = 1;
  //
  createFormData!: ShiftSwapCreateForm;
  
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  nhanVienOptions: EmployeeOption[] = [];


  /* ================= STATS ================= */
  totalRequests = 0;
  approvedRequests = 0;
  pendingRequests = 0;
  rejectedRequests = 0;

  /* ================= UI ================= */
  activeMenu: number | null = null;
  isAddMenuVisible = false;
  showAddPopup = false;

  showDetailPopup = false;
  selectedDetail!: ShiftSwapDetailModel;

  selectedRequests: { [key: number]: boolean } = {};
  selectedIds: number[] = [];
  selectAll = false;

  confirmToastVisible = false;
  confirmDeleteId: number | null = null;
  confirmMode: 'single' | 'multi' = 'single';



  constructor(private service: ShiftSwapRequestService, private employeeService: EmployeeService, private ngZone: NgZone) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadData();

    // đóng menu khi click ra ngoài
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-cell')) {
        this.activeMenu = null;
      }
    });
  }

  /* ================= LOAD DATA ================= */
  loadData(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.list = data;

        // ===== STATS =====
        this.totalRequests = data.length;
        this.approvedRequests = data.filter(x => x.trangThai === 'Da duyet').length;
        this.pendingRequests = data.filter(x => x.trangThai === 'Cho duyet').length;
        this.rejectedRequests = data.filter(x => x.trangThai === 'Tu choi').length;

        this.applyFilter();
      },
      error: err => {
        console.error('Lỗi load yêu cầu đổi ca:', err);
      }
    });
  }

  /* ================= FILTER ================= */
  applyFilter(): void {
    let result = [...this.list];

    // SEARCH
    if (this.searchText.trim()) {
      const key = this.searchText.toLowerCase();
      result = result.filter(x =>
        x.tenNguoiGui?.toLowerCase().includes(key) ||
        x.tenNguoiNhan?.toLowerCase().includes(key) ||
        String(x.nguoiGui).includes(key) ||
        String(x.nguoiNhan).includes(key)
      );
    }

    // PHÒNG BAN
    if (this.filterPhongBan) {
      result = result.filter(x => x.tenPhongBan === this.filterPhongBan);
    }

    // CA
    if (this.filterCa) {
      result = result.filter(x => x.tenCa === this.filterCa);
    }

    // TRẠNG THÁI
    if (this.filterTrangThai) {
      result = result.filter(x => x.trangThai === this.filterTrangThai);
    }

    this.filteredList = result;
    this.setupPagination();
    this.resetSelection();
  }

  /* ================= PAGINATION ================= */
  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredList.length / this.pageSize);
    this.changePage(1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.page = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedList = this.filteredList.slice(start, end);
    this.resetSelection();
  }

  resetSelection() {
  this.selectedRequests = {};
  this.selectedIds = [];
  this.selectAll = false;
}

  prevPage(): void {
    if (this.page > 1) {
      this.changePage(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.changePage(this.page + 1);
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /* ================= ACTION MENU ================= */
  toggleMenu(index: number): void {
    this.activeMenu = this.activeMenu === index ? null : index;
  }

  /* ================= ADD MENU ================= */
  toggleAddMenu(): void {
    this.isAddMenuVisible = !this.isAddMenuVisible;
  }

  loggedUserId = 1; // sau này lấy từ auth

openAddPopup(type: 'manual' | 'excel'): void {
  if (type === 'manual') {
    this.employeeService.getAllEmployees().subscribe({
      next: (res: EmployeeModel[]) => {

        // 🔥 MAP EmployeeModel → EmployeeOption
        this.nhanVienOptions = res.map(emp => ({
          maNhanVien: Number(emp.maNhanVien), // string → number
          tenNhanVien: emp.tenNhanVien
        }));

        this.createFormData = undefined as any;
        this.showAddPopup = true;
      },
      error: (err: any) => {
        console.error(err);
        alert('Không load được danh sách nhân viên');
      }
    });
  }

  this.isAddMenuVisible = false;
}


onSelectNhanVien(maNhanVien: number): void {
  this.service.getCreateForm(maNhanVien).subscribe({
    next: (res) => {
      this.createFormData = res; // lúc này mới có ca hiện tại, caOptions, nvOptions
    },
    error: err => {
      console.error(err);
      alert('Không load được dữ liệu đổi ca');
    }
  });
}


closeAddPopup(): void {
  this.showAddPopup = false;
}
handleCreateRequest(dto: ShiftSwapRequestCreateModel): void {
  this.service.create(dto).subscribe({
    next: () => {
      this.showToast('Tạo yêu cầu đổi ca thành công!', 'success');
      this.showAddPopup = false;
      this.loadData();
    },
    error: () => {
      this.showToast('Tạo yêu cầu thất bại!', 'error');
    }
  });
}



  /* ================= DETAIL ================= */
  openDetailPopup(item: ShiftSwapRequestModel): void {
  this.service.getDetail(item.maYeuCau).subscribe({
    next: (res) => {
      this.selectedDetail = res;
      this.showDetailPopup = true;
    },
    error: err => console.error('Lỗi load chi tiết', err)
  });

  this.activeMenu = null;
}


  closeDetailPopup(): void {
    this.showDetailPopup = false;
    
  }

  /* ================= DELETE ================= */
  delete(maYeuCau: number): void {
  this.service.delete(maYeuCau).subscribe({
    next: () => {
      this.showToast('Đã xóa yêu cầu đổi ca', 'success');
      this.loadData();
    },
    error: () => {
      this.showToast('Xóa thất bại', 'error');
    }
  });
}

  deleteRequest(item: ShiftSwapRequestModel): void {
  this.activeMenu = null;

  const id = item?.maYeuCau;
  if (!id) {
    this.showToast('Không tìm thấy mã yêu cầu để xóa', 'error');
    return;
  }

  this.confirmMode = 'single';
  this.confirmDeleteId = id;
  this.confirmToastVisible = true;
}

deleteSelected() {
  if (this.selectedIds.length === 0) return;

  this.confirmMode = 'multi';
  this.confirmToastVisible = true;
}
confirmDelete() {
  // ===== XÓA 1 =====
  if (this.confirmMode === 'single') {
    if (!this.confirmDeleteId) return;

    this.confirmToastVisible = false;
    this.delete(this.confirmDeleteId);
    this.confirmDeleteId = null;
    return;
  }

  // ===== XÓA NHIỀU =====
  if (this.confirmMode === 'multi') {
    if (this.selectedIds.length === 0) return;

    const ids = [...this.selectedIds];
    this.confirmToastVisible = false;

    let done = 0;
    let fail = 0;

    ids.forEach(id => {
      this.service.delete(id).subscribe({
        next: () => {
          done++;
          // xóa FE list để khớp DB (nhanh, khỏi loadData liên tục)
          this.list = this.list.filter(x => x.maYeuCau !== id);

          if (done + fail === ids.length) {
            this.applyFilter();       // refresh view + pagination
            this.resetSelection();
            this.showToast(`Đã xóa ${done} yêu cầu đổi ca`, 'success');
          }
        },
        error: () => {
          fail++;
          if (done + fail === ids.length) {
            this.applyFilter();
            this.resetSelection();
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

cancelDelete() {
  this.confirmToastVisible = false;
  this.confirmDeleteId = null;
  this.confirmMode = 'single';
}



private showToast(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.toastVisible = false;
      });
    }, 3000);
  });
}

approveRequest() {
  if (!this.selectedDetail) return;

  this.service.approve(this.selectedDetail.maYeuCau).subscribe(() => {
    this.showDetailPopup = false;
    this.loadData();
  });
}

rejectRequest() {
  if (!this.selectedDetail) return;

  // không dùng note -> truyền chuỗi rỗng
  this.service.reject(this.selectedDetail.maYeuCau, '').subscribe(() => {
    this.showDetailPopup = false;
    this.loadData();
  });
}

toggleOne(id: number, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectedRequests[id] = checked;

  this.selectedIds = Object.keys(this.selectedRequests)
    .filter(k => this.selectedRequests[+k])
    .map(k => +k);

  // update selectAll theo page
  this.selectAll =
    this.pagedList.length > 0 &&
    this.pagedList.every(x => this.selectedRequests[x.maYeuCau]);
}

toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectAll = checked;

  this.pagedList.forEach(item => {
    this.selectedRequests[item.maYeuCau] = checked;
  });

  this.selectedIds = checked ? this.pagedList.map(x => x.maYeuCau) : [];
}




}

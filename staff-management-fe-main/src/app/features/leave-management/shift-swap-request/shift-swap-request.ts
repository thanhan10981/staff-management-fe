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
  this.delete(item.maYeuCau);
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

rejectRequest(note: string) {
  if (!this.selectedDetail) return;

  this.service.reject(this.selectedDetail.maYeuCau, note).subscribe(() => {
    this.showDetailPopup = false;
    this.loadData();
  });
}



}

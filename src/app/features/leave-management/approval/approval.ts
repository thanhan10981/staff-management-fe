import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ApprovalService } from '../../../service/approval.service';
import { ApprovalModel } from '../../../model/model';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './approval.html',
  styleUrls: ['./approval.scss']
})
export class Approval implements OnInit {

  /* ================= DATA ================= */
  list: ApprovalModel[] = [];
  filteredList: ApprovalModel[] = [];
  pagedList: ApprovalModel[] = [];

  /* ================= FILTER ================= */
  searchText = '';
  filterLoai = '';

  /* ================= UI ================= */
  activeMenu: number | null = null;

  //thongbao
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  

  private showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  setTimeout(() => {
    this.toastVisible = false;
  }, 3000);
}


  constructor(private service: ApprovalService) {}

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

  /* ================= LOAD ================= */
  loadData(): void {
    this.service.getPendingApprovals().subscribe((res: ApprovalModel[]) => {
      this.list = res;
      this.applyFilter();
    });
  }

  /* ================= FILTER ================= */
  applyFilter(): void {
    let data = [...this.list];

    if (this.searchText.trim()) {
      const key = this.searchText.toLowerCase();
      data = data.filter(x =>
        x.tenNhanVien.toLowerCase().includes(key) ||
        String(x.maNhanVien).includes(key)
      );
    }

    if (this.filterLoai) {
      data = data.filter(x => x.loaiYeuCau === this.filterLoai);
    }

    this.filteredList = data;
    this.pagedList = data; // chưa cần phân trang
  }

  /* ================= ACTION MENU ================= */
  toggleMenu(index: number): void {
    this.activeMenu = this.activeMenu === index ? null : index;
  }

  /* ================= ACTION ================= */
  

  approve(item: ApprovalModel): void {
  this.activeMenu = null;

  this.service.approve(item.id, item.loaiYeuCau).subscribe({
    next: () => {
      this.showToast('Đã duyệt yêu cầu thành công', 'success');
      this.loadData();
    },
    error: () => {
      this.showToast('Duyệt yêu cầu thất bại', 'error');
    }
  });
}


  reject(item: ApprovalModel): void {
  this.activeMenu = null;

  this.service.reject(item.id, item.loaiYeuCau).subscribe({
    next: () => {
      this.showToast('Đã từ chối yêu cầu', 'success');
      this.loadData();
    },
    error: () => {
      this.showToast('Từ chối yêu cầu thất bại', 'error');
    }
  });
}
}

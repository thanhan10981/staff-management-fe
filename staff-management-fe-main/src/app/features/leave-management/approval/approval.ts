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
  openDetail(item: ApprovalModel): void {
    console.log('Xem chi tiết', item);
    // TODO: mở popup chi tiết
  }

  approve(item: ApprovalModel): void {
    this.service.approve(item.id, item.loaiYeuCau).subscribe(() => {
      this.loadData();
    });
  }

  reject(item: ApprovalModel): void {
    this.service.reject(item.id, item.loaiYeuCau).subscribe(() => {
      this.loadData();
    });
  }
}

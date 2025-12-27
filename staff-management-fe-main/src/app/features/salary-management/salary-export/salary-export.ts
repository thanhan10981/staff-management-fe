import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportSalaryService } from '../../../service/export-salary.service';
import { DepartmentService } from '../../../service/Department.service';


@Component({
  selector: 'app-salary-export',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-export.html',
  styleUrls: ['./salary-export.scss']
})
export class ExportSalary implements OnInit {

  departments: any[] = [];
  selectedDept: number = 0;
  fromDate = "";
  toDate = "";
  keyword = "";

  tableData: any[] = [];
  // Summary
  totalEmp = 0;
  totalSalary = 0;
  totalAllowance = 0;
  totalOT = 0;

  constructor(private exportService: ExportSalaryService,private Department: DepartmentService) {}

  ngOnInit(): void {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');

    this.fromDate = `${y}-${m}-01`;
    this.toDate = `${y}-${m}-28`;
    this.loadDepartments();
    this.loadData();
  }
  loadDepartments() {
  this.Department.getDepartments().subscribe(res => {
    this.departments = [{ maKhoa: 0, tenKhoa: "Tất cả" }, ...res];
  });
}

  /** Load dữ liệu theo bộ lọc */
  loadData() {
    this.exportService.filterSalary(
      this.selectedDept,
      this.fromDate,
      this.toDate,
      this.keyword
    ).subscribe(res => {
      this.tableData = res;
      this.calcSummary();
    });
  }

  /** Tính tổng */
  calcSummary() {
    this.totalEmp = this.tableData.length;

    this.totalSalary = this.tableData.reduce((a, b) => a + b.tongLuong, 0);

    this.totalAllowance = this.tableData.reduce((a, b) => a + b.phuCap, 0);

    this.totalOT = this.tableData.reduce((a, b) => a + b.ot, 0);
  }

  /** Nhấn nút LỌC */
  onFilter() {
    this.loadData();
  }

  /** Xuất file Excel */
  exportExcel() {
    this.exportService.exportExcel(
    this.selectedDept,
      this.fromDate,
      this.toDate,
      this.keyword
    ).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bang-luong.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

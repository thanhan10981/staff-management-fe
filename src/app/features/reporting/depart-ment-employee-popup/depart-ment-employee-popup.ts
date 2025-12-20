import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeModel } from '../../../model/model';
import { EmployeeService } from '../../../service/employees';
import { DepartmentService } from '../../../service/Department.service';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-depart-ment-employee-popup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './depart-ment-employee-popup.html',
  styleUrls: ['./depart-ment-employee-popup.scss'],
})
export class DepartMentEmployeePopupComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  // ===== DATA =====
  employees: EmployeeModel[] = [];
  paginatedEmployees: EmployeeModel[] = [];

  listKhoa: any[] = [];
  listPhongBan: any[] = [];
  listViTri: any[] = [];

  
  // ===== STATS =====
  totalEmployees = 0;
  activeEmployees = 0;
  filterKhoa: string = '';
  filterViTri: string = '';
  filterNgayVaoLam: string = '';
  filterPhongBan: string = '';

  activeMenu: number | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.dataEmployee();

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-cell')) {
        this.closeAllMenus();
      }
    });
  }

  closePopup() {
    this.close.emit();
  }

  dataEmployee() {
  this.employeeService.getAllEmployees().subscribe({
    next: (data) => {
      this.employees = data;
      this.paginatedEmployees = data;

      this.totalEmployees = data.length;
    },
    error: (err) => console.error(err)
  });
}

loadCategories() {
  this.departmentService.getDepartments().subscribe(res => {
    this.listKhoa = res;
  });

  this.departmentService.getAllViTri().subscribe(res => {
    this.listViTri = res;
  });
}

  calculateStats() {
    this.totalEmployees = this.employees.length;
    this.activeEmployees = this.employees.filter(
      e => e.trangThai === 'Đang làm việc'
    ).length;
  }

  closeAllMenus() {
    this.activeMenu = null;
  }

  applyFilters(): void {
  let filtered = [...this.employees];

  // 1. Lọc KHOA
  if (this.filterKhoa !== '') {
    filtered = filtered.filter(emp => emp.maKhoa == this.filterKhoa);
  }

  // 2. Lọc PHÒNG BAN
  if (this.filterPhongBan !== '') {
    filtered = filtered.filter(emp => emp.maPhongBan == this.filterPhongBan);
  }

  // 3. Lọc VỊ TRÍ
  if (this.filterViTri !== '') {
    filtered = filtered.filter(emp => emp.maViTri == this.filterViTri);
  }

  // 4. Lọc NGÀY VÀO LÀM
  if (this.filterNgayVaoLam !== '') {
    filtered = filtered.filter(emp =>
      emp.ngayVaoLam?.startsWith(this.filterNgayVaoLam)
    );
  }

  this.paginatedEmployees = filtered;
}


  clearFilters() {
  this.filterKhoa = '';
  this.filterPhongBan = '';
  this.filterViTri = '';
  this.filterNgayVaoLam = '';
  this.listPhongBan = [];
  this.paginatedEmployees = this.employees;
}

  onKhoaChange() {
  this.filterPhongBan = '';
  this.listPhongBan = [];

  if (!this.filterKhoa) return;

  this.departmentService
    .getPhongBanTheoKhoa(Number(this.filterKhoa))
    .subscribe(res => {
      this.listPhongBan = res;
      console.log('Phòng ban theo khoa:', res);
    });
}

exportExcel() {
  if (!this.paginatedEmployees || this.paginatedEmployees.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  const data = this.paginatedEmployees.map((emp, index) => ({
    'STT': index + 1,
    'Tên nhân viên': emp.tenNhanVien,
    'Email': emp.email,
    'Khoa': emp.tenKhoa,
    'Chức vụ': emp.tenViTri,
    'Phòng ban': emp.tenPhongBan,
    'Ngày vào làm': emp.ngayVaoLam
      ? new Date(emp.ngayVaoLam).toLocaleDateString('vi-VN')
      : '',
    'Trạng thái': emp.trangThai
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'NhanSu');

  XLSX.writeFile(workbook, 'Bao_cao_nhan_su.xlsx');
}

printPDF() {
  const printContent = document.getElementById('print-area')!.innerHTML;

  const win = window.open('', '', 'width=1200,height=800');
  win!.document.write(`
    <html>
      <head>
        <title>Báo cáo nhân sự</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  win!.document.close();
  win!.focus();
  win!.print();
}


}

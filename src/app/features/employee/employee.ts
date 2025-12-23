import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmployeePopup } from './add-employee-popup/add-employee-popup';
import { EmployeeDetailPopup } from './employee-detail-popup/employee-detail-popup';
import { EmployeeService } from '../../service/employees';
import { EmployeeModel } from '../../model/model';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, AddEmployeePopup, EmployeeDetailPopup],
  templateUrl: './employee.html',
  styleUrls: ['./employee.scss'],
})
export class Employee implements OnInit {

  // Danh sách nhân viên từ API
  employees: EmployeeModel[] = [];

  // Một nhân viên (dùng khi xem chi tiết hoặc tạo mới)
  employee: EmployeeModel = this.getEmptyEmployee();

  activeMenu: number | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {

    // Lấy danh sách nhân viên từ API
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;   // GÁN CHÍNH XÁC
        this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        // console.log("Dữ liệu nhân viên:", this.employees);
      },
      error: (err) => console.error(err)
    });

    // Auto đóng menu action
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-cell')) {
        this.closeAllMenus();
      }
    });
  }

  getEmptyEmployee(): EmployeeModel {
    return {
      maNhanVien:'',
      tenNhanVien: '',
      ngaySinh: '',
      gioiTinh: '',
      sdt: '',
      email: '',
      trangThai: '',
      maViTri:'',
      maPhongBan:'',
      maKhoa:'',
      tenViTri: '',
      tenPhongBan: '',
      tenKhoa: '',
      cccd: '',
      ngayVaoLam: '',
      trinhDoChuyenMon: '',
    };
  }

  toggleMenu(index: number) {
    this.activeMenu = this.activeMenu === index ? null : index;
  }

  closeAllMenus() {
    this.activeMenu = null;
  }
  getInitials(name: string): string {
  if (!name || name.trim().length === 0) return '';

  const parts = name.trim().split(' ');

  // Lấy 2 chữ cái đầu của 2 từ cuối (Nguyễn Văn Hùng → VH)
  const last2 = parts.slice(-2);

  return last2.map(p => p[0]).join('').toUpperCase();
}

selectedEmployee: EmployeeModel | null = null;

  // Popup detail
  showDetailPopup = false;
  openDetailPopup(emp: EmployeeModel) {
    this.showDetailPopup = true;
    this.selectedEmployee = emp;
  }

  closeDetailPopup() {
    this.showDetailPopup = false;
  }

  // Popup thêm
  isAddMenuVisible = false;
  toggleAddMenu() {
    this.isAddMenuVisible = !this.isAddMenuVisible;
  }

  showAddPopup = false;
  openAddPopup(method: string) {
    if (method === 'manual') this.showAddPopup = true;
    this.isAddMenuVisible = false;
  }

  closeAddPopup() {
    this.showAddPopup = false;
  }

  onExcelSelected(event: any) {
    const file = event.target.files[0];
    if (file) alert(`Đã chọn file: ${file.name}`);
    this.isAddMenuVisible = false;
  }
  get pages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}
page = 1;           // trang hiện tại
pageSize = 10;      // mỗi trang 10 dòng
totalPages = 1;     // tổng số trang

get paginatedEmployees() {
  const start = (this.page - 1) * this.pageSize;
  const end = this.page * this.pageSize;
  return this.employees.slice(start, end);
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.page = page;
  }
}

prevPage() {
  if (this.page > 1) this.page--;
}

nextPage() {
  if (this.page < this.totalPages) this.page++;
}

}

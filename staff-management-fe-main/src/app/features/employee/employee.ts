import { Component, NgModule, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmployeePopup } from './add-employee-popup/add-employee-popup';
import { EmployeeDetailPopup } from './employee-detail-popup/employee-detail-popup';
import { EmployeeService } from '../../service/employees';
import { EmployeeModel } from '../../model/model';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../service/Department.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, AddEmployeePopup, EmployeeDetailPopup,FormsModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.scss'],
})
export class Employee implements OnInit {
listKhoa: any[] = [];
listPhongBan: any[] = [];
listViTri: any[] = [];
totalEmployees = 0;
activeEmployees = 0;
resignedEmployees = 0;
newEmployees = 0;
toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showDeletePopup = false;
deleteTarget: EmployeeModel | null = null;
editingEmployee: EmployeeModel | null = null;
isEditing: boolean = false;
selectedEmployees: { [key: string]: boolean } = {};
selectedIds: number[] = [];
selectAll = false;

// Bộ lọc
filterName: string = '';
filterKhoa: string = '';
filterViTri: string = '';
filterTrangThai: string = '';

  // Danh sách nhân viên từ API
  employees: EmployeeModel[] = [];
  paginatedEmployees: EmployeeModel[] = [];
  // Một nhân viên (dùng khi xem chi tiết hoặc tạo mới)
  employee: EmployeeModel = this.getEmptyEmployee();

  activeMenu: number | null = null;
  constructor(
    private employeeService: EmployeeService,
    private ngZone: NgZone,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.dataEmployee();
    // Auto đóng menu action
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-cell')) {
        this.closeAllMenus();
      }
    });
    this.loadCategories();
  
  }
  loadCategories() {
  this.departmentService.getDepartments().subscribe(res => this.listKhoa = res);
  this.departmentService.getAllPhongBan().subscribe(res => this.listPhongBan = res);
  this.departmentService.getAllViTri().subscribe(res => this.listViTri = res);
}

dataEmployee(){
      this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
       this.employees = data; 
        this.calculateStats();
       this.totalPages = Math.ceil(data.length / this.pageSize); 
         this.loadPage();
      },
      error: (err) => console.error(err)
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
      lienHeKhanCap: '',
      sdtLienHeKhanCap:'',
      anhDaiDien: '',
      hopDongFile:'',
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
page = 1;           
pageSize = 10;      
totalPages = 1;     

loadPage() {
  const start = (this.page - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.paginatedEmployees = this.employees.slice(start, end);
 
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.page = page;
    this.loadPage();   
  }
}

prevPage() {
  if (this.page > 1) {
    this.page--;
    this.loadPage();   
  }
}

nextPage() {
  if (this.page < this.totalPages) {
    this.page++;
    this.loadPage();   
  }
}

confirmDelete() {
  if (!this.deleteTarget) return;

  this.employeeService.deleteEmployee(Number(this.deleteTarget.maNhanVien)).subscribe({
    next: () => {
      this.employees = this.employees.filter(
        x => x.maNhanVien !== this.deleteTarget?.maNhanVien
      );
      this.dataEmployee();

      this.showToast("Đã xóa thành công!", "success");
      this.closeDeletePopup();
    },
    error: () => {
     this.showToast("Đã xóa thành công!", "success");
      this.closeDeletePopup();
    }
  });
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

  openDeletePopup(emp: EmployeeModel) {
  this.deleteTarget = emp;
  this.showDeletePopup = true;
}
closeDeletePopup() {
  this.showDeletePopup = false;
  this.deleteTarget = null;
}
openEdit(emp: EmployeeModel) {
  this.editingEmployee = { ...emp }; 
  this.isEditing = true;
  this.closeAllMenus();
}
cancelEdit() {
  this.editingEmployee = null;
  this.isEditing = false;
}
saveEdit() {
  if (!this.editingEmployee) return;

  this.employeeService.updateEmployee(
    Number(this.editingEmployee!.maNhanVien),
    this.editingEmployee
  ).subscribe({
    next: () => {
      this.showToast("Cập nhật thành công!", "success");
      this.dataEmployee();     
      this.cancelEdit(); 
    },
    error: () => {
      this.showToast("Cập nhật thất bại!", "error");
    }
  });
}
applyFilters() {
  let filtered = this.employees;

  // 1. Lọc theo TÊN / EMAIL / MÃ NV
  if (this.filterName.trim() !== '') {
    const keyword = this.filterName.toLowerCase();
    filtered = filtered.filter(emp =>
      emp.tenNhanVien.toLowerCase().includes(keyword) ||
      emp.email.toLowerCase().includes(keyword) ||
      emp.maNhanVien.toString().includes(keyword)
    );
  }

  // 2. Lọc theo KHOA
  if (this.filterKhoa !== '') {
    filtered = filtered.filter(emp =>
      emp.maKhoa == this.filterKhoa
    );
  }

  // 3. Lọc theo VỊ TRÍ
  if (this.filterViTri !== '') {
    filtered = filtered.filter(emp =>
      emp.maViTri == this.filterViTri
    );
  }

  // 4. Lọc theo TRẠNG THÁI
  if (this.filterTrangThai !== '') {
    filtered = filtered.filter(emp =>
      emp.trangThai === this.filterTrangThai
    );
  }

  // Cập nhật phân trang
  this.paginatedEmployees = filtered.slice(
    (this.page - 1) * this.pageSize,
    this.page * this.pageSize
  );

  this.totalPages = Math.ceil(filtered.length / this.pageSize);
}


onEmployeeAdded() {
  this.dataEmployee();   // load lại danh sách
}
uploadExcel(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  this.employeeService.importExcel(formData).subscribe({
  next: (res: any) => {
    this.showToast("Import file thành công!", "success");
    this.dataEmployee();
    this.closeExcelPopup();
  },
  error: (err) => {
    this.showToast("Lỗi import Excel!", "error");
  }
});

}

showExcelPopup = false;

toggleExcelPopup() {
  this.showExcelPopup = !this.showExcelPopup;
}

closeExcelPopup() {
  this.showExcelPopup = false;
}


downloadTemplate() {
  const sampleData = [
    {
      tenNhanVien: "Nguyễn Văn A",
      ngaySinh: "1990-01-01",
      gioiTinh: "Nam",
      cccd: "0123456789",
      email: "a@gmail.com",
      sdt: "0909000000",
      ngayVaoLam: "2024-01-10",
      maViTri: 1,
      maPhongBan: 2,
      maKhoa: 3,
      lienHeKhanCap: "Mẹ",
      sdtLienHeKhanCap: "0909333222"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  XLSX.writeFile(wb, "Mau_NhanVien.xlsx");
}
onSelectChange() {
  this.selectedIds = Object.keys(this.selectedEmployees)
    .filter(key => this.selectedEmployees[key])
    .map(id => Number(id));

  this.selectAll = this.selectedIds.length === this.paginatedEmployees.length;
}
toggleSelectAll() {
  this.paginatedEmployees.forEach(emp => {
    this.selectedEmployees[emp.maNhanVien] = this.selectAll;
  });

  this.onSelectChange();
}
deleteSelected() {
  if (this.selectedIds.length === 0) {
    this.showToast("Bạn chưa chọn nhân viên nào!", "error");
    return;
  }

  let success = 0;
  let fail = 0;
  const total = this.selectedIds.length;

  this.selectedIds.forEach(id => {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        success++;
        this.employees = this.employees.filter(e => e.maNhanVien !== String(id));

        this.checkDeleteDone(success, fail, total);
      },
      error: () => {
        fail++;
        this.checkDeleteDone(success, fail, total);
      }
    });
  });
}

checkDeleteDone(success: number, fail: number, total: number) {
  if (success + fail === total) {

    if (success > 0) {
      this.showToast(`Xóa thành công: ${success}, thất bại: ${fail}`, "success");
    } else {
      this.showToast("Xóa không thành công!", "error");
    }

    this.dataEmployee();
    this.loadPage();

    this.selectedIds = [];
    this.selectedEmployees = {};
    this.selectAll = false;
  }
}
calculateStats() {
  const year = new Date().getFullYear();

  this.totalEmployees = this.employees.length;

  this.activeEmployees = this.employees.filter(e => 
    e.trangThai === "Đang làm việc"
  ).length;

  this.resignedEmployees = this.employees.filter(e =>
    e.trangThai === "Nghỉ việc"
  ).length;

  this.newEmployees = this.employees.filter(e =>
    e.ngayVaoLam && new Date(e.ngayVaoLam).getFullYear() === year
  ).length;
}



}

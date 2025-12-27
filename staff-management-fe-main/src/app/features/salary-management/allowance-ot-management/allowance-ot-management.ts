import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OTM } from '../../../service/allowance-ot-management.service';
import { SalaryDashboardService } from '../../../service/salary-dashboard.service';

@Component({
  selector: 'app-allowance-ot-management',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './allowance-ot-management.html',
  styleUrl: './allowance-ot-management.scss',
})
export class AllowanceOtManagement {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchText = "";
currentMonth: number = 0;
  currentYear: number = 0;

  // Panel bên phải
  totalAllowance = 0;
  avgSalary = 0;
  avgAllowance = 0;
  avgOt = 0;
 toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  constructor(private otm: OTM,private salaryService: SalaryDashboardService,private ngZone: NgZone) {}

  ngOnInit(): void {
    this.loadData();
   this.loadCurrentVietnamTime();
  }

  loadCurrentVietnamTime() {
    const now = new Date();
    const vn = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

    this.currentMonth = vn.getMonth() + 1;
    this.currentYear = vn.getFullYear();
  }

  loadData() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    this.salaryService.getSalaryTable(month, year).subscribe(res => {
      this.employees = res.map((x: any) => ({
        ...x,
        maNhanVien: x.maNhanVien,
        phuCap: x.phuCap || 0,
        ot: x.lamThemGio || 0
      }));

      this.filteredEmployees = [...this.employees];
      this.updateSummary();
    });
  }

  // 🔍 Tìm kiếm
  filter() {
    const txt = this.searchText.toLowerCase();
    this.filteredEmployees = this.employees.filter(x =>
      x.tenNhanVien.toLowerCase().includes(txt) ||
      x.email.toLowerCase().includes(txt) ||
      x.phongBan?.toLowerCase().includes(txt)
    );
  }

  // 📊 Tính thống kê
  updateSummary() {
    if (this.filteredEmployees.length == 0) return;

    this.totalAllowance = this.filteredEmployees
      .map(x => x.phuCap)
      .reduce((a, b) => a + b, 0);

    this.avgSalary = this.filteredEmployees
      .map(x => x.luongCoBan)
      .reduce((a, b) => a + b, 0) / this.filteredEmployees.length;

    this.avgAllowance = this.totalAllowance / this.filteredEmployees.length;

    this.avgOt = this.filteredEmployees
      .map(x => x.ot)
      .reduce((a, b) => a + b, 0) / this.filteredEmployees.length;
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

  saveTimers: any = {};

autoSave(emp: any) {
  if (!emp.maNhanVien) return;  // nếu thiếu ID thì bỏ qua

  const key = emp.maNhanVien;

  if (this.saveTimers[key]) clearTimeout(this.saveTimers[key]);

  this.saveTimers[key] = setTimeout(() => {

    const payload = [
      {
        maNhanVien: emp.maNhanVien,
        phuCap: Number(emp.phuCap) || 0,
        ot: Number(emp.ot) || 0
      }
    ];

    this.otm.updateOTAndAllowance(payload).subscribe({
      next: () => this.showToast("Đã lưu tự động!", "success"),
      error: () => this.showToast("Lỗi khi lưu!", "error")
    });

  }, 600);  // tăng debounce
}


}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";
import { EmployeeHealthService } from '../../../service/employee-health.service';

@Component({
  selector: 'app-employee-health-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-health-popup.html',
  styleUrls: ['./employee-health-popup.scss']
})
export class EmployeeHealthPopup implements OnInit, OnChanges {

  @Input() employeeId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

  tiemChungList: any[] = [];

  // Tách ra 2 loại: Vaccines + Health Check
  vaccinations: any[] = [];
  healthChecks: any[] = [];

  constructor(private healthService: EmployeeHealthService) {}

  ngOnInit(): void {
    if (this.employeeId) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeId'] && this.employeeId) {
      this.loadData();
    }
  }

  loadData() {
  this.healthService.getByNhanVien(this.employeeId).subscribe({
    next: res => {

      // ❌ KHÔNG filter lại theo nhân viên nữa
      const list = res; 

      // ✔ Tách loại rõ ràng
      this.vaccinations = list.filter((x: any) =>
        x.loai.toLowerCase().startsWith("tiêm")
      );

      this.healthChecks = list.filter((x: any) =>
        x.loai.toLowerCase().startsWith("khám")
      );

      console.log("Vaccines:", this.vaccinations);
      console.log("Health check:", this.healthChecks);
    },
    error: err => console.error("Lỗi load:", err)
  });
}



  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  closePopup() {
    this.close.emit();
  }

  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  activeTab = 'health';

  onTabChange(tabId: string) {
    this.activeTab = tabId;

    if (tabId !== 'health') {
      this.closeBoth(tabId);
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";
import { EmployeeHealthService } from '../../../../service/employee-health.service';


@Component({
  selector: 'app-employee-health-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-health-popup.html',
  styleUrls: ['./employee-health-popup.scss']
})
export class EmployeeHealthPopup implements OnInit, OnChanges {

  @Input() employeeId!: number;
  @Output() close = new EventEmitter<void>();          // NÚT X — ĐÓNG popup cha
  @Output() closeAll = new EventEmitter<string>();     // báo về cha mở popup khác

  vaccinations: any[] = [];
  healthChecks: any[] = [];
  activeTab = 'health';

  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  constructor(private healthService: EmployeeHealthService) {}

  ngOnInit() {
    if (this.employeeId) this.load();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId'] && this.employeeId) {
      this.load();
    }
  }

  load() {
    this.healthService.getByNhanVien(this.employeeId).subscribe(list => {
      this.vaccinations = list.filter(x => x.loai.toLowerCase().startsWith("tiêm"));
      this.healthChecks = list.filter(x => x.loai.toLowerCase().startsWith("khám"));
    });
  }

  /** NÚT X — ĐÓNG popup cha */
  closePopup() {
    this.close.emit();
  }

  /** NÚT TAB — báo về cha mở popup khác */
  onTabChange(tabId: string) {
    this.activeTab = tabId;
    this.closeAll.emit(tabId);
  }

  /** Dành cho lỗi gọi closeAll() trong HTML */
  handleCloseAll() {
    this.closeAll.emit('employee');
  }
}

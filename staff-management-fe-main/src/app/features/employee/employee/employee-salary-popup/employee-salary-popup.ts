import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonTabs } from "../common-tabs/common-tabs";
import { SalaryService } from '../../../../service/salary.service';


@Component({
  selector: 'app-employee-salary-popup',
  standalone: true,
  imports: [CommonModule, CommonTabs],
  templateUrl: './employee-salary-popup.html',
  styleUrls: ['./employee-salary-popup.scss']
})
export class EmployeeSalaryPopup {
  @Input() employeeId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<string>();

   constructor(private salaryService: SalaryService) {}

  activeTab = 'salary';
  salary: any = {};
  

  ngOnInit() {
    this.loadSalary();
  }

  loadSalary() {
  this.salaryService.getSalaryByEmployeeId(this.employeeId).subscribe(data => {
    this.salary = data;   
    console.log("Salary loaded:", data);
  });
}

  tabList = [
    { label: 'Thông tin cá nhân', id: 'personal' },
    { label: 'Chứng chỉ hành nghề', id: 'certificate' },
    { label: 'Tiêm chủng sức khỏe', id: 'health' },
    { label: 'Phân công lịch trực', id: 'schedule' },
    { label: 'Lương & phụ cấp', id: 'salary' },
    { label: 'Audit log', id: 'audit' }
  ];

  onTabChange(tabId: string) {
  this.activeTab = tabId;

  if (tabId === 'personal') this.closeAll.emit('employee');
  if (tabId === 'certificate') this.closeAll.emit('certificate');
  if (tabId === 'health') this.closeAll.emit('health');
  if (tabId === 'schedule') this.closeAll.emit('schedule');
  if (tabId === 'salary') this.closeAll.emit('salary');
  if (tabId === 'audit') this.closeAll.emit('audit');
}

  closeBoth(target: string = '') {
    this.closeAll.emit(target);
  }

  

  
}

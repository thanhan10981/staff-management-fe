import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface PhongBan {
  id: number;
  tenPhongBan: string;
}

@Component({
  selector: 'app-leave-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Leave-FilterBar.component.html',
  styleUrl: './Leave-FilterBar.component.scss'
})
export class LeaveFilterBarComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  periods = [
    { code: 'THANG_NAY', name: 'Tháng này' },
    { code: 'QUY_NAY', name: 'Quý này' },
    { code: 'NAM_NAY', name: 'Năm nay' }
  ];

  phongBans: PhongBan[] = [];
  leaveTypes: string[] = [];

  filter = {
    period: 'THANG_NAY',
    phongBanId: null,
    loaiNghi: null
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPhongBan();
    this.loadLeaveTypes();
  }

  loadPhongBan() {
    this.http.get<PhongBan[]>('http://localhost:9090/api/phongban')
      .subscribe(res => this.phongBans = res);
  }

  loadLeaveTypes() {
    this.http.get<any[]>('http://localhost:9090/api/leave-statistic/leave-types')
      .subscribe(res => {
        this.leaveTypes = res.map(x => x.loaiNghi);
      });
  }

  applyFilter() {
    this.filterChange.emit({ ...this.filter });
  }
}

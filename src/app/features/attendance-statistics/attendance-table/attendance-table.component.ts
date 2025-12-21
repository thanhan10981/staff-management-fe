import { Component, Input, OnChanges } from '@angular/core';
import { AttendanceService } from '../../../service/attendance.service';
import { AttendanceDetail } from '../../../model/simple-item.model';
import { CommonModule } from '@angular/common';

@Component({
selector: 'app-attendance-table',
imports: [CommonModule],
templateUrl: './attendance-table.component.html',
styleUrls: ['./attendance-table.component.scss']
})
export class AttendanceTableComponent implements OnChanges {


@Input() selectedDate!: string; // yyyy-MM-dd
@Input() maPhongBan?: number;
@Input() maViTri?: number;


data: AttendanceDetail[] = [];
loading = false;


constructor(private attendanceService: AttendanceService) {}


ngOnChanges(): void {
if (!this.selectedDate) return;


this.loading = true;
this.attendanceService
.getAttendanceByDate(this.selectedDate, this.maPhongBan, this.maViTri)
.subscribe(res => {
this.data = this.uniqueByEmail(res);
this.loading = false;
});
}

private uniqueByEmail(data: AttendanceDetail[]): AttendanceDetail[] {
  const map = new Map<string, AttendanceDetail>();

  data.forEach(item => {
    if (!map.has(item.email)) {
      map.set(item.email, item);
    }
  });

  return Array.from(map.values());
}


getSoLanDiTre(item: AttendanceDetail): number {
return item.diTre > 0 ? 1 : 0;
}


getRate(item: AttendanceDetail): number {
if (item.coDiLam === 0) return 0;
if (item.nghiKhongPhep > 0) return 0;
if (item.diTre > 0) return 80;
return 100;
}
}


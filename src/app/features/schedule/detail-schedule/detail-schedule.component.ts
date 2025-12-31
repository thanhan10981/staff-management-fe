import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduleService, DayDetailScheduleDTO } from '../../../service/schedule.service';

@Component({
  selector: 'app-detail-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-schedule.component.html',
  styleUrls: ['./detail-schedule.component.scss']
})
export class DetailScheduleComponent implements OnInit {

  list: DayDetailScheduleDTO[] = [];

  // summary
  totalNhanVien = 0;
  totalGioLam = 0;
  totalChuaLam = 0;
  totalDangLam = 0;

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      date: string;
      maKhoa: number;
    },
    private dialogRef: MatDialogRef<DetailScheduleComponent>,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.scheduleService
      .getDayDetail(this.data.date, this.data.maKhoa)
      .subscribe({
        next: res => {
          this.list = res || [];
          this.buildSummary();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  private buildSummary() {
  this.totalNhanVien = this.list.length;

  this.totalGioLam = this.list.reduce(
    (sum, i) => sum + Number(i.tongGioLam ?? 0),
    0
  );

  this.totalChuaLam = this.list.filter(
    i => i.trangThai === 'Chưa làm'
  ).length;

  this.totalDangLam = this.list.filter(
    i => i.trangThai === 'Đang làm'
  ).length;
}


  close() {
    this.dialogRef.close();
  }

  refreshAndClose() {
    this.dialogRef.close('refresh');
  }
}

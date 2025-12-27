import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ScheduleService } from '../../../../service/schedule.service';

@Component({
  selector: 'app-assign-shift',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './assign-shift.component.html',
  styleUrls: ['./assign-shift.component.scss']
})
export class AssignShiftComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignShiftComponent>,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      maPhong: [''],
      maCa: [''],
      ngayTruc: [''],
      danhSachNhanVien: [''] // nhập chuỗi: 1,2,5
    });
  }

  assign() {
    const raw = this.form.value;

    // ✨ CHUYỂN CHUỖI "1,2,3" → [1, 2, 3]
    const employeeIds: number[] = raw.danhSachNhanVien
      ? raw.danhSachNhanVien
          .split(',')
          .map((x: string) => x.trim())
          .filter((x: string) => x !== '')
          .map((x: string) => Number(x))
      : [];

    const basePayload = {
      maPhong: raw.maPhong ? Number(raw.maPhong) : null,
      maCa: raw.maCa ? Number(raw.maCa) : null,
      ngayTruc: raw.ngayTruc || null,
      ghiChu: ''
    };

    console.log("Assign payload:", basePayload, employeeIds);

    // Tạo danh sách Observable
    const calls = employeeIds.map((id: number) => {
      return this.scheduleService.createSchedule({
        ...basePayload,
        maNhanVien: id
      });
    });

    // Convert từng Observable sang Promise
    Promise.all(calls.map((c: any) => c.toPromise()))
      .then(() => this.dialogRef.close('refresh'))
      .catch((err: any) => console.error("Assign error", err));
  }

  cancel() {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScheduleService } from '../../../../service/schedule.service';

@Component({
  selector: 'app-add-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddScheduleComponent>,
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // ⛳ form KHỞI TẠO Ở ĐÂY → không lỗi "used before initialization"
    this.form = this.fb.group({
      maNhanVien: [null, Validators.required],
      maCa: [null, Validators.required],
      maPhong: [null, Validators.required],
      ngayTruc: [this.data?.date ?? '', Validators.required],
      ghiChu: ['']
    });
  }

  save() {
    if (this.form.invalid) return;

    // ⚠️ Chuyển sang any để tránh lỗi “null not assignable to number”
    const payload = this.form.value as any;

    this.scheduleService.createSchedule(payload).subscribe({
      next: res => {
        this.snackBar.open('Tạo lịch trực thành công!', 'OK', {
          duration: 2500,
          panelClass: ['toast-success']
        });

        this.dialogRef.close('refresh');
      },
      error: err => {
        this.snackBar.open('Lỗi khi tạo lịch trực!', 'Đóng', {
          duration: 3000,
          panelClass: ['toast-error']
        });
      }
    });

  }

  cancel() {
    this.dialogRef.close();
  }
}

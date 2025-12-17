import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ScheduleService } from '../../../../service/schedule.service';

@Component({
  selector: 'app-assign-shift',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './assign-shift.component.html',
  styleUrl: './assign-shift.component.scss'
})
export class AssignShiftComponent implements OnInit {

  form!: FormGroup;

  phongBans: any[] = [];
  phongVatLys: any[] = [];
  nhanViens: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignShiftComponent>,
    private scheduleService: ScheduleService,
    @Inject(MAT_DIALOG_DATA) public data: { maKhoa: number }
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      maCa: [1],
      ngayBatDau: [''],
      ngayKetThuc: [''],
      lapLaiHangTuan: [false],
      maPhongBan: [null],
      maPhongVL: [null],
      danhSachNhanVien: [[]],
      ghiChu: ['']
    });

    // Load dropdown
    this.loadPhongBan();
    this.loadPhongVL();

    // Khi chọn PHÒNG VẬT LÝ → load nhân viên
    this.form.get('maPhongVL')?.valueChanges.subscribe(maPhong => {
      this.form.patchValue({ danhSachNhanVien: [] });

      if (maPhong) {
        this.loadNhanVien(maPhong);
      } else {
        this.nhanViens = [];
      }
    });

  }

  // ======= PHÒNG BAN =======
  loadPhongBan() {
    this.scheduleService
      .getPhongBanTheoKhoa(this.data.maKhoa)
      .subscribe(res => this.phongBans = res);
  }

  // ======= PHÒNG VL =======
  loadPhongVL() {
    this.scheduleService
      .getPhongVLTheoKhoa(this.data.maKhoa)
      .subscribe(res => this.phongVatLys = res);
  }

  // ======= NHÂN VIÊN =======
  loadNhanVien(maPhongVL: number) {
    this.scheduleService
      .getNhanVienTheoKhoaPhong(this.data.maKhoa, maPhongVL)
      .subscribe(res => this.nhanViens = res);
  }

  toggleNhanVien(checked: boolean, id: number) {
    const arr = this.form.value.danhSachNhanVien as number[];

    if (checked) {
      arr.push(id);
    } else {
      const idx = arr.indexOf(id);
      if (idx >= 0) arr.splice(idx, 1);
    }

    this.form.patchValue({ danhSachNhanVien: [...arr] });
  }

  assign() {
    const raw = this.form.value;

    const payload = {
      maKhoa: this.data.maKhoa,
      maPhong: raw.maPhongVL, // BE dùng maPhong
      maCa: raw.maCa,
      ngayBatDau: raw.ngayBatDau,
      ngayKetThuc: raw.ngayKetThuc,
      lapLaiHangTuan: raw.lapLaiHangTuan,
      ghiChu: raw.ghiChu || '',
      danhSachNhanVien: raw.danhSachNhanVien
    };

    this.scheduleService.createPhanCong(payload).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: err => console.error(err)
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}

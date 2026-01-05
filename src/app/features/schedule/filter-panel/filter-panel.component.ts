import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService, KhoaDTO } from '../../../service/schedule.service';
import { Subscription } from 'rxjs';
import { ViTriCongViecDTO } from '../../../model/profile.model';

export interface PhongVatLyDTO {
  maPhong: number;
  soPhong: string;
  tenPhong: string;
  loaiPhong: string;
  maKhoa: number;
  tenKhoa: string;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit, OnChanges {
  @Input() selectedKhoaId?: number;
  @Input() khoas: KhoaDTO[] = [];

  @Output() filterApply = new EventEmitter<{
    khoaId?: number;
    phongId?: number;   // ✅ ĐÚNG
    chucVu?: number;
    nhanVien?: string;
  }>();


  khoaControl = new FormControl<number | null>(null);
  phongControl = new FormControl<number | null>(null);
  chucVuControl = new FormControl<string | null>(null);
  nhanVienControl = new FormControl<string | null>(null);
  phongs: PhongVatLyDTO[] = [];
  viTris: ViTriCongViecDTO[] = [];

  viTriControl = new FormControl<number | null>(null);

  private subs: Subscription = new Subscription();

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
  this.subs.add(
    this.khoaControl.valueChanges.subscribe(maKhoa => {
      console.log('🔥 maKhoa change:', maKhoa);

      this.phongControl.setValue(null);
      this.viTriControl.setValue(null);
      this.phongs = [];
      this.viTris = [];

      if (maKhoa != null) {
        this.scheduleService.getPhongVLTheoKhoa(maKhoa).subscribe(res => {
          console.log('🏥 phongs:', res);
          this.phongs = res;
        });

        this.scheduleService.getViTriTheoPhongBan(maKhoa).subscribe(res => {
          this.viTris = res;
        });
      }
    })
  );

  // 👉 set SAU khi đã subscribe
  if (this.selectedKhoaId != null) {
    this.khoaControl.setValue(this.selectedKhoaId);
  }
}



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedKhoaId'] && !changes['selectedKhoaId'].firstChange) {
      this.khoaControl.setValue(this.selectedKhoaId ?? null);
    }

    if (changes['khoas'] && this.khoas.length > 0) {
      if (this.khoaControl.value == null && this.selectedKhoaId) {
        this.khoaControl.setValue(this.selectedKhoaId);
      }
    }
  }

  loadKhoas() {
    this.scheduleService.getKhoaList().subscribe({
      next: (res) => (this.khoas = res),
      error: () => (this.khoas = [])
    });
  }

  // still keep an explicit apply button for other filters (phòng/chức vụ/nhân viên)
  onApply() {
    this.filterApply.emit({
      khoaId: this.khoaControl.value ?? undefined,
      phongId: this.phongControl.value ?? undefined,
      chucVu: this.viTriControl.value ?? undefined,
      nhanVien: this.nhanVienControl.value ?? undefined
    });
  }
  

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

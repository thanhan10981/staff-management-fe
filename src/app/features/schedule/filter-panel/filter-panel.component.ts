import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService, KhoaDTO } from '../../../service/schedule.service';
import { Subscription } from 'rxjs';

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
    phongId?: number;
    chucVu?: string;
    nhanVien?: string;
  }>();

  khoaControl = new FormControl<number | null>(null);
  phongControl = new FormControl<string | null>(null);
  chucVuControl = new FormControl<string | null>(null);
  nhanVienControl = new FormControl<string | null>(null);

  private subs: Subscription = new Subscription();

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    // if parent didn't pass khoas, load them here
    if (!this.khoas || this.khoas.length === 0) {
      this.loadKhoas();
    }

    // set initial value from parent if provided
    if (this.selectedKhoaId != null) {
      this.khoaControl.setValue(this.selectedKhoaId);
    }

    // subscribe to instant changes: when user picks a new khoa -> emit immediately
    this.subs.add(
      this.khoaControl.valueChanges.subscribe(val => {
        // emit immediately so parent can reload
        this.filterApply.emit({
          khoaId: val ?? undefined,
          phongId: undefined,
          chucVu: this.chucVuControl.value ?? undefined,
          nhanVien: this.nhanVienControl.value ?? undefined
        });
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedKhoaId'] && !changes['selectedKhoaId'].firstChange) {
      this.khoaControl.setValue(this.selectedKhoaId ?? null, { emitEvent: false });
    }

    if (changes['khoas'] && this.khoas.length > 0) {
      if (this.khoaControl.value == null && this.selectedKhoaId) {
        this.khoaControl.setValue(this.selectedKhoaId, { emitEvent: false });
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
      phongId: undefined,
      chucVu: this.chucVuControl.value ?? undefined,
      nhanVien: this.nhanVienControl.value ?? undefined
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

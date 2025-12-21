import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnumService } from '../../../service/enum.service';
import { AttendanceService } from '../../../service/attendance.service';
import { EnumItem } from '../../../model/enum.model';
import { SimpleItem } from '../../../model/simple-item.model';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  timeRanges: EnumItem[] = [];
  departments: SimpleItem[] = [];
  positions: SimpleItem[] = [];

  filter = {
    timeRange: null as string | null,
    departmentId: null as number | null,
    positionId: null as number | null,
    specificDate: null as string | null
  };

  constructor(
    private enumService: EnumService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadTimeRanges();
    this.loadDepartments();
    this.loadPositions();
  }

  loadTimeRanges() {
    this.enumService.getTimeRanges().subscribe((res: EnumItem[]) => {
      this.timeRanges = res;

      if (!this.filter.timeRange && res.length > 0) {
        this.filter.timeRange = res[0].code;
        this.onChange();
      }
    });
  }

  loadDepartments() {
    this.attendanceService.getDepartments().subscribe((res: SimpleItem[]) => {
      this.departments = res;
    });
  }

  loadPositions() {
    this.attendanceService.getPositions().subscribe((res: SimpleItem[]) => {
      this.positions = res;
    });
  }

  onChange() {
    this.filterChange.emit({ ...this.filter });
  }
}

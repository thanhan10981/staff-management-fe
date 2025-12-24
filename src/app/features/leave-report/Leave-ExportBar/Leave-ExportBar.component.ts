import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leave-export-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-ExportBar.component.html',
  styleUrl: './leave-ExportBar.component.scss'
})
export class LeaveExportBarComponent {

  @Input() totalDays = 0;       // label tổng cộng (FE tự cộng)
  @Input() filter!: {
    period: string;
    phongBanId?: number | null;
    loaiNghi?: string | null;
  };

  loading = false;

  constructor(private http: HttpClient) {}

  exportPdf() {
    this.exportFile(
      'http://localhost:9090/api/leave-report/exportPDF',
      'bao-cao-nghi-phep.pdf'
    );
  }

  exportExcel() {
    this.exportFile(
      'http://localhost:9090/api/leave-report/exportExcel',
      'bao-cao-nghi-phep.xlsx'
    );
  }

  private exportFile(url: string, filename: string) {
    this.loading = true;

    const body = {
      timeRange: this.filter.period,
      maPhongBan: this.filter.phongBanId ?? null,
      loaiNghi: this.filter.loaiNghi ?? null
    };

    this.http.post(url, body, { responseType: 'blob' })
      .subscribe({
        next: blob => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);

          a.href = objectUrl;
          a.download = filename;
          a.click();

          URL.revokeObjectURL(objectUrl);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}

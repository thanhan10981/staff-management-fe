import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout/layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { Employee } from './features/employee/employee';
import { SalaryDashboard } from './features/salary-management/salary-dashboard/salary-dashboard';
import { AllowanceOtManagement } from './features/salary-management/allowance-ot-management/allowance-ot-management';
import { SalaryExport } from './features/salary-management/salary-export/salary-export';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: Employee },
      { path: 'salary-overview', component: SalaryDashboard },
      { path: 'allowances', component: AllowanceOtManagement },
      { path: 'salary-report', component: SalaryExport },

      // DÙNG loadComponent → BỎ QUA TẤT CẢ LỖI "no exports", "not a module"
      {
        path: 'attendance',
        loadComponent: () => import('./features/attendance/employee/attendance-employee.component')
          .then(c => c.AttendanceEmployeeComponent)
      },
      {
        path: 'attendance/report',
        loadComponent: () => import('./features/attendance/admin/attendance-report.component')
          .then(c => c.AttendanceReportComponent)
      }
    ]
  }
];
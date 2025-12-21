import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout/layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { Employee } from './features/employee/employee';
import { SalaryDashboard } from './features/salary-management/salary-dashboard/salary-dashboard';
import { AllowanceOtManagement } from './features/salary-management/allowance-ot-management/allowance-ot-management';
import { ExportSalary } from './features/salary-management/salary-export/salary-export';
import { LeaveReportComponent } from './features/leave-report/leave-report.component';
import { AttendanceStatisticsComponent } from './features/attendance-statistics/attendance-statistics.component';

import { AuthGuard } from './gaurds/auth.guard';
import { ReportingComponent } from './features/reporting/reporting';

export const routes: Routes = [

  // redirect root → login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // LOGIN (lazy load)
  {
    path: 'login', title: 'Đăng nhập hệ thống',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent)
  },

  // LAYOUT
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', title: 'Tổng quan',component: DashboardComponent },
      { path: 'employees',  title: 'Quản lý nhân viên',component: Employee },
      { path: 'salary-overview',  title: 'Tổng quan lương', component: SalaryDashboard },
      { path: 'allowances',  title: 'Quản lý Phụ cấp và OT',component: AllowanceOtManagement },
      { path: 'salary-report', title: 'Xuất bảng lương',component: ExportSalary },
      { path: 'reports', title: 'Báo cáo',component: ReportingComponent },
      {path: 'attendance-statistics', component: AttendanceStatisticsComponent},
      { path: 'leave-report', component: LeaveReportComponent }
    ]
  },

  // SCHEDULE (lazy loading + guard + roles)
  {
    path: 'schedule',title: 'Quản lý lịch trực',
    loadComponent: () =>
      import('./features/schedule/calendar/schedule-calendar.component')
        .then(m => m.ScheduleCalendarComponent),
    canActivate: [AuthGuard],
    data: { roles: ['TaoLich'] }
  },
  {
  path: 'attendance-statistics',
    loadComponent: () =>
      import('./features/attendance-statistics/attendance-statistics.component')
        .then(m => m.AttendanceStatisticsComponent),
    canActivate: [AuthGuard]
  },
  {
  path: 'leave-report',
    loadComponent: () =>
      import('./features/leave-report/leave-report.component')
        .then(m => m.LeaveReportComponent),
    canActivate: [AuthGuard]
  },
  // 404
  { path: '**', redirectTo: 'dashboard' }
];

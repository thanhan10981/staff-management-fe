import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout/layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { Employee } from './features/employee/employee';
import { SalaryDashboard } from './features/salary-management/salary-dashboard/salary-dashboard';
import { AllowanceOtManagement } from './features/salary-management/allowance-ot-management/allowance-ot-management';
import { ExportSalary } from './features/salary-management/salary-export/salary-export';

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
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent)
  },

  // LAYOUT
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: Employee },
      { path: 'salary-overview', component: SalaryDashboard },
      { path: 'allowances', component: AllowanceOtManagement },
      { path: 'salary-report', component: ExportSalary },
      { path: 'reports', component: ReportingComponent },
    ]
  },

  // SCHEDULE (lazy loading + guard + roles)
  {
    path: 'schedule',
    loadComponent: () =>
      import('./features/schedule/calendar/schedule-calendar.component')
        .then(m => m.ScheduleCalendarComponent),
    canActivate: [AuthGuard],
    data: { roles: ['TaoLich'] }
  },

  // 404
  { path: '**', redirectTo: 'dashboard' }
];

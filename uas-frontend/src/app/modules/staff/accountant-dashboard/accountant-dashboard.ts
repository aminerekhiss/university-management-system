import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

interface AccountantDashboardData {
  totalCollected: number;
  outstanding: number;
  monthlyPayroll: number;
}

@Component({
  selector: 'app-accountant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accountant-dashboard.html',
  styleUrls: ['./accountant-dashboard.css']
})
export class AccountantDashboard implements OnInit {

  dashboard$!: Observable<AccountantDashboardData>;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initDashboardStream();
  }

  /* ================= STREAM ================= */

  initDashboardStream(): void {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    this.dashboard$ = forkJoin({
      invoicesRes: this.api.staffListInvoices(),
      payrollRes: this.api.staffMonthlyPayrollReport(year, month)
    }).pipe(
      map(({ invoicesRes, payrollRes }) => {
        const invoices = invoicesRes?.invoices ?? [];
        const payrollRecords = payrollRes?.records ?? [];

        const totalCollected = invoices
          .filter((i: any) => i.status === 'paid')
          .reduce((s: number, i: any) => s + Number(i.amount), 0);

        const outstanding = invoices
          .filter((i: any) => i.status !== 'paid')
          .reduce((s: number, i: any) => s + Number(i.amount), 0);

        const monthlyPayroll = payrollRecords.reduce(
          (s: number, r: any) => s + Number(r.net_salary),
          0
        );

        return {
          totalCollected,
          outstanding,
          monthlyPayroll
        };
      }),
      catchError(err => {
        this.toastr.error('Failed to load dashboard data', 'Error');
        throw err;
      }),
      startWith({
        totalCollected: 0,
        outstanding: 0,
        monthlyPayroll: 0
      })
    );
  }
}

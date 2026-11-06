import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Observable, forkJoin, map, startWith } from 'rxjs';

interface Invoice {
  id: number;
  name: string;
  amount: number;
  due_date: string;
  status: string;
}

interface StudentDashboardState {
  user: any;
  loading: boolean;

  totalDue: number;
  totalPaid: number;
  pendingCount: number;
  overdueCount: number;

  invoices: Invoice[];
  invoicesByDay: Map<number, Invoice[]>;

  currentYear: number;
  currentMonth: number;
  currentMonthName: string;
  daysInMonth: number[];
  leadingEmptyDays: any[];

  selectedDay: number | null;
  selectedDayInvoices: Invoice[];

  nextInstallment: Invoice | null;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard implements OnInit {

  state$!: Observable<StudentDashboardState>;

  // ✅ UI state (NOT async)
  selectedDay: number | null = null;
  selectedDayInvoices: Invoice[] = [];

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    this.state$ = forkJoin({
      overview: this.api.getStudentOverview(),
      invoicesRes: this.api.getStudentInvoices()
    }).pipe(
      map(({ overview, invoicesRes }) => {
        const invoices: Invoice[] = invoicesRes?.invoices ?? [];

        const unpaid = invoices
          .filter(i => i.status !== 'paid')
          .map(i => ({ ...i, due: new Date(i.due_date) }))
          .filter(i => !isNaN(i.due.getTime()))
          .sort((a, b) => a.due.getTime() - b.due.getTime());

        const nextInstallment = unpaid[0] ?? null;
        const baseDate = nextInstallment ? new Date(nextInstallment.due_date) : new Date();

        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        const daysInMonth = Array.from(
          { length: new Date(year, month + 1, 0).getDate() },
          (_, i) => i + 1
        );

        const leadingEmptyDays = Array.from({
          length: new Date(year, month, 1).getDay()
        });

        const invoicesByDay = new Map<number, Invoice[]>();
        invoices.forEach(inv => {
          const d = new Date(inv.due_date);
          if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            invoicesByDay.set(day, [...(invoicesByDay.get(day) ?? []), inv]);
          }
        });

        return {
          user,
          loading: false,

          totalDue: Number(overview?.total_due ?? 0),
          totalPaid: Number(overview?.total_paid ?? 0),
          pendingCount: Number(overview?.pending ?? 0),
          overdueCount: Number(overview?.overdue ?? 0),

          invoices,
          invoicesByDay,

          currentYear: year,
          currentMonth: month,
          currentMonthName: baseDate.toLocaleString('default', { month: 'long' }),
          daysInMonth,
          leadingEmptyDays,

          selectedDay: null,
          selectedDayInvoices: [],

          nextInstallment
        };
      }),
      startWith({
        user,
        loading: true,
        totalDue: 0,
        totalPaid: 0,
        pendingCount: 0,
        overdueCount: 0,
        invoices: [],
        invoicesByDay: new Map(),
        currentYear: 0,
        currentMonth: 0,
        currentMonthName: '',
        daysInMonth: [],
        leadingEmptyDays: [],
        selectedDay: null,
        selectedDayInvoices: [],
        nextInstallment: null
      })
    );
  }

  goToFees(): void {
    this.router.navigate(['/student/fees']);
  }

  // ✅ SAFE UI handlers
  onDayClick(day: number, invoicesByDay: Map<number, Invoice[]>): void {
    this.selectedDay = day;
    this.selectedDayInvoices = invoicesByDay.get(day) ?? [];
  }

  getDayClass(day: number, invoicesByDay: Map<number, Invoice[]>): string {
    const list = invoicesByDay.get(day) ?? [];
    if (!list.length) return '';
    if (list.some(i => i.status === 'overdue')) return 'overdue';
    if (list.some(i => i.status === 'pending')) return 'pending';
    return 'paid';
  }
}

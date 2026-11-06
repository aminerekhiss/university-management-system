import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ApiService } from '../../../services/api.service';
import { BehaviorSubject, combineLatest, map, switchMap,shareReplay,  of,Observable ,startWith} from 'rxjs';


import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ToastrService } from 'ngx-toastr';
interface BudgetReport {
  budgetId: number;
  departmentId: number;
  departmentName: string;

  allocated: number;
  spent: number;
  remaining: number;

  transactions: any[];

  totalIncome: number;
  totalExpenses: number;
  netBalance: number;

  pieData: { name: string; value: number }[];
  barData: { name: string; value: number }[];
}
interface CreateBudgetForm {
  department_id: number | null;
  fiscal_year: number | null;
  allocated_amount: number | null;
}


@Component({
  selector: 'app-department-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './department-budget.html',
  styleUrls: ['./department-budget.css']
})export class DepartmentBudget implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);

  departments$!: Observable<any[]>;
  budgets$!: Observable<any[]>;
  report$!: Observable<BudgetReport | null>;
  private selectedIndex$ = new BehaviorSubject<number>(0);

  selectedBudgetIndex = 0;

  // 🔹 Transaction modal
  modalOpen = false;

  // 🔹 Create budget modal
  createBudgetOpen = false;

  form = {
    type: 'Income',
    description: '',
    amount: null as number | null,
    transaction_date: ''
  };

  createBudgetForm: CreateBudgetForm = {
    department_id: null,
    fiscal_year: new Date().getFullYear(),
    allocated_amount: null
  };

  colorScheme: Color = {
    name: 'budgetScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10b981', '#ef4444']
  };

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

  // Existing budgets stream
  this.budgets$ = this.refresh$.pipe(
    switchMap(() =>
      this.api.staffListBudgets().pipe(
        map(res => res.budgets ?? [])
      )
    )
  );

  // ✅ NEW: departments stream (from departments table)
  this.departments$ = this.api.adminGetDepartments().pipe(
    map(res => res.data ?? []),
    shareReplay(1)
  );

  // Existing report stream
  this.report$ = combineLatest([
    this.budgets$,
    this.selectedIndex$
  ]).pipe(
    switchMap(([budgets, index]) => {
      if (!budgets.length || !budgets[index]) return of(null);

      const selected = budgets[index];
      return this.api.staffBudgetReport(selected.id).pipe(
        map(res =>
          this.buildReport(res.budget?.transactions ?? [], selected)
        )
      );
    })
  );
}


  onBudgetChange(index: number): void {
    this.selectedBudgetIndex = index;
    this.selectedIndex$.next(index);
  }

  /* ================= REPORT BUILD ================= */

  buildReport(transactions: any[], budget: any): BudgetReport {
    const income = transactions
      .filter(t => t.type === 'Income')
      .reduce((s, t) => s + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((s, t) => s + Number(t.amount), 0);

    const monthly: Record<string, number> = {};

    transactions.forEach(t => {
      const m = new Date(t.transaction_date)
        .toLocaleString('default', { month: 'short' });

      if (!monthly[m]) monthly[m] = 0;
      monthly[m] += t.type === 'Income'
        ? Number(t.amount)
        : -Number(t.amount);
    });

    return {
      budgetId: budget.id,
      departmentId: budget.department_id,
      departmentName: budget.department.name,

      allocated: Number(budget.allocated_amount),
      spent: Number(budget.spent_amount),
      remaining: Number(budget.allocated_amount) - Number(budget.spent_amount),

      transactions,

      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,

      pieData: [
        { name: 'Income', value: income },
        { name: 'Expenses', value: expenses }
      ],

      barData: Object.keys(monthly).map(m => ({
        name: m,
        value: monthly[m]
      }))
    };
  }

  /* ================= TRANSACTIONS ================= */

  openAddModal(): void {
    this.modalOpen = true;
    this.form = {
      type: 'Income',
      description: '',
      amount: null,
      transaction_date: ''
    };
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveTransaction(report: BudgetReport): void {
    if (!this.form.description || !this.form.amount || !this.form.transaction_date) {
      this.toastr.error('Please enter valid transaction data');
      return;
    }

    this.api.staffAddBudgetTransaction({
      budget_id: report.budgetId,
      ...this.form
    }).subscribe(() => {
      this.closeModal();
      this.refresh$.next();
      this.toastr.success('Transaction added successfully');
    });
  }

  /* ================= CREATE BUDGET ================= */

  openCreateBudget(): void {
    this.createBudgetOpen = true;
    this.createBudgetForm = {
      department_id: null,
      fiscal_year: new Date().getFullYear(),
      allocated_amount: null
    };
  }

  closeCreateBudget(): void {
    this.createBudgetOpen = false;
  }

  saveBudget(): void {
  const f = this.createBudgetForm;

  if (!f.department_id || !f.fiscal_year || !f.allocated_amount) {
    this.toastr.error('Please fill all fields');
    return;
  }

  this.api.staffCreateBudget(f).subscribe({
    next: () => {
      this.toastr.success('Budget created successfully');
      this.closeCreateBudget();
      this.refresh$.next();
    },
    error: (err) => {
      this.toastr.error(
        err.error?.message || 'Failed to create budget'
      );
    }
  });
}


  exportReport(report: BudgetReport): void {
    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Budget_Report.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}

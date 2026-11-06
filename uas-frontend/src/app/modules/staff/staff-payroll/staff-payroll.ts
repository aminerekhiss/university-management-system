import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Observable, combineLatest, map, startWith, BehaviorSubject, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


interface PayrollRecord {
  id: number;
  staff_id: number;
  staff: {
    id: number;
    user: {
      fullname: string;
    };
  };
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  month: number;
  year: number;
}

@Component({
  selector: 'app-staff-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-payroll.html',
  styleUrls: ['./staff-payroll.css']
})
export class StaffPayroll implements OnInit {
private refresh$ = new BehaviorSubject<void>(undefined);

  // 🔹 STREAMS
  payroll$!: Observable<PayrollRecord[]>;
  filteredPayroll$!: Observable<PayrollRecord[]>;

  // 🔹 FILTER INPUTS
  private searchText$ = new BehaviorSubject<string>('');
  searchText = '';
  reportMonth: number | null = null;
  reportYear: number | null = null;

  // 🔹 MODAL
  modalOpen = false;
  editing = false;
  editId: number | null = null;

  // 🔹 FORM
  staffId: number | null = null;
  baseSalary: number | null = null;
  allowances = 0;
  deductions = 0;
  month: number | null = null;
  year: number | null = null;

  constructor(private api: ApiService, private toastr: ToastrService) {}

 ngOnInit(): void {
  this.payroll$ = this.refresh$.pipe(
    switchMap(() =>
      this.api.staffListPayroll().pipe(
        map(res => res.payroll ?? [])
      )
    )
  );

  this.filteredPayroll$ = combineLatest([
    this.payroll$,
    this.searchText$.pipe(startWith(''))
  ]).pipe(
    map(([payroll]) => this.applySearch(payroll))
  );
}


  /* ================= STREAM SETUP ================= */

  

  applySearch(payroll: PayrollRecord[]): PayrollRecord[] {
    const term = this.searchText.toLowerCase();
    if (!term) return payroll;

    return payroll.filter(p =>
      p.staff?.user?.fullname?.toLowerCase().includes(term) ||
      `${p.month}/${p.year}`.includes(term)
    );
  }

  onSearchChange(): void {
  this.searchText$.next(this.searchText);
}

isValidMonth(month: number | null): boolean {
  return month !== null && month >= 1 && month <= 12;
}

isValidYear(year: number | null): boolean {
  const currentYear = new Date().getFullYear();
  return year !== null && year >= 2000 && year <= currentYear + 1;
}

isNonNegative(value: number | null): boolean {
  return value !== null && value >= 0;
}

  /* ================= MODAL ================= */

  openAddModal(): void {
    this.modalOpen = true;
    this.editing = false;
    this.resetForm();
  }

  openEditModal(record: PayrollRecord): void {
    this.modalOpen = true;
    this.editing = true;
    this.editId = record.id;

    this.staffId = record.staff_id;
    this.baseSalary = record.basic_salary;
    this.allowances = record.allowances;
    this.deductions = record.deductions;
    this.month = record.month;
    this.year = record.year;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.editId = null;
    this.staffId = null;
    this.baseSalary = null;
    this.allowances = 0;
    this.deductions = 0;
    this.month = null;
    this.year = null;
  }

  /* ================= SAVE ================= */

  saveRecord(): void {
    if (
      !this.staffId ||
      !this.isNonNegative(this.baseSalary) ||
      !this.isValidMonth(this.month) ||
      !this.isValidYear(this.year)
    ) {
      alert('Please enter valid payroll data.');
      return;
    }


    const payload = {
      staff_id: this.staffId,
      basic_salary: this.baseSalary,
      allowances: this.allowances,
      deductions: this.deductions,
      month: this.month,
      year: this.year
    };

    const request = this.editing && this.editId
      ? this.api.staffUpdatePayroll(this.editId, payload)
      : this.api.staffCreatePayroll(payload);

    request.subscribe(() => {
      this.refresh$.next();
 // refresh stream
      this.closeModal();
      this.toastr.success('Payslip added successfully!', 'Success');
    });
  }

  /* ================= DELETE ================= */

  deleteRecord(id: number): void {
    if (!confirm('Delete payroll record?')) return;

    this.api.staffDeletePayroll(id).subscribe(() => {
      this.refresh$.next();
      this.toastr.success('Payroll record deleted.', 'Success');
    });
  }

  /* ================= REPORT ================= */

  generateMonthlyReport(): void {
    if (!this.isValidMonth(this.reportMonth) || !this.reportMonth || !this.isValidYear(this.reportYear) || !this.reportYear) {
      alert('Please enter a valid month and year.');
      return;
    }

    this.api.staffMonthlyPayrollReport(this.reportYear, this.reportMonth)
      .subscribe(res => {
        const blob = new Blob(
          [JSON.stringify(res.records, null, 2)],
          { type: 'application/json' }
        );

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Payroll_Report_${this.reportMonth}_${this.reportYear}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { BehaviorSubject, combineLatest, map, switchMap, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accountant-fees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accountant-fees.html',
  styleUrls: ['./accountant-fees.css']
})
export class AccountantFees implements OnInit {

  /* ================= STREAMS ================= */
  private refresh$ = new BehaviorSubject<void>(undefined);
  private search$ = new BehaviorSubject<string>('');

  invoices$ = this.refresh$.pipe(
    switchMap(() => this.api.staffListInvoices()),
    map(res => res.invoices ?? []),
    startWith([])
  );

  filteredInvoices$ = combineLatest([this.invoices$, this.search$]).pipe(
    map(([invoices, term]) => {
      const t = term.toLowerCase();
      if (!t) return invoices;

      return invoices.filter((i: any) =>
        i.name?.toLowerCase().includes(t) ||
        i.student?.user?.fullname?.toLowerCase().includes(t) ||
        i.student?.user?.username?.toLowerCase().includes(t)
      );
    })
  );

  /* ================= UI STATE ================= */
  modalOpen = false;
  editing = false;
  editId: number | null = null;

  form = {
    student_id: null as number | null,
    name: '',
    amount: null as number | null,
    due_date: ''
  };

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  /* ================= SEARCH ================= */
  onSearchChange(value: string): void {
    this.search$.next(value);
  }

  /* ================= VALIDATION ================= */
  isRequired(v: any): boolean {
    return v !== null && v !== undefined && v !== '';
  }

  isPositive(n: number | null): boolean {
    return n !== null && n > 0;
  }

  /* ================= MODAL ================= */
  openAddModal(): void {
    this.editing = false;
    this.editId = null;
    this.resetForm();
    this.modalOpen = true;
  }

  openEditModal(inv: any): void {
    this.editing = true;
    this.editId = inv.id;
    this.form = {
      student_id: inv.student_id,
      name: inv.name,
      amount: inv.amount,
      due_date: inv.due_date
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.form = {
      student_id: null,
      name: '',
      amount: null,
      due_date: ''
    };
  }

  /* ================= SAVE ================= */
  saveInvoice(): void {
    if (
      !this.isRequired(this.form.student_id) ||
      !this.isRequired(this.form.name) ||
      !this.isPositive(this.form.amount) ||
      !this.isRequired(this.form.due_date)
    ) {
      this.toastr.warning('Please enter valid invoice data', 'Validation');
      return;
    }

    const request = this.editing && this.editId
      ? this.api.staffUpdateInvoice(this.editId, this.form)
      : this.api.staffCreateInvoice(this.form);

    request.subscribe({
      next: () => {
        this.refresh$.next();
        this.closeModal();
        this.toastr.success(
          this.editing ? 'Invoice updated successfully' : 'Invoice created successfully',
          'Success'
        );
      },
      error: err => {
        this.toastr.error(err.error?.message || 'Operation failed', 'Error');
      }
    });
  }

  /* ================= ACTIONS ================= */
  deleteInvoice(id: number): void {
    if (!confirm('Delete this invoice?')) return;

    this.api.staffDeleteInvoice(id).subscribe({
      next: () => {
        this.refresh$.next();
        this.toastr.success('Invoice deleted');
      },
      error: () => this.toastr.error('Failed to delete invoice')
    });
  }

  toggleStatus(inv: any): void {
    this.api.staffToggleInvoiceStatus(inv.id).subscribe({
      next: () => {
        this.refresh$.next();
        this.toastr.success('Invoice status updated');
      },
      error: () => this.toastr.error('Failed to update status')
    });
  }

  downloadInvoice(inv: any): void {
    const data = {
      invoice: inv.name,
      student: inv.student?.user?.fullname,
      amount: inv.amount,
      due: inv.due_date,
      status: inv.status,
      generated: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${inv.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

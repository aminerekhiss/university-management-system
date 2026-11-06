import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, map, startWith, switchMap } from 'rxjs';

interface Invoice {
  id: number;
  name: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface Payment {
  id: number;
  amount: number;
  method: string;
  transaction_ref: string;
  created_at: string;
}

interface StudentFeesState {
  loading: boolean;
  invoices: Invoice[];
  payments: Payment[];
}

@Component({
  selector: 'app-student-fees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-fees.html',
  styleUrls: ['./student-fees.css']
})
export class StudentFees {

  private refresh$ = new BehaviorSubject<void>(undefined);

  searchText = '';

  // Modal
  modalOpen = false;
  selectedInvoice: Invoice | null = null;

  cardName = '';
  cardNumber = '';
  cardCVV = '';
  paying = false;

  // 🔹 MAIN STATE STREAM
  state$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() =>
      combineLatest([
        this.api.getStudentInvoices(),
        this.api.getPaymentHistory()
      ])
    ),
    map(([invRes, payRes]): StudentFeesState => ({
      loading: false,
      invoices: invRes?.invoices ?? [],
      payments: payRes?.payments ?? []
    })),
    startWith({
      loading: true,
      invoices: [],
      payments: []
    })
  );

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  /* =======================
     FILTER
  ======================= */
  filterInvoices(invoices: Invoice[]): Invoice[] {
    const term = this.searchText.toLowerCase();
    return invoices.filter(i =>
      i.name.toLowerCase().includes(term)
    );
  }

  /* =======================
     MODAL
  ======================= */
  openPayModal(inv: Invoice) {
    this.selectedInvoice = inv;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedInvoice = null;
    this.cardName = '';
    this.cardNumber = '';
    this.cardCVV = '';
  }

  isCardValid(): boolean {
    return (
      this.cardName.trim().length >= 3 &&
      this.cardNumber.replace(/\s/g, '').length >= 12 &&
      this.cardCVV.length === 3
    );
  }

  confirmPayment() {
    if (!this.selectedInvoice || !this.isCardValid()) return;

    this.paying = true;

    this.api.payInvoice(this.selectedInvoice.id).subscribe({
      next: () => {
        this.toastr.success('Payment successful');
        this.closeModal();
        this.refresh$.next();
        this.paying = false;
      },
      error: () => {
        this.toastr.error('Payment failed');
        this.paying = false;
      }
    });
  }

  /* =======================
     DOWNLOAD
  ======================= */
  downloadInvoice(inv: Invoice) {
    const content = {
      invoice: inv.name,
      amount: inv.amount,
      due_date: inv.due_date,
      status: inv.status
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${inv.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

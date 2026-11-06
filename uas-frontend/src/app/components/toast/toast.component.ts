import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="visible">
      <div class="toast-box" [ngClass]="type">
        <span class="toast-message">{{ message }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  visible = false;

  constructor(private toast: ToastService) {}

  ngOnInit() {
    this.toast.toastState.subscribe(data => {
      this.message = data.message;
      this.type = data.type;
      this.visible = true;

      setTimeout(() => (this.visible = false), 2500);
    });
  }
}

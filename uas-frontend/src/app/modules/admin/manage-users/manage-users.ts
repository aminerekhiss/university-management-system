import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, map, switchMap, startWith } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsers implements OnInit {

  /* ================= STREAMS ================= */
  private refresh$ = new BehaviorSubject<void>(undefined);
  private search$ = new BehaviorSubject<string>('');

  users$ = this.refresh$.pipe(
    switchMap(() => this.api.adminGetUsers()),
    map(res => Array.isArray(res?.data) ? res.data : []),
    startWith([])
  );

  filteredUsers$ = combineLatest([this.users$, this.search$]).pipe(
    map(([users, term]) => {
      const t = term.toLowerCase();
      if (!t) return users;

      return users.filter((u: any) =>
        (u.fullname || '').toLowerCase().includes(t) ||
        (u.username || '').toLowerCase().includes(t) ||
        (u.email || '').toLowerCase().includes(t)
      );
    })
  );

  /* ================= UI STATE ================= */
  modalOpen = false;
  editingUser: any = null;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  /* ================= SEARCH ================= */
  onSearchChange(value: string): void {
    this.search$.next(value);
  }

  /* ================= EDIT ================= */
  openEdit(user: any): void {
    this.editingUser = { ...user };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingUser = null;
  }

  saveChanges(): void {
    if (!this.editingUser?.id) return;

    this.api.adminUpdateUser(this.editingUser.id, this.editingUser)
      .subscribe({
        next: () => {
          this.toastr.success('User updated successfully');
          this.refresh$.next();
          this.closeModal();
        },
        error: err => {
          this.toastr.error(
            err.error?.message || 'Failed to update user'
          );
        }
      });
  }

  /* ================= DELETE ================= */
  deleteUser(id: number): void {
    if (!confirm('Delete this user?')) return;

    this.api.adminDeleteUser(id).subscribe({
      next: () => {
        this.toastr.success('User deleted');
        this.refresh$.next();
      },
      error: err => {
        this.toastr.error(
          err.error?.message || 'Failed to delete user'
        );
      }
    });
  }
}

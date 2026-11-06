import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

interface AdminDashboardData {
  totalUsers: number;
  totalStudents: number;
  totalStaff: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  dashboard$!: Observable<AdminDashboardData>;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initDashboardStream();
  }

  /* ================= STREAM ================= */

  initDashboardStream(): void {
    this.dashboard$ = this.api.adminGetUsers().pipe(
      map((res: any) => {
        const users = Array.isArray(res?.data) ? res.data : [];

        return {
          totalUsers: users.length,
          totalStudents: users.filter((u: { role: string; }) => u.role === 'student').length,
          totalStaff: users.filter((u: { role: string; }) => u.role === 'staff').length
        };
      }),
      catchError(err => {
        this.toastr.error('Failed to load admin dashboard', 'Error');
        throw err;
      }),
      startWith({
        totalUsers: 0,
        totalStudents: 0,
        totalStaff: 0
      })
    );
  }
}

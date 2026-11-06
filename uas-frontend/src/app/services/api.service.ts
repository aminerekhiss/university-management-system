import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* =====================================================
     AUTH
  ===================================================== */
  login(email: string, password: string) {
  return this.http.post(`${this.api}/login`, {
    email,
    password
  });
    }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  logout() {
    return this.http.post(`${this.api}/logout`, {});
  }

  me() {
    return this.http.get(`${this.api}/me`);
  }
  changePassword(payload: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    return this.http.post(`${this.api}/change-password`, payload);
  }

  /* =====================================================
     STUDENT ENDPOINTS
  ===================================================== */
getStudentProfile() {
  return this.http.get<{
    success: boolean;
    user: any;
    student: any;
  }>(`${this.api}/student/profile`);
}

updateStudentProfile(data: any) {
  return this.http.put<{
    success: boolean;
    message: string;
    user: any;
  }>(`${this.api}/student/profile`, data);
}

getStudentInvoices() {
  return this.http.get<{
    success: boolean;
    invoices: any[];
  }>(`${this.api}/student/invoices`);
}

getInvoiceDetails(id: number) {
  return this.http.get<{
    success: boolean;
    invoice: any;
  }>(`${this.api}/student/invoices/${id}`);
}

payInvoice(invoice_id: number) {
  return this.http.post<{
    success: boolean;
    message: string;
    invoice: any;
    payment: any;
  }>(`${this.api}/student/pay`, { invoice_id });
}

getPaymentHistory() {
  return this.http.get<{
    success: boolean;
    payments: any[];
  }>(`${this.api}/student/payments`);
}

getStudentOverview() {
  return this.http.get<{
    success: boolean;
    total_invoices: number;
    pending: number;
    overdue: number;
    paid: number;
    total_due: number;
    total_paid: number;
  }>(`${this.api}/student/overview`);
}


  /* =====================================================
     STAFF – TUITION FEES
  ===================================================== */
staffListInvoices() {
  return this.http.get<{
    success: boolean;
    invoices: any[];
  }>(`${this.api}/staff/invoices`);
}

staffCreateInvoice(data: any) {
  return this.http.post<{
    success: boolean;
    message: string;
    invoice: any;
  }>(`${this.api}/staff/invoices`, data);
}

staffUpdateInvoice(id: number, data: any) {
  return this.http.put<{
    success: boolean;
    message: string;
    invoice: any;
  }>(`${this.api}/staff/invoices/${id}`, data);
}

staffDeleteInvoice(id: number) {
  return this.http.delete<{
    success: boolean;
    message: string;
  }>(`${this.api}/staff/invoices/${id}`);
}

staffToggleInvoiceStatus(id: number) {
  return this.http.post<{
    success: boolean;
    message: string;
    invoice: any;
  }>(`${this.api}/staff/invoices/${id}/toggle-status`, {});
}


  /* =====================================================
     STAFF – PAYROLL
  ===================================================== */
staffListPayroll() {
  return this.http.get<{
    success: boolean;
    payroll: any[];
  }>(`${this.api}/staff/payroll`);
}

staffCreatePayroll(data: any) {
  return this.http.post<{
    success: boolean;
    message: string;
    record: any;
  }>(`${this.api}/staff/payroll`, data);
}

staffUpdatePayroll(id: number, data: any) {
  return this.http.put<{
    success: boolean;
    message: string;
    record: any;
  }>(`${this.api}/staff/payroll/${id}`, data);
}

staffDeletePayroll(id: number) {
  return this.http.delete<{
    success: boolean;
    message: string;
  }>(`${this.api}/staff/payroll/${id}`);
}

staffMonthlyPayrollReport(year: number, month: number) {
  return this.http.get<{
    success: boolean;
    generated: string;
    month: number;
    year: number;
    records: any[];
  }>(`${this.api}/staff/payroll/report/${year}/${month}`);
}

  /* =====================================================
     STAFF – BUDGETS
  ===================================================== */
staffListBudgets() {
  return this.http.get<{
    success: boolean;
    budgets: any[];
  }>(`${this.api}/staff/budgets`);
}

staffAddBudgetTransaction(data: any) {
  return this.http.post<{
    success: boolean;
    message: string;
    transaction: any;
  }>(`${this.api}/staff/budgets/transaction`, data);
}

staffBudgetReport(budgetId: number) {
  return this.http.get<any>(
    `${this.api}/staff/budgets/report/${budgetId}`
  );
}
staffCreateBudget(data: any) {
  return this.http.post<{
    success: boolean;
    message: string;
    budget: any;
  }>(`${this.api}/staff/budgets`, data);
}



  /* =====================================================
   ADMIN – USERS
===================================================== */

adminGetUsers() {
  return this.http.get<{
    success: boolean;
    data: any[];
  }>(`${this.api}/admin/users`);
}

adminCreateUser(data: {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'staff' | 'admin';
}) {
  return this.http.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/users`, data);
}

adminUpdateUser(id: number, data: {
  fullname?: string;
  username?: string;
  email?: string;
  role?: 'student' | 'staff' | 'admin';
}) {
  return this.http.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/users/${id}`, data);
}

adminDeleteUser(id: number) {
  return this.http.delete<{
    success: boolean;
    message: string;
  }>(`${this.api}/admin/users/${id}`);
}

/* =====================================================
   ADMIN – DEPARTMENTS
===================================================== */

adminGetDepartments() {
  return this.http.get<{
    success: boolean;
    data: any[];
  }>(`${this.api}/admin/departments`);
}

adminCreateDepartment(data: {
  name: string;
  code: string;
}) {
  return this.http.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/departments`, data);
}

adminUpdateDepartment(id: number, data: {
  name?: string;
  code?: string;
}) {
  return this.http.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/departments/${id}`, data);
}

adminDeleteDepartment(id: number) {
  return this.http.delete<{
    success: boolean;
    message: string;
  }>(`${this.api}/admin/departments/${id}`);
}
/* =====================================================
   ADMIN – STAFF MANAGEMENT
===================================================== */

adminListStaff() {
  return this.http.get<{
    success: boolean;
    data: any[];
  }>(`${this.api}/admin/staff`);
}

adminAssignStaff(data: {
  user_id: number;
  department_id: number;
  base_salary: number;
}) {
  return this.http.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/staff/assign`, data);
}

adminUpdateSalary(staffId: number, data: {
  base_salary: number;
}) {
  return this.http.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/staff/${staffId}/salary`, data);
}

/* =====================================================
   ADMIN – BUDGET MANAGEMENT
===================================================== */

adminListBudgets() {
  return this.http.get<{
    success: boolean;
    data: any[];
  }>(`${this.api}/admin/budgets`);
}

adminCreateBudget(data: {
  department_id: number;
  fiscal_year: number;
  allocated_amount: number;
}) {
  return this.http.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/budgets`, data);
}

adminUpdateBudget(id: number, data: {
  allocated_amount?: number;
  spent_amount?: number;
  status?: 'open' | 'closed';
}) {
  return this.http.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`${this.api}/admin/budgets/${id}`, data);
}

adminDeleteBudget(id: number) {
  return this.http.delete<{
    success: boolean;
    message: string;
  }>(`${this.api}/admin/budgets/${id}`);
}
}
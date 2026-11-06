import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FormsModule } from '@angular/forms';
import { DepartmentBudget } from './department-budget';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('DepartmentBudget Component', () => {
  let component: DepartmentBudget;
  let fixture: ComponentFixture<DepartmentBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentBudget, FormsModule, NgxChartsModule],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentBudget);
    component = fixture.componentInstance;

    // Mock localStorage
    vi.spyOn(localStorage, 'getItem').mockImplementation((key: string) => {
      if (key === 'budget') return JSON.stringify([]);
      return null;
    });
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {});

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close modal', () => {
    component.openAddModal();
    expect(component.modalOpen).toBeTruthy();

    component.closeModal();
    expect(component.modalOpen).toBeFalsy();
  });

  it('should add a new budget record', () => {
    component.openAddModal();
    component.title = 'Test Income';
    component.amount = 1000;
    component.date = '2025-12-01';
    component.department = 'Accounting';
    component.entryType = 'income';

    component.saveRecord();

    expect(component.records.length).toBe(1);
    expect(component.records[0].title).toBe('Test Income');
    expect(component.modalOpen).toBeFalsy();
  });

  it('should not add record if fields are missing', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.openAddModal();
    component.title = '';
    component.amount = null as any;
    component.date = '';
    component.department = '';

    const initialLength = component.records.length;
    component.saveRecord();
    expect(component.records.length).toBe(initialLength);
    expect(window.alert).toHaveBeenCalledWith('All fields are required.');
  });

  it('should delete a budget record', () => {
    component.records = [
      { id: 1, type: 'income', title: 'Test', amount: 100, date: '2025-12-01', department: 'Accounting' }
    ];
    component.deleteRecord(1);
    expect(component.records.length).toBe(0);
  });

  it('should filter records by search term', () => {
    component.records = [
      { id: 1, type: 'income', title: 'Income 1', amount: 100, date: '2025-12-01', department: 'Accounting' },
      { id: 2, type: 'expense', title: 'Expense 1', amount: 50, date: '2025-12-02', department: 'HR' }
    ];
    component.refresh();

    component.search('income');
    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0].title).toBe('Income 1');
  });

  it('should call exportReport without error', () => {
    const originalCreate = document.createElement;
    vi.spyOn(document, 'createElement').mockImplementation((...args) => originalCreate.apply(document, args));
    component.exportReport();
    expect(document.createElement).toHaveBeenCalledWith('a');
  });

});

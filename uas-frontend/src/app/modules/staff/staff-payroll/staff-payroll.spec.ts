import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffPayroll } from './staff-payroll';

describe('StaffPayroll', () => {
  let component: StaffPayroll;
  let fixture: ComponentFixture<StaffPayroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPayroll]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffPayroll);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load payroll data from localStorage on init', () => {
    const dummyData = [
      { id: 1, staffName: 'John', baseSalary: 1000, allowances: 100, deductions: 50, netSalary: 1050, month: 'January' }
    ];
    localStorage.setItem('payroll', JSON.stringify(dummyData));

    component.ngOnInit();
    expect(component.payroll).toEqual(dummyData);
    expect(component.filteredPayroll).toEqual(dummyData);
  });

  it('should add a new payroll record', () => {
    component.staffName = 'Alice';
    component.baseSalary = 2000;
    component.allowances = 200;
    component.deductions = 100;
    component.month = 'February';
    component.saveRecord();

    expect(component.payroll.length).toBe(1);
    expect(component.payroll[0].netSalary).toBe(2100); // 2000 + 200 - 100
    expect(component.modalOpen).toBeFalsy();
  });

  it('should delete a payroll record', () => {
    const rec = { id: 1, staffName: 'John', baseSalary: 1000, allowances: 100, deductions: 50, netSalary: 1050, month: 'January' };
    component.payroll = [rec];
    component.filteredPayroll = [rec];

    component.deleteRecord(1);
    expect(component.payroll.length).toBe(0);
    expect(component.filteredPayroll.length).toBe(0);
  });

  it('should filter payroll records by search text', () => {
    const rec1 = { id: 1, staffName: 'John', baseSalary: 1000, allowances: 100, deductions: 50, netSalary: 1050, month: 'January' };
    const rec2 = { id: 2, staffName: 'Alice', baseSalary: 2000, allowances: 200, deductions: 100, netSalary: 2100, month: 'February' };
    component.payroll = [rec1, rec2];
    component.searchText = 'alice';

    component.search();
    expect(component.filteredPayroll.length).toBe(1);
    expect(component.filteredPayroll[0].staffName).toBe('Alice');
  });

  it('should open and close modal', () => {
    component.openAddModal();
    expect(component.modalOpen).toBeTruthy();
    expect(component.editing).toBeFalsy();

    component.closeModal();
    expect(component.modalOpen).toBeFalsy();
  });
});

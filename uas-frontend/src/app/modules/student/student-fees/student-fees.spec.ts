import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FormsModule } from '@angular/forms';
import { StudentFees } from './student-fees';

describe('StudentFees Component', () => {
  let component: StudentFees;
  let fixture: ComponentFixture<StudentFees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFees, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFees);
    component = fixture.componentInstance;

    // Use real localStorage values for simplicity
    localStorage.clear();
    localStorage.setItem('currentUser', JSON.stringify({ username: 'testStudent', role: 'student' }));
    localStorage.setItem('fees', JSON.stringify([]));
    localStorage.setItem('payments', JSON.stringify([]));

    // Spy setItem to avoid polluting storage further
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {});
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fees for student if none exist', () => {
    expect(component.fees.length).toBeGreaterThan(0);
    const studentFees = component.fees.filter(f => f.studentUsername === 'testStudent');
    expect(studentFees.length).toBe(3);
  });

  it('should filter fees based on search', () => {
    component.searchText = 'tuition';
    component.search();
    expect(component.filteredFees.length).toBe(1);
    expect(component.filteredFees[0].name).toBe('Tuition Fee');
  });

  it('should open and close payment modal', () => {
    const fee = component.fees[0];
    component.openPayModal(fee);
    expect(component.modalOpen).toBeTruthy();
    expect(component.selectedFee).toEqual(fee);

    component.closeModal();
    expect(component.modalOpen).toBeFalsy();
    expect(component.selectedFee).toBeNull();
  });

  it('should confirm payment and update status', () => {
    const fee = component.fees[0];
    component.openPayModal(fee);
    component.confirmPayment();

    expect(fee.status).toBe('PAID');
    expect(component.payments.length).toBe(1);
    expect(component.modalOpen).toBeFalsy();
  });

  it('should call downloadInvoice without error', () => {
    const fee = component.fees[0];
    vi.spyOn(document, 'createElement'); // just ensure it triggers
    component.downloadInvoice(fee);
    expect(document.createElement).toHaveBeenCalledWith('a');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantFees } from './accountant-fees';

describe('AccountantFees', () => {
  let component: AccountantFees;
  let fixture: ComponentFixture<AccountantFees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountantFees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountantFees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

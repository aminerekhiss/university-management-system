import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountantDashboard } from './accountant-dashboard';

describe('AccountantDashboard', () => {
  let component: AccountantDashboard;
  let fixture: ComponentFixture<AccountantDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountantDashboard, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountantDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

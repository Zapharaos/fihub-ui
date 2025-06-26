import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFlowComponent } from './auth-flow.component';

describe('AuthFlowComponent', () => {
  let component: AuthFlowComponent;
  let fixture: ComponentFixture<AuthFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

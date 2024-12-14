import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContentLayoutComponent } from './dashboard-content-layout.component';

describe('DashboardItemLayoutComponent', () => {
  let component: DashboardContentLayoutComponent;
  let fixture: ComponentFixture<DashboardContentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContentLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardContentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardItemLayoutComponent } from './dashboard-item-layout.component';

describe('DashboardItemLayoutComponent', () => {
  let component: DashboardItemLayoutComponent;
  let fixture: ComponentFixture<DashboardItemLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardItemLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardItemLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

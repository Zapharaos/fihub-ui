import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokersComponent } from './brokers.component';

describe('BrokersComponent', () => {
  let component: BrokersComponent;
  let fixture: ComponentFixture<BrokersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

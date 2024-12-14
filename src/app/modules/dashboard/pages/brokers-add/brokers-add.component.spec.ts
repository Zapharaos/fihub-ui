import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokersAddComponent } from './brokers-add.component';

describe('AddBrokerComponent', () => {
  let component: BrokersAddComponent;
  let fixture: ComponentFixture<BrokersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokersAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

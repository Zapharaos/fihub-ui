import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrokerComponent } from './add-broker.component';

describe('AddBrokerComponent', () => {
  let component: AddBrokerComponent;
  let fixture: ComponentFixture<AddBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBrokerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

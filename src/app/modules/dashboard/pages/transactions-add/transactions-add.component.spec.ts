import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsAddComponent } from './transactions-add.component';

describe('TransactionsAddComponent', () => {
  let component: TransactionsAddComponent;
  let fixture: ComponentFixture<TransactionsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

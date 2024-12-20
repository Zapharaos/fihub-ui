import {Component, OnInit} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {ButtonDirective} from "primeng/button";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {Select} from "primeng/select";
import {TranslatePipe} from "@ngx-translate/core";
import {BrokerDataService, BrokerWithImage, UserBrokerWithImage} from "@core/services/broker-data.service";
import {NotificationService} from "@shared/services/notification.service";
import {FormService} from "@shared/services/form.service";
import {TransactionsService, TransactionsTransactionInput, TransactionsTransactionType} from "@core/api";
import {finalize} from "rxjs";
import {InputNumber} from "primeng/inputnumber";
import {DatePicker} from "primeng/datepicker";
import {numberPositiveValidator} from "@shared/validators/number";

@Component({
  selector: 'app-transactions-add',
  standalone: true,
  imports: [
    DashboardContentLayoutComponent,
    ButtonDirective,
    InputText,
    Message,
    NgIf,
    ReactiveFormsModule,
    Ripple,
    Select,
    TranslatePipe,
    InputNumber,
    DatePicker
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {

  protected readonly transactionTypes = Object.values(TransactionsTransactionType)
    .map(type => ({ label: type, value: type }));

  loading: boolean = true;
  brokers!: BrokerWithImage[];

  constructor(
    private notificationService: NotificationService,
    private fb: FormBuilder,
    protected formService: FormService,
    protected brokerDataService: BrokerDataService,
    private transactionsService: TransactionsService,
  ) {
    this.formService.init(this.fb.group({
      date: ['', Validators.required],
      transaction_type: ['', Validators.required],
      asset: ['', Validators.required],
      price: [null, [numberPositiveValidator()]],
      quantity: [null, [numberPositiveValidator()]],
      fee: [null, [Validators.min(0)]],
      broker: ['', Validators.required],
    }));
  }

  ngOnInit(): void {
    this.loadBrokers();
  }

  // Brokers

  loadBrokers() {
    this.loading = true;
    this.brokerDataService.getUsersBrokersWithImages().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: UserBrokerWithImage[]) => {
        this.brokers = brokers.map(broker => broker.broker);
      },
      error: () => {
        this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
      }
    })
  }

  // Transactions

  addTransaction() {
    // Skip if form invalid
    if (this.formService.isInvalid()) {
      return;
    }

    // Prepare input data
    const transaction: TransactionsTransactionInput = {
      asset: this.formService.getFormValue().asset,
      broker_id: this.formService.getFormValue().broker.id,
      date: this.formService.getFormValue().date,
      fee: this.formService.getFormValue().fee,
      price: this.formService.getFormValue().price,
      quantity: this.formService.getFormValue().quantity,
      transaction_type: this.formService.getFormValue().transaction_type.value,
    }

    // Call API
    this.loading = true;
    this.transactionsService.createTransaction(transaction).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.notificationService.showToastSuccess('transactions.messages.add-success');
      },
      error: (error) => {
        switch (error.status) {
          case 400:
            this.handleErrors400(error)
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
      }
    })
  }

  handleErrors400(error: any) {
    switch (error.error.message) {
      case 'broker-required':
        this.formService.setFieldErrors('broker', ['submit-required']);
        break;
      case 'broker-invalid':
        this.formService.setFieldErrors('broker', ['submit-invalid']);
        break;
      case 'type-invalid':
        this.formService.setFieldErrors('transaction_type', ['submit-invalid']);
        break;
      case 'asset-required':
        this.formService.setFieldErrors('asset', ['submit-required']);
        break;
      case 'quantity-required':
        this.formService.setFieldErrors('quantity', ['submit-required']);
        break;
      case 'price-required':
        this.formService.setFieldErrors('price', ['submit-required']);
        break;
      case 'fee-required':
        this.formService.setFieldErrors('fee', ['submit-required']);
        break;
      default:
        this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
        break;
    }
  }

}

import {Component, OnInit} from '@angular/core';
import {
  TransactionsService,
  TransactionsTransactionInput,
  TransactionsTransactionType
} from "@core/api";
import {
  BrokerImageService,
  BrokerWithImage,
  TransactionWithImage,
  UserBrokerWithImage
} from "@shared/services/broker-image.service";
import {NotificationService} from "@shared/services/notification.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormService} from "@shared/services/form.service";
import {numberPositiveValidator} from "@shared/validators/number";
import {finalize} from "rxjs";
import {TranslatePipe} from "@ngx-translate/core";
import {Select} from "primeng/select";
import {NgIf} from "@angular/common";
import {Message} from "primeng/message";
import {DatePicker} from "primeng/datepicker";
import {InputNumber} from "primeng/inputnumber";
import {ButtonDirective} from "primeng/button";
import {InputText} from "primeng/inputtext";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionStore} from "@modules/dashboard/transactions/stores/transaction.service";

@Component({
  selector: 'app-transactions-form-layout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    Select,
    NgIf,
    Message,
    DatePicker,
    InputNumber,
    ButtonDirective,
    InputText
  ],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.scss'
})
export class FormLayoutComponent implements OnInit {

  protected readonly transactionTypes = Object.values(TransactionsTransactionType)
    .map(type => ({ label: type, value: type }));

  isCreateForm: boolean = true;
  loading: boolean = true;
  brokers!: BrokerWithImage[];
  transaction: TransactionWithImage | undefined;
  submitLabel: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    protected formService: FormService,
    private transactionsService: TransactionsService,
    private transactionStore: TransactionStore,
    private brokerImageService: BrokerImageService,
  ) {

    // Retrieve transaction ID
    const transactionID = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isCreateForm = transactionID === undefined;

    // Set form submit label
    if (this.isCreateForm) {
      this.submitLabel = 'transactions.form.label.submit-add';
    }
    else {
      this.submitLabel = 'transactions.form.label.submit-update';
    }

    // Init form
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
    this.brokerImageService.getUsersBrokersWithImages().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: UserBrokerWithImage[]) => {
        this.brokers = brokers.map(broker => broker.broker);

        // Load transaction data if it's an update form
        if (!this.isCreateForm) {
          this.loadForm();
        }
      },
      error: (error: any) => {
        this.router.navigate(['dashboard/transactions']);
        switch (error.status) {
          case 401:
            this.notificationService.showToastError('http.401.detail', undefined, 'http.401.summary')
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
      }
    })
  }

  // Form

  loadForm() {

    // Retrieve transaction data
    this.transaction = this.transactionStore.transaction;

    // If the transaction is already loaded
    if (this.transaction) {
      this.patchForm();
      return;
    }

    // If the transaction is not loaded, then retrieve it from the API
    const transactionID = this.route.snapshot.paramMap.get('id');
    this.brokerImageService.getTransactionWithImage(transactionID!).subscribe({
      next: (transaction: TransactionWithImage) => {
        this.transactionStore.transaction = transaction;
        this.transaction = transaction;
        this.patchForm();
      },
      error: (error) => {
        switch (error.status) {
          case 401:
            this.notificationService.showToastError('http.401.detail', undefined, 'http.401.summary')
            break;
          case 404:
            this.notificationService.showToastError('http.404.detail', undefined, 'http.404.summary')
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
        this.router.navigate(['/dashboard/transactions']);
      }
    })
  }

  patchForm() {
    // Find the transaction type inside the transactionTypes array
    const transactionType = this.transactionTypes.find(type => type.value === this.transaction?.transaction_type);

    // Find the broker inside the brokers array
    const broker = this.brokers.find(broker => broker.id === this.transaction?.broker?.id);

    // TODO : Handle Date field

    // Update the form values according to the transaction data
    this.formService.patchValue({
      date: this.transaction?.date,
      transaction_type: transactionType,
      asset: this.transaction?.asset,
      price: this.transaction?.price,
      quantity: this.transaction?.quantity,
      fee: this.transaction?.fee,
      broker: broker,
    });
  }

  submit() {
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
    if(!this.transaction) {
      this.createTransaction(transaction);
    } else {
      this.updateTransaction(transaction);
    }
  }

  // Transaction

  createTransaction(transaction: TransactionsTransactionInput) {
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
          case 401:
            this.notificationService.showToastError('http.401.detail', undefined, 'http.401.summary')
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
      }
    })
  }

  updateTransaction(transaction: TransactionsTransactionInput) {
    this.loading = true;
    this.transactionsService.updateTransaction(this.transaction?.id!, transaction).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.notificationService.showToastSuccess('transactions.messages.update-success');
      },
      error: (error) => {
        switch (error.status) {
          case 400:
            this.handleErrors400(error)
            break;
          case 401:
            this.notificationService.showToastError('http.401.detail', undefined, 'http.401.summary')
            break;
          case 404:
            this.notificationService.showToastError('http.404.detail', undefined, 'http.404.summary')
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
      }
    })
  }

  // Errors

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
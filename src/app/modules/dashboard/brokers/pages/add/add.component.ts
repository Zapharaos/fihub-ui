import {Component, OnInit} from '@angular/core';
import {ModelsBroker, ModelsBrokerUserInput, BrokerService} from "@core/api";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize} from "rxjs";
import {NotificationService} from "@shared/services/notification.service";
import {TranslatePipe} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Select} from "primeng/select";
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {InputText} from "primeng/inputtext";
import {RadioCardItem, RadioCardsComponent} from "@shared/components/radio-cards/radio-cards.component";
import {Message} from "primeng/message";
import {FormService} from "@shared/services/form.service";
import {BrokerImageService, BrokerWithImage} from "@shared/services/broker-image.service";
import {handleErrors, ResponseError} from "@shared/utils/errors";

@Component({
    selector: 'app-brokers-add',
    imports: [
        TranslatePipe,
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        Select,
        DashboardContentLayoutComponent,
        InputText,
        RadioCardsComponent,
        Message
    ],
    templateUrl: './add.component.html',
    styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {

  private readonly configManual: RadioCardItem = {
    key: 'M',
    name: 'brokers.add.radio-type.manual-name',
    detail: 'brokers.add.radio-type.manual-detail',
    icon: 'pi-pencil'
  }
  protected readonly configSynchronized: RadioCardItem = {
    key: 'S',
    name: 'brokers.add.radio-type.sync-name',
    detail: 'brokers.add.radio-type.sync-detail',
    icon: 'pi-sync'
  }
  protected readonly configs: RadioCardItem[] = [
    this.configManual,
    this.configSynchronized
  ];

  loading = true;
  brokers!: BrokerWithImage[];

  constructor(
    private notificationService: NotificationService,
    private brokerService: BrokerService,
    private fb: FormBuilder,
    protected formService: FormService,
    private brokerImageService: BrokerImageService,
  ) {

    const form = this.fb.group({
      broker: ['', Validators.required],
      config: ['', Validators.required],
      apiKey: [],
      apiSecret: [],
    });

    // Dynamic validators depending on the broker config
    form.get('config')?.valueChanges.subscribe((value) => {
      if (value && typeof value === 'object' && value === this.configSynchronized) {
        form.get('apiKey')?.addValidators(Validators.required);
        form.get('apiSecret')?.addValidators(Validators.required);
      } else {
        form.get('apiKey')?.clearValidators();
        form.get('apiSecret')?.clearValidators();
      }
      form.get('apiKey')?.updateValueAndValidity();
      form.get('apiSecret')?.updateValueAndValidity();
    })

    this.formService.init(form);
  }

  ngOnInit() {
    this.loadBrokers()
  }

  loadBrokers() {
    this.loading = true;
    this.brokerImageService.getBrokersWithImages(true).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: ModelsBroker[]) => {
        this.brokers = brokers;
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  addBroker() {
    // Skip if form invalid
    if (this.formService.isInvalid()) {
      return;
    }

    // Prepare
    this.loading = true;
    const brokerUser : ModelsBrokerUserInput = {
      broker_id: this.formService.getFormValue().broker.id,
    }

    // Call API
    this.brokerService.createUserBroker(brokerUser).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        // Success
        this.notificationService.showToastSuccess('brokers.messages.add-success')
        this.formService.rollbackToDefault();
        this.loadBrokers() // update data
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService, this.handleErrors400.bind(this));
      },
    })
  }

  handleErrors400(error: ResponseError) {
    switch (error.message) {
      case 'broker-required':
        this.formService.setFieldErrors('broker', ['submit-required']);
        break;
      case 'broker-used':
        this.formService.setFieldErrors('broker', ['submit-used']);
        break;
      default:
        this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
        break;
    }
  }
}

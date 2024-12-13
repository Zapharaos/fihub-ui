import {Component, OnInit} from '@angular/core';
import {BrokersBroker, BrokersService, BrokersUserBroker, UserBrokerService} from "@core/api";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize} from "rxjs";
import {NotificationService} from "@shared/services/notification.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Select} from "primeng/select";
import {
  DashboardItemLayoutComponent
} from "@modules/dashboard/layouts/dashboard-item-layout/dashboard-item-layout.component";
import {InputText} from "primeng/inputtext";
import {RadioCardItem, RadioCardsComponent} from "@shared/components/radio-cards/radio-cards.component";
import {Ripple} from "primeng/ripple";
import {
  ctrlHasErrorTouched,
  isFieldValuable,
  isFieldValueEqual,
  isFormInvalid,
  isSubmitDisabled
} from "@shared/utils/form";
import {Message} from "primeng/message";
import {TableBroker} from "@modules/dashboard/pages/brokers/brokers.component";

const configManual: RadioCardItem = {
  key: 'M',
  name: 'brokers.add.radio-type.manual-name',
  detail: 'brokers.add.radio-type.manual-detail',
  icon: 'pi-pencil'
}
const configSynchronized: RadioCardItem = {
  key: 'S',
  name: 'brokers.add.radio-type.sync-name',
  detail: 'brokers.add.radio-type.sync-detail',
  icon: 'pi-sync'
}

type FormType = {
  broker: BrokersBroker[],
  config: RadioCardItem,
  apiKey: string,
  apiSecret: string,
}

@Component({
  selector: 'app-add-broker',
  standalone: true,
  imports: [
    TranslatePipe,
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    Select,
    DashboardItemLayoutComponent,
    InputText,
    RadioCardsComponent,
    Ripple,
    Message
  ],
  templateUrl: './add-broker.component.html',
  styleUrl: './add-broker.component.scss'
})
export class AddBrokerComponent implements OnInit {

  loading: boolean = true;
  brokers!: BrokersBroker[];
  formBroker: FormGroup;

  configs: RadioCardItem[] = [
    configManual,
    configSynchronized
  ];

  // TODO : validators on submit

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private brokersService: BrokersService,
    private userBrokerService: UserBrokerService,
    private fb: FormBuilder
  ) {
    this.formBroker = this.initForm()
  }

  initForm(): FormGroup {
    const form = this.fb.group({
      broker: ['', Validators.required],
      config: ['', Validators.required],
      apiKey: [],
      apiSecret: [],
    });

    // Dynamic validators depending on the broker config
    form.get('config')?.valueChanges.subscribe((value) => {
      if (value && typeof value === 'object' && value === configSynchronized) {
        form.get('apiKey')?.addValidators(Validators.required);
        form.get('apiSecret')?.addValidators(Validators.required);
      } else {
        form.get('apiKey')?.clearValidators();
        form.get('apiSecret')?.clearValidators();
      }
      form.get('apiKey')?.updateValueAndValidity();
      form.get('apiSecret')?.updateValueAndValidity();
    })

    return form;
  }

  ngOnInit() {
    this.loadBrokers()
  }

  loadBrokers() {
    this.loading = true;
    this.brokersService.getBrokers().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: brokers => {
        this.brokers = brokers
      }
    })
  }

  addBroker() {
    // Skip if form invalid
    if (isFormInvalid(this.formBroker)) {
      return;
    }

    // Prepare
    this.loading = true;
    const userBroker : BrokersUserBroker = {
      broker_id: this.formBroker.value.broker.id,
    }

    // Call API
    this.userBrokerService.createUserBroker(userBroker).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: TableBroker[]) => {
        // Success
        this.brokers = brokers // update data
        this.formBroker = this.initForm() // clear form
        this.notificationService.showToastSuccess('brokers.messages.add-success')
      },
      error: (error: any) => {
        switch (error.status) {
          case 400:
            this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
      },
    })
  }

  protected readonly ctrlHasErrorTouched = ctrlHasErrorTouched;
  protected readonly isSubmitDisabled = isSubmitDisabled;
  protected readonly isFieldValuable = isFieldValuable;
  protected readonly isFieldValueEqual = isFieldValueEqual;
  protected readonly configSynchronized = configSynchronized;
}

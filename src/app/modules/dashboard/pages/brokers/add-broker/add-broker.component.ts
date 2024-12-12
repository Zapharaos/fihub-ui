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

const configManual: RadioCardItem = {
  key: 'M',
  name: 'dashboard.brokers.add.radio-type.manual-name',
  detail: 'dashboard.brokers.add.radio-type.manual-detail',
  icon: 'pi-pencil'
}
const configSynchronized: RadioCardItem = {
  key: 'S',
  name: 'dashboard.brokers.add.radio-type.sync-name',
  detail: 'dashboard.brokers.add.radio-type.sync-detail',
  icon: 'pi-sync'
}

@Component({
    selector: 'app-add-broker',
    imports: [
        TranslatePipe,
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        Select,
        DashboardItemLayoutComponent,
        InputText,
        RadioCardsComponent
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

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private brokersService: BrokersService,
    private userBrokerService: UserBrokerService,
    private fb: FormBuilder
  ) {
    this.formBroker = this.fb.group({
      broker: ['', Validators.required],
      config: ['', Validators.required],
      apiKey: ['', Validators.required],
      apiSecret: ['', Validators.required],
    });
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
    console.log(this.formBroker.get('mode')?.value.key)
    /*this.loading = true;
    const userBroker : BrokersUserBroker = {
      broker_id: this.formBroker.value.broker.id,
    }
    this.userBrokerService.createUserBroker(userBroker).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: TableBroker[]) => {
        this.brokers = brokers
        this.notificationService.showToastSuccess('dashboard.brokers.messages.add-success')
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
    })*/
  }

  isConfigSynchronized() {
    return this.formBroker.get('config')?.value === configSynchronized;
  }
}

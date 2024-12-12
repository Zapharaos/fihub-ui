import {Component, OnInit} from '@angular/core';
import {BrokersBroker, BrokersService, BrokersUserBroker, UserBrokerService} from "@core/api";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize} from "rxjs";
import {TableBroker} from "@modules/dashboard/pages/brokers/brokers.component";
import {NotificationService} from "@shared/services/notification.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Select} from "primeng/select";
import {
  DashboardItemLayoutComponent
} from "@modules/dashboard/layouts/dashboard-item-layout/dashboard-item-layout.component";

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
  ],
  templateUrl: './add-broker.component.html',
  styleUrl: './add-broker.component.scss'
})
export class AddBrokerComponent implements OnInit {

  loading: boolean = true;
  brokers!: BrokersBroker[];
  formBroker: FormGroup;

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private brokersService: BrokersService,
    private userBrokerService: UserBrokerService,
    private fb: FormBuilder
  ) {
    this.formBroker = this.fb.group({
      broker: ['', Validators.required],
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
    this.loading = true;
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
    })
  }
}

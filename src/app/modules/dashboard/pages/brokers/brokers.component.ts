import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {Table, TableModule} from "primeng/table";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationService} from "primeng/api";
import {finalize} from "rxjs";
import {UserBrokerService, BrokersBroker, BrokersUserBroker} from "@core/api";
import {NotificationService} from "@shared/services/notification.service";
import {RouterLink} from "@angular/router";
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {applyFilterGlobal, onRowEditCancel, onRowEditInit, onRowEditSave} from "@shared/utils/table";
import {DialogService} from "@shared/services/dialog.service";
import {ConfirmService} from "@shared/services/confirm.service";
import {BrokerDataService, UserBrokerWithImage} from "@core/services/broker-data.service";

// TODO : temp fields
export interface TableBroker extends BrokersUserBroker {
  apiKey?: string;
  apiSecret?: string;
}

@Component({
  selector: 'app-brokers',
  standalone: true,
  imports: [
    TranslatePipe,
    TableModule,
    IconField,
    InputIcon,
    InputTextModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DashboardContentLayoutComponent,
  ],
  templateUrl: './brokers.component.html',
  styleUrl: './brokers.component.scss'
})
export class BrokersComponent implements OnInit {

  loading: boolean = true;
  userBrokers!: UserBrokerWithImage[];
  clonedUserBrokers: { [s: string]: BrokersUserBroker } = {};
  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private userBrokerService: UserBrokerService,
    private brokerDataService: BrokerDataService,
  ) { }

  ngOnInit() {
    this.loadBrokers()
  }

  // Brokers

  loadBrokers() {
    this.loading = true;
    this.brokerDataService.getUsersBrokersWithImages().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: UserBrokerWithImage[]) => {
        this.userBrokers = brokers;
      },
      error: () => {
        this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
      }
    })
  }

  deleteBroker(broker: BrokersUserBroker) {
    this.loading = true;
    this.userBrokerService.deleteUserBroker(broker.broker?.id!).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.loadBrokers()
        this.notificationService.showToastSuccess('brokers.messages.delete-success', {name: broker.broker?.name})
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
      }
    })
  }

  // Table

  onWrapperRowEditSave(broker: BrokersUserBroker) {
    // TODO : PUT
    this.notificationService.showToastSuccess('brokers.messages.edit-success', {name: broker.broker?.name})

    onRowEditSave(this.clonedUserBrokers, broker)
  }

  onRowDelete(event: Event, broker: BrokersUserBroker) {
    this.confirmService.showDeleteConfirmation(event, () => this.deleteBroker(broker))
  }

  // Utils - Table
  protected readonly onRowEditInit = onRowEditInit;
  protected readonly applyFilterGlobal = applyFilterGlobal;
  protected readonly onRowEditCancel = onRowEditCancel;
}

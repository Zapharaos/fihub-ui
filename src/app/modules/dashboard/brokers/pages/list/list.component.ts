import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {Table, TableModule} from "primeng/table";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {finalize} from "rxjs";
import {BrokerUserService, ModelsBrokerUser} from "@core/api";
import {NotificationService} from "@shared/services/notification.service";
import {RouterLink} from "@angular/router";
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {applyFilterGlobal, onRowEditCancel, onRowEditInit, onRowEditSave} from "@shared/utils/table";
import {ConfirmService} from "@shared/services/confirm.service";
import {BrokerImageService, UserBrokerWithImage} from "@shared/services/broker-image.service";
import {handleErrors} from "@shared/utils/errors";
import {Skeleton} from "primeng/skeleton";

// TODO : temp fields
export interface TableBroker extends ModelsBrokerUser {
  apiKey?: string;
  apiSecret?: string;
}

@Component({
    selector: 'app-brokers-list',
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
        Skeleton,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  loading = true;
  userBrokers!: UserBrokerWithImage[];
  clonedUserBrokers: Record<string, ModelsBrokerUser> = {};
  protected readonly tablePropertiesFilter = ['broker.name']
  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private brokerUserService: BrokerUserService,
    private brokerImageService: BrokerImageService,
  ) { }

  ngOnInit() {
    this.loadBrokers()
  }

  // Brokers

  loadBrokers() {
    this.loading = true;
    this.brokerImageService.getUsersBrokersWithImages().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: UserBrokerWithImage[]) => {
        this.userBrokers = brokers;
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  deleteBroker(broker: ModelsBrokerUser) {
    this.loading = true;
    if (broker.broker?.id) {
      this.brokerUserService.deleteUserBroker(broker.broker.id).pipe(finalize(() => {
        this.loading = false;
      })).subscribe({
        next: () => {
          this.loadBrokers()
          this.notificationService.showToastSuccess('brokers.messages.delete-success', {name: broker.broker?.name})
        },
        error: (error: Error) => {
          handleErrors(error, this.notificationService);
        }
      })
    }
  }

  // Table

  onWrapperRowEditSave(broker: ModelsBrokerUser) {
    // TODO : PUT
    this.notificationService.showToastSuccess('brokers.messages.edit-success', {name: broker.broker?.name})

    onRowEditSave(this.clonedUserBrokers, broker)
  }

  onRowDelete(event: Event, broker: ModelsBrokerUser) {
    this.confirmService.showDeleteConfirmation(event, () => this.deleteBroker(broker))
  }

  // Utils - Table
  protected readonly onRowEditInit = onRowEditInit;
  protected readonly applyFilterGlobal = applyFilterGlobal;
  protected readonly onRowEditCancel = onRowEditCancel;
}

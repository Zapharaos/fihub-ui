import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {Table, TableModule} from "primeng/table";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from "primeng/api";
import {finalize, forkJoin} from "rxjs";
import {UserBrokerService, BrokersBroker, BrokersUserBroker, BrokersService} from "@core/api";
import {Dialog} from "primeng/dialog";
import {Select} from "primeng/select";
import {NotificationService} from "@shared/services/notification.service";

// TODO : temp fields
export interface TableBroker extends BrokersBroker {
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
    Dialog,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './brokers.component.html',
  styleUrl: './brokers.component.scss'
})
export class BrokersComponent implements OnInit {
  rawBrokers!: BrokersBroker[];
  brokers!: TableBroker[];
  clonedBrokers: { [s: string]: TableBroker } = {};
  loading: boolean = true;
  dialogAddBrokerVisible: boolean = false;
  @ViewChild('dt') dt: Table | undefined;
  formBroker: FormGroup;

  /*userBroker: BrokersUserBroker*/

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
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

  loadRawBrokers() {
    this.brokersService.getBrokers().subscribe({
      next: rawBrokers => {
        this.rawBrokers = rawBrokers
      }
    })
  }

  loadBrokers() {
    this.loading = true;
    this.userBrokerService.getUserBrokers().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: TableBroker[]) => {
        this.brokers = brokers;
      },
      error: () => {
        this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
      }
    })
  }

  deleteBroker(broker: TableBroker) {
    this.loading = true;
    this.userBrokerService.deleteUserBroker(broker.id ?? '').pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: TableBroker[]) => {
        this.brokers = brokers
        this.notificationService.showToastSuccess('dashboard.brokers.messages.delete-success', {name: broker.name})
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

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onRowEditInit(broker: TableBroker) {
    this.clonedBrokers[broker.id as string] = { ...broker };
  }

  onRowEditSave(broker: TableBroker) {
    delete this.clonedBrokers[broker.id as string];

    // TODO : PUT
    this.notificationService.showToastSuccess('dashboard.brokers.messages.edit-success', {name: broker.name})
  }

  onRowEditCancel(broker: TableBroker, index: number) {
    this.brokers[index] = this.clonedBrokers[broker.id as string];
    delete this.clonedBrokers[broker.id as string];
  }

  onRowDelete(event: Event, broker: TableBroker) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('confirmation.delete.header'),
      message: this.translateService.instant('confirmation.delete.message'),
      rejectButtonProps: {
        label: this.translateService.instant('confirmation.cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translateService.instant('confirmation.delete.button'),
        severity: 'danger',
      },

      accept: () => {
        this.deleteBroker(broker)
      }
    });

  }

  openDialogAddBroker() {
    this.loadRawBrokers()
    this.dialogAddBrokerVisible = true;
  }
}

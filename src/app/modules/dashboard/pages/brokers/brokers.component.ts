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
    private messageService: MessageService,
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
        forkJoin([
          this.translateService.get('http.500.summary'),
          this.translateService.get('http.500.detail')]
        ).subscribe(([summary, detail]) => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: summary,
            detail: detail,
            life: 5000
          });
        });
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
        forkJoin([
          this.translateService.get('messages.success'),
          this.translateService.get('dashboard.brokers.messages.delete-success', {name: broker.name})]
        ).subscribe(([summary, detail]) => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'success',
            summary: summary,
            detail: detail,
            life: 5000
          });
        });
      },
      error: (error: any) => {
        switch (error.status) {
          case 400:
            forkJoin([
              this.translateService.get('http.400.summary'),
              this.translateService.get('http.400.detail')]
            ).subscribe(([summary, detail]) => {
              this.messageService.add({
                key: 'main-toast',
                severity: 'error',
                summary: summary,
                detail: detail,
                life: 5000
              });
            });
            break;
          default:
            forkJoin([
              this.translateService.get('http.500.summary'),
              this.translateService.get('http.500.detail')]
            ).subscribe(([summary, detail]) => {
              this.messageService.add({
                key: 'main-toast',
                severity: 'error',
                summary: summary,
                detail: detail,
                life: 5000
              });
            });
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
        forkJoin([
          this.translateService.get('messages.success'),
          this.translateService.get('dashboard.brokers.messages.add-success')]
        ).subscribe(([summary, detail]) => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'success',
            summary: summary,
            detail: detail,
            life: 5000
          });
        });
      },
      error: (error: any) => {
        switch (error.status) {
          case 400:
            forkJoin([
              this.translateService.get('http.400.summary'),
              this.translateService.get('http.400.detail')]
            ).subscribe(([summary, detail]) => {
              this.messageService.add({
                key: 'main-toast',
                severity: 'error',
                summary: summary,
                detail: detail,
                life: 5000
              });
            });
            break;
          default:
            forkJoin([
              this.translateService.get('http.500.summary'),
              this.translateService.get('http.500.detail')]
            ).subscribe(([summary, detail]) => {
              this.messageService.add({
                key: 'main-toast',
                severity: 'error',
                summary: summary,
                detail: detail,
                life: 5000
              });
            });
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

    forkJoin([
      this.translateService.get('messages.success'),
      this.translateService.get('dashboard.brokers.messages.edit-success', {name: broker.name})]
    ).subscribe(([summary, detail]) => {
      this.messageService.add({
        key: 'main-toast',
        severity: 'success',
        summary: summary,
        detail: detail,
        life: 5000
      });
    });
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

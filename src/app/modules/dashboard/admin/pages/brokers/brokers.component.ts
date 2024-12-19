import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {applyFilterGlobal} from "@shared/utils/table";
import {Table, TableModule} from "primeng/table";
import {NotificationService} from "@shared/services/notification.service";
import {PrimeTemplate} from "primeng/api";
import {BrokerImagesService, BrokersBroker, BrokersBrokerImage, BrokersService} from "@core/api";
import {finalize} from "rxjs";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Tag} from "primeng/tag";
import {FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {DialogMode, DialogService} from "@shared/services/dialog.service";
import {Dialog} from "primeng/dialog";
import {NgIf} from "@angular/common";
import {ToggleSwitch} from "primeng/toggleswitch";
import {ButtonProps} from "primeng/button/button.interface";
import {ConfirmService} from "@shared/services/confirm.service";
import {FormService} from "@shared/services/form.service";
import {Message} from "primeng/message";
import {BrokerDataService, BrokerWithImage} from "@core/services/broker-data.service";

@Component({
  selector: 'app-brokers',
  standalone: true,
  imports: [
    DashboardContentLayoutComponent,
    Button,
    IconField,
    InputIcon,
    InputText,
    TranslatePipe,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Tag,
    FileUploadModule,
    Dialog,
    NgIf,
    ToggleSwitch,
    Message
  ],
  templateUrl: './brokers.component.html',
  styleUrl: './brokers.component.scss'
})
export class BrokersComponent implements OnInit {

  // Global
  loading: boolean = true;

  // Table
  brokers!: BrokerWithImage[];
  @ViewChild('dt') dt: Table | undefined;
  protected readonly tablePropertiesFilter = ['name', 'disabled']

  // Dialog
  dialogVisible: boolean = false;
  broker!: BrokerWithImage;

  // File upload
  fileUploadPropsUpdate: ButtonProps = {
    severity: 'contrast',
    loading: !this.loading,
    outlined: true,
    size: 'small',
  }
  fileUploadPropsCreate: ButtonProps = {
    severity: 'primary',
    loading: !this.loading,
  }

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private brokersService: BrokersService,
    private brokerImagesService: BrokerImagesService,
    private brokerDataService: BrokerDataService,
    private fb: FormBuilder,
    protected dialogService: DialogService,
    protected formService: FormService,
  ) {
    this.formService.init(this.fb.group({
      name: ['', Validators.required],
      disabled: [false, Validators.required],
    }))

    this.dialogService.dialogVisibilityChange.subscribe((isVisible: boolean) => {
      this.dialogVisible = isVisible;
    });

    this.dialogService.setDialogPropsCreate(this.createBroker.bind(this));
    this.dialogService.setDialogPropsUpdate(this.updateBroker.bind(this));
  }

  ngOnInit() {
    this.loadBrokers()
  }

  // Load

  loadBrokers() {
    this.loading = true;
    this.brokerDataService.getBrokersWithImages().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: BrokersBroker[]) => {
        this.brokers = brokers;
        console.log(brokers)
      },
      error: (error: any) => {
        this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
      }
    })
  }

  // Utils

  getStatusValue(disabled: boolean): string {
    return disabled ? this.translateService.instant('admin.brokers.disabled.true') : this.translateService.instant('admin.brokers.disabled.false');
  }

  getStatusSeverity(disabled: boolean) {
    return disabled ? 'danger' : 'success';
  }

  // Table

  onRowDelete(event: Event, broker:  BrokersBroker) {
    this.confirmService.showDeleteConfirmation(event, () => this.deleteBroker(broker))
  }

  // Dialog

  openDialog(dialogMode: DialogMode, broker?: BrokersBroker) {
    this.dialogService.openDialog(dialogMode);

    switch (dialogMode) {
      case DialogMode.CREATE:
        this.broker = {};
        this.formService.clear()
        break;
      case DialogMode.UPDATE:
        this.broker = {...broker};
        this.formService.patchValue(this.broker);
        break;
    }
  }

  closeDialog() {
    this.broker = {};
    this.formService.reset();
    this.dialogService.closeDialog();
  }

  // Brokers

  deleteBroker(broker: BrokersBroker) {
    this.loading = true;
    this.brokersService.deleteBroker(broker.id ?? '').pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('brokers.messages.delete-success', {name: broker.name})
      },
      error: (error: any) => {
        switch (error.status) {
          case 400:
            this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
            break;
          case 404:
            this.notificationService.showToastError('http.404.detail', undefined, 'http.404.summary')
            break;
          default:
            this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
            break;
        }
      },
    })
  }

  createBroker() {
    if (this.formService.isInvalid()) {
      return;
    }
    this.loading = true;
    this.brokersService.createBroker(this.formService.getFormValue()).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (broker: BrokersBroker) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.create-success', {name: broker.name});
        this.dialogService.openDialog(DialogMode.IMAGE);
        this.broker = broker;
      },
      error: (error: any) => {
        this.handleBrokerErrors(error);
      }
    })
  }

  updateBroker() {
    if (this.formService.isInvalid()) {
      return;
    }
    this.loading = true;
    this.brokersService.updateBroker(this.broker.id!, this.formService.getFormValue()).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (broker: BrokersBroker) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: broker.name});
        this.dialogService.closeDialog();
      },
      error: (error: any) => {
        this.handleBrokerErrors(error);
      }
    })
  }

  // Broker - Errors

  handleBrokerErrors(error: any) {
    switch (error.status) {
      case 400:
        this.handleBrokerErrors400(error);
        break;
      case 404:
        this.notificationService.showToastError('http.404.detail', undefined, 'http.404.summary')
        break;
      default:
        this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
        break;
    }
  }

  handleBrokerErrors400(error: any) {
    switch (error.error.message) {
      case 'name-required':
        this.formService.setFieldErrors('name', ['submit-required']);
        break;
      case 'name-used':
        this.formService.setFieldErrors('name', ['submit-used']);
        break;
      default:
        this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
        break;
    }
  }

  // Broker Images

  uploadBrokerImage(event: FileUploadHandlerEvent) {
    if (!this.broker.image_id) {
      this.createBrokerImage(event);
    } else {
      this.updateBrokerImage(event);
    }
  }

  createBrokerImage(event: FileUploadHandlerEvent) {
    this.brokerImagesService.createBrokerImage(this.broker.id!, event.files[0]).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (image: BrokersBrokerImage) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: this.broker.name})
        if (this.dialogService.isDialogModeImage()) {
          this.dialogService.closeDialog();
        }
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

  updateBrokerImage(event: FileUploadHandlerEvent) {
    this.brokerImagesService.updateBrokerImage(this.broker.id!, this.broker.image_id!, event.files[0]).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (image: BrokersBrokerImage) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: this.broker.name})
        // update image
        this.broker.imageUrl = URL.createObjectURL(event.files[0]);
      },
      error: (error: any) => {
        switch (error.status) {
          case 400:
            this.notificationService.showToastError('http.400.detail', undefined, 'http.400.summary')
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

  protected readonly applyFilterGlobal = applyFilterGlobal;
  protected readonly DialogMode = DialogMode;
}

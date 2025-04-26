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
import {BrokerImagesService, ModelsBroker, BrokersService} from "@core/api";
import {finalize} from "rxjs";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Tag} from "primeng/tag";
import {FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {DialogMode, DialogService} from "@shared/services/dialog.service";
import {Dialog} from "primeng/dialog";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ToggleSwitch} from "primeng/toggleswitch";
import {ButtonProps} from "primeng/button/button.interface";
import {ConfirmService} from "@shared/services/confirm.service";
import {FormService} from "@shared/services/form.service";
import {Message} from "primeng/message";
import {BrokerImageService, BrokerWithImage} from "@shared/services/broker-image.service";
import {handleErrors, ResponseError} from "@shared/utils/errors";
import {Skeleton} from "primeng/skeleton";
import {PermissionDirective} from "@shared/directives/permission.directive";

@Component({
    selector: 'app-admin-brokers',
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
    Message,
    Skeleton,
    NgForOf,
    PermissionDirective,
    NgTemplateOutlet
  ],
    templateUrl: './brokers.component.html',
    styleUrl: './brokers.component.scss'
})
export class BrokersComponent implements OnInit {

  // Global
  loading = true;

  // Table
  brokers!: BrokerWithImage[];
  @ViewChild('dt') dt: Table | undefined;
  protected readonly tablePropertiesFilter = ['name', 'disabled']

  // Dialog
  dialogVisible = false;
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
    private brokerImageService: BrokerImageService,
    private fb: FormBuilder,
    protected dialogService: DialogService,
    protected formService: FormService,
  ) {

    this.formService.init(this.fb.group({
      name: ['', Validators.required],
      disabled: [false, Validators.required],
    }))

    this.dialogService.init([
      {
        status: DialogMode.CREATE,
        titleLabel: 'admin.brokers.dialog.title',
        submitLabel: 'actions.update',
        action: this.createBroker.bind(this),
      },
      {
        status: DialogMode.UPDATE,
        titleLabel: 'admin.brokers.dialog.title',
        submitLabel: 'actions.update',
        action: this.updateBroker.bind(this),
      },
      {
        status: DialogMode.IMAGE,
        titleLabel: 'admin.brokers.dialog.image.label',
      },
    ]);

    this.dialogService.dialogVisibilityChange.subscribe((isVisible: boolean) => {
      this.dialogVisible = isVisible;
    });
  }

  ngOnInit() {
    this.loadBrokers()
  }

  // Load

  loadBrokers() {
    this.loading = true;
    this.brokerImageService.getBrokersWithImages().pipe(finalize(() => {
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

  // Utils

  getStatusValue(disabled: boolean): string {
    return disabled ? this.translateService.instant('admin.brokers.disabled.true') : this.translateService.instant('admin.brokers.disabled.false');
  }

  getStatusSeverity(disabled: boolean) {
    return disabled ? 'danger' : 'success';
  }

  // Table

  onRowSelect() {
    this.openDialog(DialogMode.UPDATE, this.broker);
  }

  onRowDelete(event: Event, broker:  ModelsBroker) {
    this.confirmService.showDeleteConfirmation(event, () => this.deleteBroker(broker))
  }

  // Dialog

  openDialog(dialogMode: DialogMode, broker?: ModelsBroker) {
    this.dialogService.open(dialogMode);

    switch (dialogMode) {
      case DialogMode.CREATE:
        this.broker = {};
        this.formService.rollbackToDefault()
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
    this.dialogService.close();
  }

  // Brokers

  deleteBroker(broker: ModelsBroker) {
    this.loading = true;
    this.brokersService.deleteBroker(broker.id ?? '').pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('brokers.messages.delete-success', {name: broker.name})
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
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
      next: (broker: ModelsBroker) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.create-success', {name: broker.name});
        this.dialogService.open(DialogMode.IMAGE);
        this.broker = broker;
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService, this.handleBrokerErrors400.bind(this));
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
      next: (broker: ModelsBroker) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: broker.name});
        this.dialogService.close();
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService, this.handleBrokerErrors400.bind(this));
      }
    })
  }

  // Broker - Errors

  handleBrokerErrors400(error: ResponseError) {
    switch (error.message) {
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
      next: () => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: this.broker.name})
        if (this.dialogService.isActive(DialogMode.IMAGE)) {
          this.dialogService.close();
        }
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  updateBrokerImage(event: FileUploadHandlerEvent) {
    this.brokerImagesService.updateBrokerImage(this.broker.id!, this.broker.image_id!, event.files[0]).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: this.broker.name})
        // update image
        this.broker.imageUrl = URL.createObjectURL(event.files[0]);
      },
      error: (error: Error) => {
        handleErrors(error, this.notificationService);
      }
    })
  }

  protected readonly applyFilterGlobal = applyFilterGlobal;
  protected readonly DialogMode = DialogMode;
}

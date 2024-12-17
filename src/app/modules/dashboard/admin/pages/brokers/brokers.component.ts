import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DashboardContentLayoutComponent
} from "@modules/dashboard/layouts/dashboard-content-layout/dashboard-content-layout.component";
import {Button, ButtonDirective} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {applyFilterGlobal, onRowEditCancel, onRowEditInit} from "@shared/utils/table";
import {RouterLink} from "@angular/router";
import {Table, TableModule} from "primeng/table";
import {NotificationService} from "@shared/services/notification.service";
import {PrimeTemplate, SelectItem} from "primeng/api";
import {BrokerImagesService, BrokersBroker, BrokersService} from "@core/api";
import {finalize} from "rxjs";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Tag} from "primeng/tag";
import {Select} from "primeng/select";
import {FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {TableBroker} from "@modules/dashboard/pages/brokers/brokers.component";
import {OverlayService} from "@shared/services/overlay.service";
import {Dialog} from "primeng/dialog";
import {ctrlHasErrorTouched, ctrlHasSpecifiedError, ctrlHasSpecifiedErrorTouched} from "@shared/utils/form";
import {NgIf} from "@angular/common";
import {ToggleSwitch} from "primeng/toggleswitch";
import {ButtonProps} from "primeng/button/button.interface";

enum DialogMode {
  HIDDEN = 'hidden',
  CREATE = 'create',
  UPDATE = 'update',
  IMAGE = 'image'
}

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
    RouterLink,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Tag,
    Select,
    FileUploadModule,
    Dialog,
    NgIf,
    ButtonDirective,
    ToggleSwitch
  ],
  templateUrl: './brokers.component.html',
  styleUrl: './brokers.component.scss'
})
export class BrokersComponent implements OnInit {

  // Global
  loading: boolean = true;

  // Table
  brokers!: BrokersBroker[];
  @ViewChild('dt') dt: Table | undefined;
  protected readonly tablePropertiesFilter = ['name', 'disabled']
  private imageUrls: { [key: string]: string } = {};

  // Dialog
  dialogVisible: boolean = false;
  dialogMode: DialogMode = DialogMode.HIDDEN;
  broker!: BrokersBroker;
  formBroker: FormGroup;

  // File upload
  fileUploadPropsUpdate : ButtonProps = {
    severity: 'contrast',
    loading: !this.loading,
    outlined: true,
    size: 'small',
  }
  fileUploadPropsCreate : ButtonProps = {
    severity: 'primary',
    loading: !this.loading,
  }

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private overlayService: OverlayService,
    private brokersService: BrokersService,
    private brokerImagesService: BrokerImagesService,
    private fb: FormBuilder
  ) {
    this.formBroker = this.initForm()
  }

  ngOnInit() {
    this.loadBrokers()
  }

  initForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      disabled: ['', Validators.required],
    })
  }

  loadBrokers() {
    this.loading = true;
    this.brokersService.getBrokers().pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (brokers: BrokersBroker[]) => {
        this.brokers = brokers;

        // Retrieve the brokers images
        this.brokers.forEach(broker => {
          this.loadBrokerImage(broker.id, broker.image_id);
        })
      },
      error: (error: any) => {
        this.notificationService.showToastError('http.500.detail', undefined, 'http.500.summary')
      }
    })
  }

  loadBrokerImage(brokerID: any, imageID: any) {
    if (!brokerID || !imageID) {
      return;
    }
    this.brokerImagesService.getBrokerImage(brokerID, imageID).subscribe({
      next: (image: any) => {
        this.imageUrls[brokerID] = URL.createObjectURL(image);
      }
    })
  }

  hasBrokerImage(brokerID: string): boolean {
    return !!this.imageUrls[brokerID];
  }

  getBrokerImage(brokerID: string): string {
    return this.imageUrls[brokerID];
  }

  getStatusValue(disabled: boolean): string {
    return disabled ? this.translateService.instant('admin.brokers.disabled.true') : this.translateService.instant('admin.brokers.disabled.false');
  }

  getStatusSeverity(disabled: boolean) {
    return disabled ? 'success' : 'danger';
  }

  onRowDelete(event: Event, broker: TableBroker) {
    this.overlayService.showDeleteConfirmation(event, () => this.deleteBroker(broker))
  }

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

  getDialogCloseLabel(): string {
    switch (this.dialogMode) {
      case DialogMode.CREATE:
        return 'actions.cancel';
      case DialogMode.UPDATE:
        return 'actions.cancel';
      case DialogMode.IMAGE:
        return 'actions.close';
      default:
        return '';
    }
  }

  getDialogSubmitLabel(): string {
    switch (this.dialogMode) {
      case DialogMode.CREATE:
        return 'actions.create';
      case DialogMode.UPDATE:
        return 'actions.update';
      default:
        return '';
    }
  }

  openCreateDialog() {
    this.broker = {} as BrokersBroker;
    this.formBroker.reset();
    this.dialogVisible = true;
    this.dialogMode = DialogMode.CREATE;
  }

  openUpdateDialog(broker: BrokersBroker) {
    this.broker = { ...broker };
    this.formBroker.patchValue(this.broker);
    this.dialogVisible = true;
    this.dialogMode = DialogMode.UPDATE;
  }

  hideDialog() {
    this.broker = {};
    this.formBroker.reset();
    this.dialogVisible = false;
    this.dialogMode = DialogMode.HIDDEN;
  }

  submitDialog() {
    switch (this.dialogMode) {
      case DialogMode.CREATE:
        this.createBroker();
        break;
      case DialogMode.UPDATE:
        this.updateBroker();
        this.hideDialog();
        break;
    }
  }

  createBroker() {
    this.loading = true;
    this.brokersService.createBroker(this.formBroker.value).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (broker: BrokersBroker) => {
        this.notificationService.showToastSuccess('admin.brokers.messages.create-success', {name: broker.name})
        this.loadBrokers();
        this.broker = broker;
        this.dialogMode = DialogMode.IMAGE;
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

  updateBroker() {
    this.loading = true;
    this.brokersService.updateBroker(this.broker.id!, this.formBroker.value).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (broker: BrokersBroker) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: broker.name})
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
      next: (image: any) => {
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: image.name})
        this.loadBrokers();
        if (this.dialogMode === DialogMode.IMAGE) {
          this.hideDialog();
        }
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

  updateBrokerImage(event: FileUploadHandlerEvent) {
    this.brokerImagesService.updateBrokerImage(this.broker.id!, this.broker.image_id!, event.files[0]).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (image: any) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: image.name})
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

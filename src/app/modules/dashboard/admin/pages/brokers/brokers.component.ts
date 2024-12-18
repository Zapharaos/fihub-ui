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
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Tag} from "primeng/tag";
import {FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {TableBroker} from "@modules/dashboard/pages/brokers/brokers.component";
import {DialogMode, DialogProps, OverlayService} from "@shared/services/overlay.service";
import {Dialog} from "primeng/dialog";
import {NgIf} from "@angular/common";
import {ToggleSwitch} from "primeng/toggleswitch";
import {ButtonProps} from "primeng/button/button.interface";

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
    ToggleSwitch
  ],
  templateUrl: './brokers.component.html',
  styleUrl: './brokers.component.scss'
})
export class BrokersComponent implements OnInit {

  // TODO : errors

  // Global
  loading: boolean = true;

  // Table
  brokers!: BrokersBroker[];
  @ViewChild('dt') dt: Table | undefined;
  protected readonly tablePropertiesFilter = ['name', 'disabled']
  private imageUrls: { [key: string]: string } = {};

  // Dialog
  broker!: BrokersBroker;
  formBroker: FormGroup;
  dialogProps: DialogProps = {
    dialogMode: DialogMode.HIDDEN,
    dialogVisible: false,
  }

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
    protected overlayService: OverlayService,
    private brokersService: BrokersService,
    private brokerImagesService: BrokerImagesService,
    private fb: FormBuilder
  ) {
    this.formBroker = this.fb.group({
      name: ['', Validators.required],
      disabled: ['', Validators.required],
    })

    this.dialogProps.create = this.createBroker.bind(this);
    this.dialogProps.update = this.updateBroker.bind(this);
  }

  ngOnInit() {
    this.loadBrokers()
  }

  // Load

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

  // Utils

  getBrokerNameFromImage(image: BrokersBrokerImage): string {
    return this.brokers.find(b => b.image_id === image.id)?.name!;
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

  // Dialog

  openDialog(dialogMode: DialogMode, broker?: BrokersBroker) {
    this.overlayService.openDialog(this.dialogProps, dialogMode);

    switch (dialogMode) {
      case DialogMode.CREATE:
        this.broker = {};
        this.formBroker.reset();
        break;
      case DialogMode.UPDATE:
        this.broker = {...broker};
        this.formBroker.patchValue(this.broker);
        break;
    }
  }

  closeDialog() {
    this.broker = {};
    this.formBroker.reset();
    this.overlayService.closeDialog(this.dialogProps);
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
    this.loading = true;
    this.brokersService.createBroker(this.formBroker!.value).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (broker: BrokersBroker) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.create-success', {name: broker.name});
        this.overlayService.openDialog(this.dialogProps, DialogMode.IMAGE);
        this.broker = broker;
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
    this.brokersService.updateBroker(this.broker.id!, this.formBroker!.value).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (broker: BrokersBroker) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: broker.name});
        this.overlayService.closeDialog(this.dialogProps);
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

  // Broker images

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
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: this.getBrokerNameFromImage(image)})
        if (this.overlayService.isDialogModeImage(this.dialogProps)) {
          this.overlayService.closeDialog(this.dialogProps);
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
      next: (image: BrokersBrokerImage) => {
        this.loadBrokers();
        this.notificationService.showToastSuccess('admin.brokers.messages.update-success', {name: this.getBrokerNameFromImage(image)})
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

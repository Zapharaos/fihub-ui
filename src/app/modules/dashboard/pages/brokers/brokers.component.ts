import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {Table, TableModule} from "primeng/table";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';
import {MessageService} from "primeng/api";
import {forkJoin} from "rxjs";

export type Broker = {
  id: string;
  name: string;
  apiKey?: string;
  apiSecret?: string;
};

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
    FormsModule
  ],
  templateUrl: './brokers.component.html',
  styleUrl: './brokers.component.scss'
})
export class BrokersComponent implements OnInit {
  brokers!: Broker[];
  clonedBrokers: { [s: string]: Broker } = {};
  loading: boolean = true;
  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private translateService: TranslateService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.brokers = [
      {
        id: '0',
        name: 'BpZbtUok',
        apiKey: '71FM4x7VtmvZiElf',
        apiSecret: '1YM0WfKB87cH3pq5',
      },
      {
        id: '1',
        name: 'BpSXzrcp',
        apiKey: '1YM0WfKB87cH3pq5',
        apiSecret: 'ql227V66nu0yAmkA',
      },
      {
        id: '2',
        name: 'nGTnQyvl',
        apiKey: 'ql227V66nu0yAmkA',
        apiSecret: '03icwgLJ5OXoyq3o',
      },
      {
        id: '3',
        name: 'rxvAuBOf',
        apiKey: 'EqZBS4IzH0O7GT79',
        apiSecret: 'N3E2Uj2jlDp1wuus',
      },
      {
        id: '4',
        name: 'XqcPWWJh',
        apiKey: 'd0afNTX5f4mpUupB',
        apiSecret: 'Y4Z7hntX386OS1Jv',
      },
    ]

    this.loading = false;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onRowEditInit(broker: Broker) {
    this.clonedBrokers[broker.id as string] = { ...broker };
  }

  onRowEditSave(broker: Broker) {
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

  onRowEditCancel(broker: Broker, index: number) {
    this.brokers[index] = this.clonedBrokers[broker.id as string];
    delete this.clonedBrokers[broker.id as string];
  }

  onRowDelete(broker: Broker) {
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
  }
}

import {Component, Input} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RadioButton} from "primeng/radiobutton";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Message} from "primeng/message";
import {FormService} from "@shared/services/form.service";

export type RadioCardItem = {
  key: string;
  name: string;
  icon?: string;
  detail?: string;
}

@Component({
  selector: 'app-radio-cards',
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe,
    NgClass,
    NgForOf,
    RadioButton,
    FormsModule,
    ReactiveFormsModule,
    Message,
  ],
  templateUrl: './radio-cards.component.html',
  styleUrl: './radio-cards.component.scss'
})
export class RadioCardsComponent {

  @Input() fieldLabel?: string;
  @Input() items!: RadioCardItem[];
  @Input() form!: FormGroup;
  @Input() control!: string;
  @Input() controlError!: string;

  constructor(
    protected formService: FormService
  ) { }

  activate(item: RadioCardItem) {
    this.form.get(this.control)?.setValue(item)
  }

  isActive(item: RadioCardItem): boolean {
    return this.form.get(this.control)?.value.key === item.key;
  }
}

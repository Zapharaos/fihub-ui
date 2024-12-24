import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-overview',
    imports: [
        TranslateModule,
        ButtonModule
    ],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}

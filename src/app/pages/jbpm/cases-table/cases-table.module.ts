import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
    NbCardModule, NbIconModule, NbInputModule,
    NbTreeGridModule, NbTabsetModule,
    NbTooltipModule, NbDatepickerModule, NbSelectModule,
    NbAccordionModule, NbButtonModule, NbDialogModule, NbCheckboxModule, NbSpinnerModule, NbToastrModule, NbListModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';


import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CasesTableComponent } from './cases-table.component';
import { casesTableRouting } from './cases-table-routing.module';

@NgModule({
    imports: [
        NbCardModule,
        NbTreeGridModule,
        NbIconModule,
        NbInputModule,
        ThemeModule,
        Ng2SmartTableModule,
        NbTabsetModule,
        ReactiveFormsModule,
        NbTooltipModule,
        NbDatepickerModule,
        NbSelectModule,
        NbAccordionModule,
        NbCardModule,
        NbButtonModule,
        NbDialogModule.forChild(),
        NbCheckboxModule,
        NbSpinnerModule,
        NbToastrModule.forRoot(),
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        casesTableRouting,
        NbListModule,
    ],
  declarations: [
    CasesTableComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class CasesTableModule { }

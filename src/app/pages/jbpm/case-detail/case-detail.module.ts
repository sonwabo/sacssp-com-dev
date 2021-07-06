import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbTabsetModule,
  NbTooltipModule,
  NbDatepickerModule,
  NbSelectModule,
  NbAccordionModule,
  NbButtonModule,
  NbDialogModule,
  NbCheckboxModule,
  NbSpinnerModule,
  NbToastrModule,
  NbListModule,
  NbRadioModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime';
import { ThemeModule } from '../../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CaseDetailComponent } from './case-detail.component';
import { casesDetailRouting } from './case-detail-routing.module';
import { CaseDocumentComponent } from '../case-documents/case-document.component';
import { TestSearchComponent } from '../utils/test-search.component';
import { CaseFileComponent } from '../case-file/case-file.component';

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
    casesDetailRouting,
    NbListModule,
    FormsModule,
    NbRadioModule,
  ],
  declarations: [
    CaseDetailComponent ,
    CaseDocumentComponent,
    TestSearchComponent,
    CaseFileComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class casesDetailModule { }

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
  NbToastrModule,
  NbButtonModule,
  NbLayoutModule,
  NbListModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DivisionComponent } from './division.component';
import { divisionRouting } from './division-routing.module';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbSpinnerModule,
    NbToastrModule.forRoot(),
    divisionRouting,
    NbLayoutModule,
    NbListModule,
  ],
  declarations: [
    DivisionComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class divisionModule { }

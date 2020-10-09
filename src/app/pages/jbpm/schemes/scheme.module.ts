import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { SchemeComponent } from './scheme.component';
import { schemeRouting } from './scheme-routing.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule, NbIconModule, NbInputModule,
  NbTooltipModule, NbButtonModule, NbSpinnerModule, NbToastrModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbTooltipModule,
    NbButtonModule,
    NbToastrModule.forRoot(),
    schemeRouting,
    ReactiveFormsModule,
    NbSpinnerModule,
  ],
  declarations: [
    SchemeComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class schemeModule { }

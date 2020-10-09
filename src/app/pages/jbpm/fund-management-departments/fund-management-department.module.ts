import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
  NbCardModule, NbIconModule, NbInputModule,
  NbTooltipModule, NbSelectModule, NbButtonModule, NbSpinnerModule, NbToastrModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FundManagementDepartmentComponent } from './fund-management-department.component';
import { fundManagementDepartmentRouting } from './fund-management-department-routing.module';
@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbTooltipModule,
    NbSelectModule,
    NbButtonModule,
    NbSpinnerModule,
    NbToastrModule.forRoot(),
    fundManagementDepartmentRouting,
  ],
  declarations: [
    FundManagementDepartmentComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class fundManagementDepartmentModule { }

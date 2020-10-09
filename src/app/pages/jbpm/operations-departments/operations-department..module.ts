import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
  NbCardModule, NbIconModule, NbInputModule, NbTabsetModule, NbSelectModule
  ,NbButtonModule, NbDialogModule, NbSpinnerModule, NbToastrModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { operationsDepartmentRouting } from './operations-department-routing.module';
import { OperationsDepartmentComponent } from './operations-department.component';
@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbButtonModule,
    NbDialogModule.forChild(),
    NbSpinnerModule,
    NbToastrModule.forRoot(),
    operationsDepartmentRouting,
  ],
  declarations: [
    OperationsDepartmentComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class operationsDepartmentModule { }

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
  NbCardModule, NbIconModule, NbInputModule,
  NbTreeGridModule, NbTabsetModule,
  NbTooltipModule, NbDatepickerModule, NbSelectModule,
  NbAccordionModule, NbButtonModule, NbDialogModule, NbCheckboxModule, NbSpinnerModule, NbToastrModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';


import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { userManagementRouting } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';

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
    userManagementRouting
  ],
  declarations: [
    UserManagementComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class userManagementModule { }

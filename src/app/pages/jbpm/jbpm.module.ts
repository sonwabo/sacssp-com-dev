import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
  NbCardModule, NbIconModule, NbInputModule,
  NbTreeGridModule, NbTabsetModule,
  NbTooltipModule, NbDatepickerModule, NbSelectModule,
  NbAccordionModule, NbButtonModule, NbDialogModule, NbCheckboxModule, NbSpinnerModule, NbToastrModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { JbpmRoutingModule, routedComponents } from './jbpm-routing.module';
import { CaseStatusRenderComponent } from './blocks/case-status-render.component';
import { SlaComplianceRenderComponent } from './blocks/sla-compliance-render.component';
import { EpochDateRenderComponent } from './blocks/epoch-date-render.component';
import { ReactiveFormsModule } from '@angular/forms';
import {UserKindRenderComponent} from './blocks/user-kind-render.component';
import {CommonConfigsComponent} from '@app/pages/jbpm/utils/CommonConfigs';
import {DepartmentRenderComponent} from '@app/pages/jbpm/blocks/department-render.component';

import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime';
import {CaseDataRenderComponent} from '@app/pages/jbpm/blocks/case-data-render.component';


@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    JbpmRoutingModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    ReactiveFormsModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbSelectModule,
    NbAccordionModule,
    NbCardModule,
    NbButtonModule,
    NbDialogModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbToastrModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [
    ...routedComponents,
    CaseStatusRenderComponent,
    SlaComplianceRenderComponent,
    EpochDateRenderComponent,
    UserKindRenderComponent,
    DepartmentRenderComponent,
    CaseDataRenderComponent,
    CommonConfigsComponent,
  ],
  entryComponents: [
    CaseStatusRenderComponent,
    CaseDataRenderComponent,
    SlaComplianceRenderComponent,
    EpochDateRenderComponent,
    DepartmentRenderComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class JbpmModule { }

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

import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime';
import { ConfirmDialogComponent } from '../../jbpm/common-component/confirm-dialog/confirm-dialog.component';
import { DepartmentRenderComponent } from './blocks/department-render.component';
import { CaseDataRenderComponent } from './blocks/case-data-render.component';
import { CommonConfigsComponent } from './utils/CommonConfigs';
import { divisionModule } from './divisions/division.module';
import { schemeModule } from './schemes/scheme.module';
import { casesTableModule } from './cases-table/cases-table.module';
import { casesDetailModule } from './case-detail/case-detail.module';
import { schemeOfficialsModule } from './scheme-officials/scheme-officials.module';
import { operationsDepartmentModule } from './operations-departments/operations-department..module';
import { fundManagementDepartmentModule } from './fund-management-departments/fund-management-department.module';
import { serviceProviderNetworksModule } from './service-provider-networks/service-provider-networks.module';
import { userManagementModule } from './users/user-management.module';


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
    NbDialogModule.forChild(),
    NbCheckboxModule,
    NbSpinnerModule,
    NbToastrModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    divisionModule,
    schemeModule,
    casesTableModule,
    casesDetailModule,
    userManagementModule,
    schemeOfficialsModule,
    operationsDepartmentModule,
    fundManagementDepartmentModule,
    serviceProviderNetworksModule,
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
    ConfirmDialogComponent,
  ],
  entryComponents: [
    CaseStatusRenderComponent,
    CaseDataRenderComponent,
    SlaComplianceRenderComponent,
    EpochDateRenderComponent,
    DepartmentRenderComponent,
    ConfirmDialogComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class JbpmModule { }

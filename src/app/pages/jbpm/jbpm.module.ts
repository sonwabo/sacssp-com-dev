import { NgModule } from '@angular/core';
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
import { FundManagementUpdateRequestComponent } from './fm-update-request/fund-management-update-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import {UserKindRenderComponent} from './blocks/user-kind-render.component';



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
  ],
  declarations: [
    ...routedComponents,
    CaseStatusRenderComponent,
    SlaComplianceRenderComponent,
    EpochDateRenderComponent,
    FundManagementUpdateRequestComponent,
    UserKindRenderComponent,
  ],
  entryComponents: [
    CaseStatusRenderComponent,
    SlaComplianceRenderComponent,
    EpochDateRenderComponent,
  ],
})
export class JbpmModule { }

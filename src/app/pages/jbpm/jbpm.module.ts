import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbTabsetModule, NbStepperModule, NbTooltipModule, NbDatepickerModule, NbSelectModule, NbAccordionModule, NbButtonModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { JbpmRoutingModule, routedComponents } from './jbpm-routing.module';
import { CaseStatusRenderComponent } from './blocks/case-status-render.component';
import { SlaComplianceRenderComponent } from './blocks/sla-compliance-render.component';
import { EpochDateRenderComponent } from './blocks/epoch-date-render.component';
import { FundManagementUpdateRequestComponent } from './tasks/fm-update-request/fund-management-update-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskCommentsComponent } from './tasks/comments/task-comments.component';
import { CaseFileComponent } from './tasks/case-file/case-file.component';


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
  ],
  declarations: [
    ...routedComponents,
    CaseStatusRenderComponent,
    SlaComplianceRenderComponent,
    EpochDateRenderComponent,
    CaseFileComponent,
    FundManagementUpdateRequestComponent,
    TaskCommentsComponent,
  ],
  entryComponents: [
    CaseStatusRenderComponent,
    SlaComplianceRenderComponent,
    EpochDateRenderComponent,
  ]
})
export class JbpmModule { }

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CaseService } from '../../../jbpm/service/case.service';
import { NbStepperComponent } from '@nebular/theme';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CaseDetailComponent implements OnInit {
  case: any = {};
  taskSummaries: any[];
  currentTaskSummary: Promise<any>;
  selectedIndex: number = 0;

  @ViewChild('stepper') stepper: NbStepperComponent;

  ngOnInit(): void {}

  public constructor(private caseService: CaseService) {

    if (history.state.data && history.state.data.case) {
      this.case = history.state.data.case;
      this.caseService.getTasks(this.case['container-id'], this.case['case-id']).subscribe(
        value => {
          this.taskSummaries = value['task-summary'];
          this.taskSummaries.sort((a,b) =>   a['task-id'] < b['task-id'] ? -1 : a['task-id'] > b['task-id'] ? 1 : 0);

          const orderNum = this.taskSummaries[this.taskSummaries.length === 0? 0 : this.taskSummaries.length - 1];
          this.currentTaskSummary = Promise.resolve(orderNum);
        }
      );
    }

  }



}

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
  @ViewChild('stepper') stepper: NbStepperComponent;
  ngOnInit(): void {
  }
  public constructor(private caseService: CaseService) {
    this.case =  history.state.data?.case;
  }
}

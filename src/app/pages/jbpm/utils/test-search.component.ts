import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CaseService} from '../../../jbpm/service/case.service';

@Component({
  selector: 'ngx-test-search',
  template: `

    <form [formGroup]="searchForm" (ngSubmit)="formSubmit(searchForm)">

      <div class="container">
        <div class="row">
          <div class="col">

            <div>
              <label class="label"><h5> Search </h5></label>
            </div>

            <label class="label" for="url">URL
              <nb-icon icon="question-mark-circle" nbTooltip="URL" nbTooltipStatus="primary"
                       status="info"></nb-icon>
            </label> <input nbInput fullWidth type="text" formControlName="url" id="url">


            <label class="label" for="http-method">Http Method
              <nb-icon icon="question-mark-circle" nbTooltip="HTTP Method"
                       nbTooltipStatus="primary" status="info"></nb-icon>
            </label>
            <nb-select formControlName="method"
                       id="http-method">
              <nb-option [value]="result" *ngFor="let result of methodList">{{result}}</nb-option>
            </nb-select>
            <br/>


            <label class="label" for="input-subject">Body
              <nb-icon icon="question-mark-circle" nbTooltip="Body" nbTooltipStatus="primary"
                       status="info"></nb-icon>
            </label>
            <textarea nbInput fullWidth type="text" formControlName="body" id="input-subject" cols="7"></textarea>



            <br/><br/>
            <button nbButton type="submit" color="blue" (click)="formSubmit(searchForm)">Submit</button>

          </div>
        </div>
      </div>
    </form>

  `,
})
export class TestSearchComponent implements OnInit {


  searchForm: FormGroup;
  methodList: string[] = ['post', 'get', 'put'];

  ngOnInit(): void {
    console.error(' ============= Test Search  ============= ');

    this.searchForm = new FormGroup({
      url: new FormControl('', [Validators.required]),
      method: new FormControl('', [Validators.required]),
      body: new FormControl('', Validators.required)});

  }

  formSubmit(form: FormGroup): void {

    this.caseService.search(form.value.url, form.value.method, form.value.body ).subscribe(res => {
      console.error(' ============= Results ============= ');
      console.error( res );

    });
  }

  public constructor(private caseService: CaseService) {  }

}

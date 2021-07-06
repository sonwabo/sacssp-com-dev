import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogRef, NbWindowRef, NbWindowService} from '@nebular/theme';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '@app/jbpm/service/user-management.service';
import {Router} from '@angular/router';

@Component({
  template: `
    <div [ngStyle]="{
                'background-color':'#dfedf2'
                }">
    <ng-template #contentTemplate let-data>
      jk.klj
    </ng-template>
    <ng-template #disabledEsc>
      Disabled close on escape click.
    </ng-template>
    <ng-template #escClose>
      Click escape to close.
    </ng-template>

    <div class="container">
      <nb-card *ngIf="showSearchCard" size="tiny" status="success"
               [nbSpinner]="loading" nbSpinnerStatus="primary" nbSpinnerSize="giant">
        <nb-card-body [ngStyle]="{
                'background-color':'#dfedf2'
                }">
          <form [formGroup]="searchFom" xmlns="http://www.w3.org/1999/html">
            <div class="row">

              <label for="input-name1">User reference</label>
              <div *ngIf="submitted && form.searchBox.errors" class="invalid-feedback">
                <div *ngIf="form.searchBox.errors.required">Reference is required</div>
              </div>
              <input nbInput fullWidth type="text"
                     formControlName="searchBox"
                     id="input-name1">
            </div>
            <div class="row">
              <button nbButton
                      nbTooltipPlacement="top"
                      status="info"
                      type="button"
                      [ngStyle]="{
                       'border':'0px',
                       'color':'white',
                       'background-color':'#ddffbe'
                       }"
                      (click)="formSubmit(searchFom)">Search
              </button>
            </div>
          </form>
        </nb-card-body>
      </nb-card>

      <nb-card *ngIf="showErrorCard" size="tiny">
        <nb-card-body [ngStyle]="{
                'background-color':'#dfedf2'
                }">
          <center>
          <p>User with reference: {{form.searchBox.value}} could not be found!!</p>
          <br/>
          <button nbButton
                  nbTooltipPlacement="top"
                  status="info"
                  type="button"
                  [ngStyle]="{
                       'border':'0px',
                       'color':'white',
                       'background-color':'#ddffbe'
                   }"
                  (click)="closeCard()">OK
          </button>
          </center>
        </nb-card-body>
      </nb-card>
    </div>
    </div>
  `,
  styleUrls: ['window.component.scss'],
})
export class WindowsDialogComponent implements OnInit {

  @Input() title: string = 'This is a test';
  @Input() message: string;

  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  @ViewChild('escClose', {read: TemplateRef}) escCloseTemplate: TemplateRef<HTMLElement>;
  @ViewChild('disabledEsc', {read: TemplateRef}) disabledEscTemplate: TemplateRef<HTMLElement>;

  searchFom: FormGroup;
  submitted = false;
  showSearchCard: boolean = true;
  showErrorCard: boolean = false;
  loading: boolean = false;


  constructor(private ref: NbWindowRef, private service: UserManagementService, private router: Router) {
  }

  get form() {
    return this.searchFom.controls;
  }

  ngOnInit(): void {

    this.searchFom = new FormGroup({
      searchBox: new FormControl('', Validators.required),
    });
  }

  private searchForUser(reference: string): void {
  }

  public closeCard(): void {
    this.showErrorCard = false;
    this.showSearchCard = true;
  }

  formSubmit(userForm: FormGroup) {
     this.submitted = true;
     if (this.searchFom.invalid) {
       this.loadSpinner(false);
       return;
     }
     this.loadSpinner(true);

     this.service.getUserByReference(userForm.value.searchBox).subscribe(res => {

        const response = res.response;
        if (response === null) {
          this.loadSpinner(false);
          this.showSearchCard = false;
          this.showErrorCard = true;
        } else {
          this.router.navigate(['pages/jbpm/case-detail'], {state: {data: {case: response}}});
          this.ref.close();
          this.loadSpinner(false);
        }
     });
  }
  private loadSpinner(value: boolean): void {
     this.loading = value;
  }
}

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  NbDialogService,
  NbStepperComponent,
  NbToastrService,
  NbWindowService,
} from '@nebular/theme';
import {LocalDataSource} from 'ng2-smart-table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { DepartmentManagementService } from '../../../jbpm/service/department-management.service';
import {division_management_table_settings} from './divisions-utils';
import {Router} from '@angular/router';
import {WindowsDialogComponent} from '@app/jbpm/common-component/window-dialog/window-dialog.component';
import {COMPONENT_LIST} from '@app/pages/jbpm/utils/routes-list-enum';
import {DataShareService} from '@app/jbpm/service/data-share.service';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';

@Component({
  selector: 'ngx-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DivisionComponent implements OnInit {

  @ViewChild('stepper') stepper: NbStepperComponent;

  source: LocalDataSource = new LocalDataSource();

  dataArray: Array<any> = new Array<any>();

  settings = division_management_table_settings;

  departmentForm: FormGroup;

  readonly root: string = 'divisions';
  label: string = 'Add';
  submitted = false;
  loading = false;
  readonly DOCS_STORAGE_KEY: string = 'documents';

  menuItems: Array<string>;

  constructor(private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private windowService: NbWindowService,
    private dataShare: DataShareService,
    private authService: NbAuthService,
    private router: Router) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.getPayload()?.['roles'].includes('ADMIN')) {
            this.menuItems =  ['Welcome', 'All users', 'Create user profile', 'Edit user profile'];
        } else {
          this.menuItems =  ['Welcome', 'Create user profile', 'Edit user profile'];
        }
      });

  }

  ngOnInit(): void {
    this.dataShare.clearStorageForKey(this.DOCS_STORAGE_KEY);
  }

  selectedMenuItem(value: string): void {

    if ('Edit user profile' === value) {
       this.searchAndUpdateUserProfile();
    } else if ('All users' === value) {
      this.router.navigate([COMPONENT_LIST.ALL_USERS]);
    } else if ('Create user profile' === value) {
      this.router.navigate([COMPONENT_LIST.CREATE_USER_PROFILE]);
    } else if ('Welcome' === value) {
      this.router.navigate([COMPONENT_LIST.WELCOME]);
    }
  }

  private searchAndUpdateUserProfile(): void {

      this.windowService.open(WindowsDialogComponent, {
        context: {
          title: 'Search For User',
          message: `User Data has been Created Successfully, User Reference has been generated
         ,also an email with the generated reference has been sent to your email`,
        },
      });
  }

}

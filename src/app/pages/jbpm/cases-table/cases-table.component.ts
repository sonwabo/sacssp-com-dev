import {Component} from '@angular/core';
import {LocalDataSource, ServerDataSource} from 'ng2-smart-table';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {case_table_settings} from './table-settings';
import { UserManagementService } from '../../../jbpm/service/user-management.service';
import {environment} from '@environments/environment';
import {COMPONENT_LIST} from '@app/pages/jbpm/utils/routes-list-enum';
import {WindowsDialogComponent} from '@app/jbpm/common-component/window-dialog/window-dialog.component';
import {NbWindowService} from '@nebular/theme';

@Component({
  selector: 'ngx-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.scss'],
})
export class CasesTableComponent {

  source: ServerDataSource;
  loading: boolean = true;

  settings = case_table_settings;
  reviewer: boolean = false;

  page: number;
  size: number;
  link: string;
  isDisabled: boolean = true;

  readonly menuItems: Array<string> = ['Welcome', 'All users', 'Create user profile', 'Edit user profile'];


  constructor(
    protected service: UserManagementService,
    protected router: Router,
    protected windowService: NbWindowService,
    protected http: HttpClient) {

    this.loadCases();
  }
  loadCases(allCases: boolean = false): void {

    // const url = environment.allusers;
    const url = 'http://41.79.79.17/data-tracker/v1/listAllUsers';
    //const url = 'http://192.168.31.69:8080/data-tracker/v1/listAllUsers';

    this.source = new ServerDataSource(
      this.http,
      {
        endPoint: url,
        dataKey: 'content',
        totalKey: `totalElements`,
        pagerPageKey: `number`,
        pagerLimitKey: `size`,
        filterFieldKey: `#field#`,
      });

    this.source.onChanged().subscribe(value => {
      this.size = value?.['paging']?.['perPage'];
      this.page = value?.['paging']?.['page'];
      this.link = `${environment.baseBackEnd}/v1/file/${this.page}/${this.size}/UserData.xlsx`;
      this.isDisabled = false;
    });
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
        title: 'Search for user',
        message: `User Data has been Created Successfully, User Reference has been generated
         ,also an email with the generated reference has been sent to your email`,
      },
    });
  }


  onEdit(event): void {
    this.isLoading(true);
    const _data = event.data;
    this.router.navigate(['pages/jbpm/case-detail'], {state: {data: {case: _data}}});
    this.isLoading(false);
  }

  onCreateConfirm(event) {
    console.log(' This is a test ');
    console.log(event);
  }

  private isLoading(loading: boolean): void {
    this.loading = loading;
  }

  onSelectedTab(_event: any): void {
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'Status',
        search: query,
      },
      {
        field: 'Owner',
        search: query,
      },
      {
        field: 'Description',
        search: query,
      },
    ], false);
  }

}

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {LayoutService} from '@app/@core/utils';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {getDeepFromObject, NB_AUTH_OPTIONS, NbAuthResult, NbAuthService} from '@nebular/auth';
import {Router} from '@angular/router';
import {UserDetails} from '@app/authentication/model/user.details';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: { name: '', picture: '' };

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    // {
    //   value: 'dark',
    //   name: 'Dark',
    // },
    // {
    //   value: 'cosmic',
    //   name: 'Cosmic',
    // },
    // {
    //   value: 'corporate',
    //   name: 'Corporate',
    // },
  ];

  currentTheme = 'default';

  userMenu = [{title: 'Profile'}, {title: 'Log out'}];
  redirectDelay: number = 0;
  strategy: string = '';

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              // private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected router: Router) {
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    // @ts-ignore
    this.user = { 'name' : UserDetails.getUserName(),  'picture': ''};

    const {xl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({name}) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().subscribe(e => {
      this.onItemSelection(e.item.title);
    });

  }


  logout(strategy: string): void {
    this.service.logout(strategy).subscribe((result: NbAuthResult) => {
      UserDetails.empty();
      setTimeout(() => {
        return this.router.navigate(['verify/login'], {replaceUrl: true});
      }, 1000);
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  onItemSelection(title: any): void {
    if (title === 'Log out') {
      this.logout(this.strategy);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}

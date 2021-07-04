import { NgModule } from '@angular/core';
import {NbCardModule, NbListModule, NbMenuModule} from '@nebular/theme';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbListModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {
  NbCardModule, NbIconModule, NbInputModule,
  NbTooltipModule, NbButtonModule, NbDialogModule, NbSpinnerModule, NbToastrModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceProviderNetworksComponent } from './service-provider-networks.component';
import { serviceProviderNetworksRouting } from './service-provider-networks-routing.module';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbTooltipModule,
    NbButtonModule,
    NbDialogModule.forChild(),
    NbSpinnerModule,
    NbToastrModule.forRoot(),
    serviceProviderNetworksRouting,
  ],
  declarations: [
    ServiceProviderNetworksComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class serviceProviderNetworksModule { }

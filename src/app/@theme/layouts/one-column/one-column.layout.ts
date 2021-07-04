import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

<!--      <nb-sidebar  class="menu-sidebar scassp-background-color scassp-background-logo" tag="menu-sidebar" responsive>-->
<!--        <ng-content select="nb-menu"></ng-content>-->
<!--      </nb-sidebar>-->
<!--      <nb-sidebar>-->

<!--        <nb-layout-column left [ngStyle]="{'background-size': '80px',  'opacity': '0.5' }">-->
<!--          <nb-card [size]="'tiny'">-->
<!--            <nb-card-body>-->
<!--              <nb-list>-->
<!--                <nb-list-item *ngFor="let fruit of fruits">-->
<!--                  {{ fruit }}-->
<!--                </nb-list-item>-->
<!--              </nb-list>-->
<!--            </nb-card-body>-->
<!--          </nb-card>-->

<!--        </nb-layout-column>-->


      <nb-layout-column [start]="true"  [ngStyle]="{
                'background-image':'url(assets/images/background-two.png)',
                'background-size': 'cover'
                }">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed [ngStyle]="{'background-color':'#a46109'}">
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {

  readonly fruits: Array<string> = ['Apple', 'Banana', 'Carrots', 'Orange'];


}

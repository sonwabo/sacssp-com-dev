import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created by <b><a [ngStyle]="{'color':'black'}"  href="https://www.xelo-technologies.co.za" target="_blank">Xelo Technologies</a></b> 2021
    </span>
<!--    <div class="socials">-->
<!--      <a href="#" target="_blank" class="ion ion-social-github"></a>-->
<!--      <a href="#" target="_blank" class="ion ion-social-facebook"></a>-->
<!--      <a href="#" target="_blank" class="ion ion-social-twitter"></a>-->
<!--      <a href="#" target="_blank" class="ion ion-social-linkedin"></a>-->
<!--    </div>-->
  `,
})
export class FooterComponent {
}

import {Component, Input} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({

  template: `
    <nb-card [size]="size" status="success">
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-body *ngIf="flag === 'success'" [ngStyle]="{'background-color':'#dfedf2'}">
        <br/><br/>
            <ol>
              <li>Your unique personal reference number is: {{message}}.</li>
              <li>Your unique personal reference number was also submitted to your personal e-mail address.</li>
              <li>Please keep your unique personal reference safe.</li>
              <li>Your unique personal reference number should be used during all enquiries and updates.</li>
            </ol>
      </nb-card-body>

      <nb-card-body *ngIf="flag === 'success-tab'" [ngStyle]="{'background-color':'#dfedf2'}">
        <p> Thank you. Please click on {{message}} (above) and complete the content.</p>
      </nb-card-body>

      <nb-card-footer>
        <button nbButton status="info"
                [ngStyle]="{
                       'color':'black',
                       'border':'0px',
                       'background-color':'#a0dc3d'
                   }"
                (click)="ref.close()">Close</button>
      </nb-card-footer>
    </nb-card>
  `,
  styleUrls: ['dialog.component.scss'],
})
export class DialogWithBackdropComponent {
  @Input() title: string;
  @Input() message: string;
  @Input() flag: string;
  @Input() size: string = 'small';

  constructor(public ref: NbDialogRef<DialogWithBackdropComponent>) {
  }

}


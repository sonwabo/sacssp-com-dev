import {Component, Input} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({

  template: `
    <nb-card size="small" status="success">
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-body  [ngStyle]="{'background-color':'#dfedf2'}">
        <br/><br/>
            <ol>
              <li>Your unique personal reference number is: {{message}}.</li>
              <li>Your unique personal reference number was also submitted to your personal e-mail address.</li>
              <li>Please keep your unique personal reference safe.</li>
              <li>Your unique personal reference number should be used during all enquiries and updates.</li>
            </ol>

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

  constructor(public ref: NbDialogRef<DialogWithBackdropComponent>) {
  }

}


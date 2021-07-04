import {Component, Input} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({

  template: `
    <nb-card size="small" status="success">
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-body>
        <div [ngStyle]="{'background-position': 'center', 'inline-size': '400px','overflow-wrap': 'break-all'}">
           {{message}}
        </div>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="info"
                [ngStyle]="{
                       'border':'0px',
                       'background-color':'#a46109'
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


import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({

template: `<nb-card>
<nb-card-header>{{title}}</nb-card-header>
<nb-card-body>
  {{message}}
</nb-card-body>
<nb-card-footer>
  <button nbButton status="danger" (click)="cancel()">{{cancelText}}</button> &nbsp;&nbsp;
  <button nbButton status="success" (click)="submit()">{{confirmText}}</button>
</nb-card-footer>
</nb-card>
`,
styleUrls: ['confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() cancelText: string;
  @Input() confirmText: string;
  constructor(protected ref: NbDialogRef<ConfirmDialogComponent>) {
  }

  ngOnInit() {
  }
  cancel() {
    this.ref.close(false);
  }

  submit() {
    this.ref.close(true);
  }
}

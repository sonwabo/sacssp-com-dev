import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'ngx-dialog-share',
  template: `
    <nb-card>
      <nb-card-header>Enter your name</nb-card-header>
      <nb-card-body>
        <span> {{dialogMessageBody}} </span>
       </nb-card-body>
      <nb-card-footer>
        <button class="cancel" nbButton status="danger" (click)="cancel()">Cancel</button>
        <button nbButton status="success" (click)="submit('')">Submit</button>
      </nb-card-footer>
    </nb-card>

  `,
  styles: [``],
})

export class CommonConfigsComponent implements  OnInit {

  constructor(protected dialogService: NbDialogService, protected ref: NbDialogRef<CommonConfigsComponent>) {}

  dialogMessageBody: string = '';

  cancel(): void {
    this.ref.close();
  }
  submit(results: string): void {
    this.ref.close(results);
  }

  openWithoutBackdrop(dialog: TemplateRef<any>) {

    this.dialogService.open(
      dialog,
      {
        context: 'this is some additional data passed to dialog',
        hasBackdrop: false,
      });
  }

  public openDialog(message?: string): Observable<any> {
     //this.dialogMessageBody a
    return new Observable(obs => {
      this.dialogService.open(CommonConfigsComponent, {
        hasBackdrop: true,
        closeOnEsc: false,
      }).onClose.subscribe( res => {
        console.error(' ======== close ============');
        console.error( res );
        obs.next(res);
      });
    });
  }

  ngOnInit(): void {}
}

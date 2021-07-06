import {AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {LocalDataSource} from 'ng2-smart-table';
import {DocumentService} from 'app/jbpm/service/document.service';
import {Observable, Subscription} from 'rxjs';
import {Document} from 'app/jbpm/domain/document';
import {DocumentRenderComponent} from 'app/pages/jbpm/blocks/document-render.component';
import {ProcessService} from '@app/jbpm/service/process.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {DocTypeComponent} from '@app/pages/jbpm/blocks/doc-type.component';
import {DataShareService} from '@app/jbpm/service/data-share.service';
import {UserManagementService} from '@app/jbpm/service/user-management.service';
import {ConfirmDialogComponent} from '../../../jbpm/common-component/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'ngx-case-documents',
  templateUrl: './case-document.component.html',
  styleUrls: ['./case-document.component.scss'],
})

export class CaseDocumentComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() case: any = {};
  @Input() iscommunityPractitioner: string = '';
  @Input() disableOptions: boolean = true;


  @ViewChild('uploaddoc', {static: true}) uploaddoc: ElementRef;


  @Input() taskSummary?: Promise<any>;
  cardFlipped = false;

  subscription: Subscription;
  sharedMessage: any;

  loading: false;

  selectedFiles: Array<any> = [];
  progressInfo: Array<any> = [];
  message = '';
  fileInfos: Observable<any>;
  documentsArray: Array<any> = [];

  uploadedDocs: Array<Document> = [];
  document: Document;

  caseId: string;
  qualificationForm: FormGroup;

  readonly qualificationsListOne: string[] = [
    'Identity document',
    'Degree in community development',
    'Diploma community development',
    'Certificate in community development',
  ];

  readonly qualificationsListTwo: string[] = [
    'Identity document',
    'Other qualification not relating to community development',
    'No qualification at all',
  ];

  documentType: string = null;
  dcoumentTypesAdded: Array<string> = new Array<string>();
  readonly DOCS_STORAGE_KEY: string = 'documents';


  source: LocalDataSource;
  settings = {
    mode: 'external',
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: 'right',
      columnTitle : '',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      'content': {
        title: 'Document',
        filter: false,
        type: 'custom',
        renderComponent: DocumentRenderComponent,
        editable: false,
      },
      'name': {
        title: 'Name',
        filter: false,
        editable: false,
      },
      'documentType': {
        title: 'Document type',
        type: 'custom',
        filter: false,
        editable: false,
        renderComponent: DocTypeComponent,
      },
    },
  };

  constructor(
    protected documentService: DocumentService,
    private processService: ProcessService,
    private userManagement: UserManagementService,
    private dataShare: DataShareService,
    protected router: Router,
    protected toastrService: NbToastrService,
    private dialogService: NbDialogService,
    protected http: HttpClient) {
  }

  ngOnInit(): void {
    this.source = new LocalDataSource(this.uploadedDocs);
    this.loadDocument();
    this.qualificationFormControl();

    this.subscription = this.dataShare.currentMessage.subscribe(msg => {
      this.sharedMessage = msg;
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private qualificationFormControl(): void {
    this.qualificationForm = new FormGroup({
      selectedValue: new FormControl('', []),
    });
  }

  get form(): FormGroup {
    return this.qualificationForm;
  }

  loadDocument(): void {


    if (this.case?.reference !== undefined) {

      this.documentService.getDocuments(this.case.userId).subscribe(res => {
        const attachments = res['attachments'] as Array<any>;
        if (attachments.length > 0) {
          attachments.forEach(value => {
            const doc: Document = value as Document;
            this.uploadedDocs.push(doc);
          });
          this.source = new LocalDataSource(this.uploadedDocs);
        }
      });
    }
  }

  addDocument(index: number, file: File, doctype: string): void {

    // for (const item in this.dcoumentTypesAdded.values()) {
    //   if (item === this.documentType) {
    //     this.showToast('Document already Added ', false, 'warning');
    //   }
    // }

    this.progressInfo[index] = {value: 0, fileName: file.name};

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = _re => {

      const startChar: number = reader.result.toString().indexOf(',') + 1;
      const endLength: number = reader.result.toString().length;
      const contents: string = reader.result.toString().substr(startChar, endLength);

      if (this.case === undefined) {
        const currentTodoList = this.dataShare.getValueFromLocalStorage(this.DOCS_STORAGE_KEY) || [];
        const _document = new Document(null,
          null,
          file.name,
          file.size,
          contents,
          file.type, doctype);
        currentTodoList.push(_document);
        this.dataShare.setValueOnLocalStorage(this.DOCS_STORAGE_KEY, currentTodoList);
        this.documentCreated(_document);
      } else {

        this.createDocument(this.case?.userId, file, contents, doctype);
      }
    };
    this.showToast('Documents uploaded successfully', false, 'success');
  }

  createDocument(reference: any, file: any, contents: any, doctype: string): void {
    const _document = new Document(null,
      reference,
      file.name,
      file.size,
      contents,
      file.type, doctype);

    this.documentService.uploadDocument(_document)
      .subscribe(res => {
        this.documentCreated(res);
      }, error => {
        console.error(' Failed to upload document', error);
        this.showToast('Failed to upload document, please try again', false, 'danger');
        this.flipCard();
      });
  }

  private documentCreated(res) {
    this.source.prepend((res as Document)).then(value => {
      this.flipCard();
    });
    this.dcoumentTypesAdded.push(this.documentType);
    this.dataShare.changeMessage('enable');
  }

  addDocuments(): void {
    if (this.selectedFiles === undefined || this.selectedFiles.length === 0) {
      this.showToast('Please select document to upload', false, 'info');
    }
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.addDocument(i, this.selectedFiles[i].file, this.selectedFiles[i].doctype );
    }
    this.selectedFiles = [];
  }

  selectFiles(event: any, doctype: string): void {
    this.progressInfo = [];
    this.clearDocFromStorage(doctype);
    const _file = event.target.files[0];
    this.selectedFiles.push( {'file': _file, 'doctype': doctype});
    console.log('<<<<<<<< Test >>>>>>>>');
    console.log(this.selectedFiles );
  }

  clearDocFromStorage(doctype: string): void {
    const docs = new Array<any>();
    if (this.dataShare.getValueFromLocalStorage(this.DOCS_STORAGE_KEY) !== null) {
      (this.dataShare.getValueFromLocalStorage(this.DOCS_STORAGE_KEY) as Array<any>).forEach(value => {
        if (value?.documentType !== doctype) {
          docs.push(value);
        }
      });
      this.dataShare.setValueOnLocalStorage(this.DOCS_STORAGE_KEY, docs);
    }
  }


  flipCard(value: string = 'defalut'): void {
    //  if ( UserDetails.userReference !== null || this.case?.reference !== undefined) {
    if (this.documentType !== null || 'cancelButton' === value) {
      this.resetControls();
    } else {
      //this.showToast('Please Select Document Type to upload', false, 'info');
    }
  }

  private resetControls(): void {
    this.cardFlipped = !this.cardFlipped;
    // this.uploaddoc.nativeElement.value = '';
    this.documentType = null;
    this.form.controls['selectedValue'].setValue('');
  }

  onChange(event: any): void {
    this.documentType = event.value;
  }

  private showToast(msg: string, navigate: boolean = true, _status: NbComponentStatus = 'success'): void {
    // @ts-ignore
    this.toastrService.show(
      `${msg}`,
      ``,
      {
        destroyByClick: false,
        duplicatesBehaviour: undefined,
        duration: 3000,
        hasIcon: false,
        icon: undefined,
        iconPack: '',
        limit: 0,
        preventDuplicates: true,
        status: _status,
        toastClass: '',
        // @ts-ignore
        position: 'top-end',
      });

    setTimeout(() => {
      if (navigate) {
        // this.navigate();
      }
    }, 3000);
  }


  async onDelete(event: any) {

    const result = await this.dialogService.open(ConfirmDialogComponent, {
      hasBackdrop: true, context: {
        title: 'Delete Document',
        message: 'Are you sure you want to delete document?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    }).onClose.toPromise();

    if (result) {
      this.documentService.deleteDocument(event?.data as Document).subscribe(res => {
        this.source.remove(event?.data as Document).then(r => console.log('Removed Document' + r));
        this.source.refresh();
        this.clearDocFromStorage(event?.data?.documentType);
      });
    } else {
      this.loading = false;
    }
  }

  private create_UUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
}

import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {LocalDataSource} from 'ng2-smart-table';
import {DocumentService} from 'app/jbpm/service/document.service';
import {Observable} from 'rxjs';
import {Document} from 'app/jbpm/domain/document';
import {DocumentRenderComponent} from 'app/pages/jbpm/blocks/document-render.component';
import {ProcessService} from '@app/jbpm/service/process.service';

@Component({
  selector: 'ngx-case-documents',
  templateUrl: './case-document.component.html',
  styleUrls: ['./case-document.component.scss'],
})

export class CaseDocumentComponent implements OnInit, AfterViewInit {
  @Input() case: any = {};
  @ViewChild('uploaddoc', {static: true}) uploaddoc: ElementRef;

  @Input() taskSummary?: Promise<any>;
  cardFlipped = false;

  selectedFiles: FileList;
  progressInfo: Array<any> = [];
  message = '';
  fileInfos: Observable<any>;
  documentsArray: Array<any> = [];

  uploadedDocs: Array<Document> = [];
  document: Document;

  caseId: string;
  containerId: string;

  source: LocalDataSource;
  settings = {
    mode: 'external',
    actions: {
      add: true,
      edit: false,
      delete: false,
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
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
    },
  };

  constructor(
    protected documentService: DocumentService,
    private processService: ProcessService,
    protected router: Router,
    protected http: HttpClient) {

  }

  ngOnInit(): void {
    this.source = new LocalDataSource(this.uploadedDocs);

    this.containerId = this.case['container-id'];
    this.caseId = this.case['case-id'];

    if ( Object.keys(this.case).length === 0 ) {
      this.taskSummary.then(res => {
        this.containerId =  res['task-container-id'];
        this.processService.getProcessInformation(
          res['task-container-id'],
          res['task-proc-inst-id'])
          .subscribe(proces => {
            this.caseId = proces['correlation-key'];
            this.loadDocument();

          });
      });
    }
  }

  ngAfterViewInit() {
    this.loadDocument();
  }

  loadDocument(): void {
    this.documentService.getDocument(this.containerId, this.caseId).subscribe(res => {
      const attachments = res['attachments'];
      if (attachments !== undefined && attachments['documents']) {
        this.documentsArray = attachments['documents'];
        const temp: Array<any> = attachments['documents'];
        temp.forEach(value => {
          const doc: Document = value['org.jbpm.document.service.impl.DocumentImpl'] as Document;
          this.uploadedDocs.push(doc);
        });
        this.source = new LocalDataSource(this.uploadedDocs);
      }
    });
  }

  addDocument(index: number, file: File): void {

    this.progressInfo[index] = {value: 0, fileName: file.name};

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = _re => {
      const lastmodified = {'java.util.Date': file.lastModified};

      const startChar: number = reader.result.toString().indexOf(',') + 1;
      const endLength: number = reader.result.toString().length;
      const contents: string = reader.result.toString().substr(startChar, endLength);

      this.document = new Document(null, file.name, null, file.size, lastmodified, contents);
      this.documentsArray.push({'org.jbpm.document.service.impl.DocumentImpl': this.document});

      this.documentService.uploadDocument(this.case['container-id'], this.case['case-id'], this.documentsArray)
        .subscribe(res => {
          this.source.prepend(this.document).then(value => {
            console.error('value added: ', value);
          });
        }, error => {
          console.error(' Failed to upload document', error);
        });
    };
  }

  addDocuments(): void {
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.addDocument(i, this.selectedFiles[i]);
    }
  }

  selectFiles(event: any): void {
    this.progressInfo = [];
    this.selectedFiles = event.target.files;
  }

  flipCard(): void {
    this.cardFlipped = !this.cardFlipped;
    this.uploaddoc.nativeElement.value = '';
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { TaskService } from '../../../jbpm/service/task.service';
import { EpochDateRenderComponent } from '../blocks/epoch-date-render.component';
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'ngx-case-documents',
  templateUrl: './case-document.component.html',
  styleUrls: ['./case-document.component.scss'],
})

export class CaseDocumentComponent implements OnInit {
  @Input() taskSummary: any;
  @Input() case: any = {};
  cardFlipped = false;

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
      'comment': {
        title: 'Comment',
        filter: false,
      },
      'comment-added-by': {
        title: 'Commentor',
        filter: false,
        editable: false,
      },
      'comment-added-at': {
        title: 'Added',
        filter: false,
        type: 'custom',
        renderComponent: EpochDateRenderComponent,
        editable: false,
      },
    }};

  taskComment: string = '';

  constructor(
    protected taskService: TaskService,
    protected router: Router,
    protected http: HttpClient) {

  }
  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.taskService.getTaskComments(this.case['container-id'], this.taskSummary['task-id']).subscribe(
      data => {this.source = new LocalDataSource(data['task-comment']); });
  }

  attachComment(commentForm: FormGroup): void {
  }

  flipCard(): void {
    this.cardFlipped = !this.cardFlipped;
    this.loadComments();
  }
}

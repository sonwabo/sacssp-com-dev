import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'ngx-fund-management-update-request',
  templateUrl: './fund-management-update-request.component.html',
  styleUrls: ['./fund-management-update-request.component.scss'],
})

export class FundManagementUpdateRequestComponent implements OnInit {
  @Input() taskSummary: any;
  @Input() case: any;

  constructor(
    protected router: Router,
    protected http: HttpClient) {

  }
  ngOnInit(): void {

  }
}

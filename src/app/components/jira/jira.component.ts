import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { navbarData } from '../home/nav-data';

import { app } from './app';
import { PlatformLocation } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TicketDetailsService } from '../../services/ticket-details.service';

import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface sideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

interface data {
  id: string;
  name: string;
  description: string;
  assignee: string;
  status: string;
  timeestimate: string;
}
@Component({
  selector: 'app-jira',
  templateUrl: './jira.component.html',
  styleUrl: './jira.component.css'
})
export class JiraComponent implements OnInit {


  //issues: string[];
  checked: boolean;
  tickets: any[] = [];
  position: string;
  issues: any[] = [];
  dataLoaded: boolean = false;

  constructor(private ticketservice: TicketDetailsService,
    private platformLocation: PlatformLocation,
    private http: HttpClient,
    public authService: AuthService,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    history.pushState(null, '', location.href);
    this.platformLocation.onPopState(() => {
      history.pushState(null, '', location.href)
    })
  }


  isSideNavCollapsed = false;
  screenWidth = 0;
  ticketsData;



  ngOnInit() {
    //this.onSave()
  }
  confirmPosition(position: string) {
    this.position = position;

    this.confirmationService.confirm({
      message: 'Do you want to update estimated time?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record Updated' });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have updated' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'you have not updated' });
            break;
        }
      },
      key: 'positionDialog'
    });
  }




  // onSave() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Access-Control-Allow-Origin': '*'
  //     })
  //   }
  //   for (let issue of this.issues) {
  //     let url = "https://ucbos.atlassian.net/rest/api/2/search";
  //     this.http.get(url, httpOptions).subscribe(
  //       (response) => {
  //         let parsedData = JSON.parse(JSON.stringify(response))
  //         console.log(parsedData);

  //       }
  //     )
  //   }

  // }




  // onSave(){
  //   this.http.get('https://jsonplaceholder.typicode.com/posts').subscribe(
  //     (res)=>{
  //        console.log(res);    
  //     },
  //   )
  // }


  // onSave() {
  //   this.issues=['UCB-9324']
  //   console.log('Chips changed:', this.issues);

  //for(let issue of this.issues){
  //  let targetUrl = "https://dreaminnovator.atlassian.net/rest/api/2/search";
  //  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  //   let url = proxyUrl + targetUrl;
  //  this.http.get(url).subscribe(
  //   (response)=>{
  //     let parsedData = JSON.parse(JSON.stringify(response))
  //   }
  //  )
  // }


  // onSave() {
  //   return this.http.get('https://dreaminnovator.atlassian.net/rest/api/2/search').subscribe(
  //     next: => {
  //       if (res) {
  //         console.log(res);    
  //       } else {
  //         console.log('Response is empty');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching posts', error);
  //     }
  //   );
  // }

  // onSave() {
  //   const headersOption = {
  //     headers: new HttpHeaders({
  //       'Access-Control-Allow-Origin': '*'
  //     })
  //   }
  //   console.log("response");
  //   return this.http.get('https://ucbos.atlassian.net/rest/api/2/search', headersOption).pipe(
  //     catchError(this.errorHandler)
  //   )

  // }




  // private errorHandler(error: HttpErrorResponse) {
  //   console.log('an error occured', error.error.message || error.statusText)
  //   return throwError('something went wrong')
  // }

  loadIssues() {
    console.log('loadIssues called');
    this.http.get<any[]>("https://ucbos.atlassian.net/rest/api/2/issue/" + 'UCB-9324').subscribe(
      (data) => {
        console.log('Data fetched from API:', data);
        this.issues = data;
        this.dataLoaded = true;
        console.log('Issues loaded:', this.issues);
      },
      (error) => {
        console.error('Failed to load issues:', error);
      }
    );
  }

  onSave() {
    console.log('onSave called');
    console.log('Current state of issues:', this.issues);
    const headersOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET'
      })
    }

    if (Array.isArray(this.issues) && this.issues.length > 0) {

      for (let issue of this.issues) {
        let issueURL = "https://ucbos.atlassian.net/rest/api/2/issue/" + issue
        this.http.get(issueURL, headersOption).subscribe(
          (response) => {
            let data = response;
            //  let temp =  {
            //     "TicketID" : data.key,
            //     "Description" : data.fields.summary,
            //     "JiraType" : data.fields.issuetype.name,
            //     "Assignee" : data.fields.assignee.displayName,
            //     "Status" : data.fields.status.name,
            //     "EstimatedTime":data.fields.timeestimate,
            //     "StoryPoint" : "",
            //     "ReleaseTag" : data.fields.customfield_10070[0].value,
            //     "Sprint" : ""
            //   }
            //   this.tickets.push(temp);
            console.log('Response for issue:', issue, response);
          },
          (error) => {
            console.error('An error occurred for issue:', issue, error);
          }
        );
      }
    } else {
      console.error("No issues found or 'this.issues' is not an array.");
    }
  }


}





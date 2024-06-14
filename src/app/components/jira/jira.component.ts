import { Component, EventEmitter, Input, Output } from '@angular/core';
import { navbarData } from '../home/nav-data';

import { app } from './app';
import { PlatformLocation } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TicketDetailsService } from '../../services/ticket-details.service';

import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
export class JiraComponent {
  issues: string[];
  checked: boolean;
  tickets;
  position: string;

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




  onSave() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    }
    for (let issue of this.issues) {
      let url = "https://dreaminnovator.atlassian.net/rest/api/2/search";
      this.http.get(url, httpOptions).subscribe(
        (response) => {
          let parsedData = JSON.parse(JSON.stringify(response))
          console.log(parsedData);

        }
      )
    }

  }





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

}





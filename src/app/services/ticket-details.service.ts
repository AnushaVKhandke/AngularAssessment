import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketDetailsService {

  constructor(private http: HttpClient) { }



  getAllTicketData() {
    const headersOption = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    }

    return this.http.get('https://ucbos.atlassian.net/rest/api/2/search', headersOption).pipe(

      catchError(this.errorHandler)
    )

  }

  private errorHandler(error: HttpErrorResponse) {
    console.log('an error occured', error.error.message || error.statusText)
    return throwError('something went wrong')
  }
}

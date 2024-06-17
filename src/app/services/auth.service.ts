import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { User } from '../model/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean = false;
  curid: string | null;
  permissionData: any = {};
  constructor(private http: HttpClient, private route: Router) { }


  signUp(email, password) {
    const data = { email: email, password: password, returnSecureToken: true }
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAsLkzJKlXlTIs7OnEaXPE8YrdcIC7uL8c', data)
      .pipe(catchError(this.handleError))


  }


  login(email, password) {

    const data = { email: email, password: password, returnSecureToken: true };
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAsLkzJKlXlTIs7OnEaXPE8YrdcIC7uL8c', data)
      .pipe(
        tap((res: any) => {
          if (res && res.localId) {
            sessionStorage.setItem('currentUserId', res.localId);
            this.loggedIn = true;
            sessionStorage.setItem('isLoggedIn', this.loggedIn.toString());
            console.log(res)
          }
        })

      );

  }

  private handleError(err) {
    let errorMessage = 'An unknown error occured'
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'email already exists';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'operation not allowed';
        break;
    }
    return throwError(() => errorMessage);
  }

  logout() {
    this.loggedIn = false;
    sessionStorage.clear();
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  getCurrentUserId(): string | null {
    this.curid = sessionStorage.getItem('currentUserId');
    return this.curid;

  }

  isAuthenticated() {
    let loggedIn = localStorage.getItem('isLoggedIn') !== '' || localStorage.getItem('isLoggedIn') != undefined ? true : false;
    return loggedIn;
  }

  isLoggedIn() {
    return sessionStorage.getItem('currentUserId') !== undefined && sessionStorage.getItem('currentUserId') !== null;
  }

  fetchUserdetails(id) {
    this.http.get<{ [key: string]: User }>('https://jirabuildmngt-default-rtdb.firebaseio.com/users.json')
      .pipe(map((res) => {
        const user = [];
        for (const key in res) {
          if ((res.hasOwnProperty(key)) && res[key].localId === id) {
            user.push({ ...res[key], id: key })
            sessionStorage.setItem('userDetails', JSON.stringify(user));
          }

        }
        return user;
      }))
      .subscribe((res) => {
        console.log(res)
      })

  }

  getPermissions(){
    if(sessionStorage.getItem('userDetails') && (this.permissionData === undefined || Object.values(this.permissionData).length === 0)){
      this.permissionData = JSON.parse(sessionStorage.getItem('userDetails'))[0].permissionMap;
    }
    return this.permissionData;
  }

  // getLoggedInUserEmail(): string {
  //   const userDetailsString = JSON.parse(sessionStorage.getItem('userDetails'))[0];
  //   if (userDetailsString) {
  //     const userDetails = JSON.parse(userDetailsString);
  //     return userDetails.email;
  //   }
  //   return '';
  // }

  getEmailFromSession() {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    if (userDetails && userDetails.length > 0) {
      return userDetails[0].email;
    } else {
      return null; // or handle the case where userDetails or email is not available
    }
  }
  
}




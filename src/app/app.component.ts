import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from './model/user';

interface sideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private authService: AuthService, private http: HttpClient) { }
  title;
  isSideNavCollapsed = false;
  screenWidth = 0;
  isUserLoggedIn: boolean;

  
  userLocalId: string | null;
  onToggleSideNav(data: sideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed
  }

  checklog() {
    return this.authService.isAuthenticated();
  }

  checkisLoggedIn() {
    return this.authService.isLoggedIn()
  }

  isUserAuthenticated(): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    return typeof currentUserId === 'string' && currentUserId !== '';
  }

  // fetchUserdetails(id) {
  //   this.http.get<{ [key: string]: User }>('https://jirabuildmngt-default-rtdb.firebaseio.com/users.json')
  //     .pipe(map((res) => {
  //       const user = [];
  //       for (const key in res) {
  //         if ((res.hasOwnProperty(key)) && res[key].localId === id) {
  //           user.push({ ...res[key], id: key });
  //           sessionStorage.setItem('userDetails', JSON.stringify(user));
  //         }

  //       }
  //       return user;
  //     }))
  //     .subscribe((res) => {
  //       console.log(res)
  //     })

  // }

}
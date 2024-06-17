import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';
import { User } from '../../model/user';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent {
  constructor(private configservice: ConfigService, private http: HttpClient, private messageService: MessageService) { }
  userPermission;

  ngOnInit() {
    this.fetchUserdetailsPermissions()
  }

  permissions = [];
  permission = true;
  btnvalue = false;
  userData = null;


  fetchUserdetailsPermissions() {
    this.http.get<{ [key: string]: User }>('https://jirabuildmngt-default-rtdb.firebaseio.com/users.json')
      .pipe(map((res) => {
        const user = [];
        for (const key in res) {
          if ((res.hasOwnProperty(key))) {
            user.push({ ...res[key], id: key })
          }
        }
        return user;
      }))
      .subscribe((res) => {
        console.log(res)
        this.permissions = res

      })

  }

  getUserData() {
    const userDataString = sessionStorage.getItem('userDetails');
    if (userDataString) {
      this.userData = JSON.parse(userDataString)[0];

    }

  }

  togglePermissionStatus(permission: any) {
    permission.status = permission.status !== 'active' ? 'active' : 'inactive';
  }


  updateUserDetails(userDetail) {
    let userData = userDetail;
    let objId = userData.id;
    let url = `https://jirabuildmngt-default-rtdb.firebaseio.com/users/${objId}.json`;
    this.http.put(url, userData)
      .subscribe((res) => {

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User data updated successfully.' });
      }, (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user data.' });
      }
      )
  }


}

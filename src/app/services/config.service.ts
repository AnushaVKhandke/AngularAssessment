import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  
  constructor(private http: HttpClient) { }
  fetchUserPermissions(){
    return this.http.get<{[key:string]:User}>('https://jirabuildmngt-default-rtdb.firebaseio.com/users.json')
    .pipe(map((res)=>{
      const user=[];
       for(const key in res){
        if((res.hasOwnProperty(key))){
        user.push({...res[key], id:key})
        
       }

      }
      return user;
    }))
  }

    
}

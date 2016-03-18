import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from "angular2/http";
import {User} from '../interfaces/user';
import {Subject} from '../interfaces/subject';
import {AuthService} from './auth.service';
import {UserService} from './user';

@Injectable()
export class SubjectService {
  subject: Subject;

  constructor(public http: Http, public authService: AuthService, public userService: UserService) {
    console.log("ISubjectService");
    this.http = http;
  }

  fetchSubject(code: string) {
    return this.http.get(`/api/subject/${code}`, {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     })
     .map((res : any) => {
       let data = res.json();
       this.subject = data;
       return this.subject;
     });
  }


  getSubject(code: string){
    return new Promise<Subject>((resolve, reject) => {
      if (this.subject && this.subject.code === code) {
        resolve(this.subject);
      } else {
        this.fetchSubject(code).subscribe((sub)=>{resolve(sub)});
      }
    });
  }
  getUserSubjectRole(code: string) {
    return new Promise<string>((resolve, reject) => {
      if (this.subject && this.subject.code === code) {
        resolve(this.userService.getUserRole(code));
      } else {
        this.fetchSubject(code).subscribe(() =>resolve(this.userService.getUserRole(code)));
      }
    });
  }
}
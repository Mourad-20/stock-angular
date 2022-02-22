import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Rxjs {
  private subject = new Subject<any>();

  sendClickEvent(){
    this.subject.next();

  }

   sendClickEventparametre(param:any){
    this.subject.next(param);

  }
  getClickEvent():Observable<any>{
     return this.subject.asObservable();
  }
}
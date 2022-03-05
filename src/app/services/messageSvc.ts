import {Injectable} from '@angular/core';
import {HttpClient,	HttpErrorResponse,	HttpHeaders} from '@angular/common/http';
import { CookieService  } from 'ngx-cookie-service';
import { Globals } from '../globals';


@Injectable()
export class MessageSvc {

	private headers = new HttpHeaders({	'Content-Type': 'application/json' });

	constructor(private http: HttpClient,private g: Globals) {

	}
	
	
	getMessages() {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/message/getMessages', data, options);
	}
	


}
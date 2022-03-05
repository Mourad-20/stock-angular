import {Injectable} from '@angular/core';
import {HttpClient,	HttpErrorResponse,	HttpHeaders} from '@angular/common/http';
import { CookieService  } from 'ngx-cookie-service';
import { Globals } from '../globals';


@Injectable()
export class CommercialisationSvc {

	private headers = new HttpHeaders({	'Content-Type': 'application/json' });

	constructor(private http: HttpClient,private g: Globals) {

	}
	
	
	validerCommercialisation(commercialisationVMs: any) {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = JSON.stringify(commercialisationVMs);
		return this.http.post(this.g.baseUrl +  '/api/commercialisation/validerCommercialisation', data, options);		
	}
	
	getCommercialisations(idCaisse : number) {
		let paramInt = {"Valeur" : idCaisse};
		let options = {	headers: this.headers,withCredentials: true	};
		let data = JSON.stringify(paramInt);
		return this.http.post(this.g.baseUrl +  '/api/commercialisation/getCommercialisations', data, options);		
	}
	
	
	


}
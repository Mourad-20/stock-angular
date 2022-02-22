import {Injectable} from '@angular/core';
import {HttpClient,	HttpErrorResponse,	HttpHeaders} from '@angular/common/http';
import { CookieService  } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Globals } from '../globals';

import Swal from 'sweetalert2';


@Injectable()
export class UtilisateurSvc {

	private headers = new HttpHeaders({	'Content-Type': 'application/json' });

	constructor(private http: HttpClient,private g: Globals,private router: Router,private cookieService:CookieService) {

	}
	
	redirectionToLogin(){
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
		  // true for mobile device
		  this.router.navigate(['loginMobile']);
		}else{
		  // false for not mobile device
		  this.router.navigate(['login']);
		}
		
	}
	updatUtilisateur(utilisateur:any){
		let options = {	headers: this.headers,withCredentials: true	};
		let data = JSON.stringify(utilisateur);
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/updateUtilisateur', data, options);
	}
	isUtilisateurOnGroupes(codesGroupes : string[]){
		let appartient = false;
		if(codesGroupes != null && codesGroupes.length > 0){					
			for(let cg of codesGroupes){
			  let result = this.g.utilisateur?.CodesGroupes.filter(x => x == cg) || [];
			  if(result.length > 0){
				  appartient = true;
				  break;
			  }
			}
		}
		return appartient;
	}
	getAllUtilisateur(){
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/getAllUtilisateur', data, options);
	}
	isUserConnected(){
		let connected = false;
		if(this.cookieService.get('mytoken').length > 0){
			connected = true;
		}
		//console.log('isUserConnected()---------> ' + connected);
		return connected;
	}
	
	seDeconnecter(){
		this.g.utilisateur = null;
		this.g.isConnected = false;
	}
	
	checkerConnection(){
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/checkerConnection', data, options);
	}
	
	getListeLogins(){
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/getListeLogins', data, options);
	}
	
	authentifier(loginValue: string,passwordValue: string) {
		let currAuthentificationVM = {"Login" : loginValue, "Password" : passwordValue , 'Jeton' : ''};
		let options = {	headers: this.headers,withCredentials: true	};
		let data = JSON.stringify(currAuthentificationVM);
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/Authentification', data, options);
	}
	
	authentifierJeton(jetonValue: string) {
		let currAuthentificationVM = {"Login" : '', "Password" : '' , 'Jeton' : jetonValue};
		let options = {	headers: this.headers,withCredentials: true	};
		let data = JSON.stringify(currAuthentificationVM);
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/AuthentificationJeton', data, options);
	}
	
	
	addUtilisateur(utilisateur: any){
		let options = {	headers: this.headers,withCredentials: true	};
		let data = JSON.stringify(utilisateur);
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/AddUtilisateur', data, options);
	}
	
	deconnexion() {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/Deconnexion', data, options);
	}

	bloquerUtilisateur() {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/BloquerUtilisateur', data, options);
	}

	debloquerUtilisateur() {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/DebloquerUtilisateur', data, options);
	}
	
	RequestChecker() {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/RequestChecker', data, options);
	}
	
	getInfoUtilisateur() {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/GetInfoUtilisateur', data, options);
	}

	getServeurs() {
		let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/getListeServeurs', data, options);
	}

	getGroupeTemporaire(){
	let options = {	headers: this.headers,withCredentials: true	};
		let data = {};
		return this.http.post(this.g.baseUrl +  '/api/utilisateur/getGroupeTemporaire', data, options);
	}
	

	


	loadInfoUtilisateur(){
		
		this.getInfoUtilisateur().subscribe(
		  (res:any) => {
			let etatReponse = res["EtatReponse"];
			if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  this.g.utilisateur = res["utilisateurVM"];
			}else{
			  Swal.fire({ text: etatReponse.Message , icon: 'error'});
			}   
		  }
	);
	
		
	
		
		
	}


/*
	seDeconnecter(){
		this.deconnexion().subscribe(
			res => {
				let etatReponse = res["EtatReponse"];
				if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
					let utilisateurVM = res["utilisateurVM"];
					this.g.utilisateur = null;
					this.g.isConnected = false;
					this.cookieService.deleteAll();
					console.log('SUPPRESSION DES INFORMATIONS DE COOKIE');
				}else{
					Swal.fire({ type: 'error', text: etatReponse.Message });
				}
				// this.g.showLoadingBlock(false); à decommenter 
			}
		);
	}*/
	
}
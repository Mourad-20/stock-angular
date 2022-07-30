import { Component,HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService  } from 'ngx-cookie-service';
import { Login } from '../entities/Login';
import { GroupeCode } from '../entities/GroupeCode';
import { Globals } from '../globals';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import Swal from 'sweetalert2';

declare const myTest: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent implements OnInit {
	public methode = "";
	public loginValue : string = "";
	public passwordValue : string = "";
	public jetonValue : string = "";
	public imageRfidSrc : string = 'assets/icons_rfid.gif';
	public imageCaisse : string =  'assets/clyo-caisse.png';
	public imageRapport : string =  'assets/rapport.jpg';
	public imageParametre : string =  'assets/parametre.jpg';
	public elem:any
	public loginVMs : Login[] = [];
	public _groupeCde:GroupeCode=new GroupeCode();
	public _code:string[]=[]

	constructor( public g: Globals,
	private utilisateurSvc:UtilisateurSvc,
	private router: Router,
	private cookieService:CookieService) {    
		this.utilisateurSvc.seDeconnecter();
		setTimeout(() => { this.cookieService.deleteAll(); }, 500);
	}

	@HostListener('window:keydown', ['$event'])

	handleKeyDown(event: KeyboardEvent) {
		this.g.handleKeyDown(event)
		if(this.methode == "JETON"){
			if(event.key=="Enter"){
				this.authentification();
			}
			else{
				this.jetonValue=this.jetonValue+event.key ;
			}
		}
	}

	ngOnInit() {	
		this.elem =document.documentElement;
		for  (const x in this._groupeCde){
			this._code.push(x)
		} 
		this.methode = "STANDARD";
		this.getListelogins();	
	}

	showlogin(type:string){
		this.g.typelogin=type
	}

	getListelogins(){
		this.utilisateurSvc.getListeLogins().subscribe(
			(res:any) => {
				console.log(res)
				let etatReponse = res["EtatReponse"];
				if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
					this.loginVMs = res["loginVMs"];
				} else { 
					Swal.fire({ text: etatReponse.Message , icon: 'error'});
				}
				this.g.showLoadingBlock(false);    
			}
		);
	}

	afficher(x : any){
		this.passwordValue = this.passwordValue + x;
	}

	reset(){
		this.passwordValue = "";
	}

	authentification(){
		// this.g.openFullscreen()
		this.g.showLoadingBlock(true);
		if(this.methode == "STANDARD"){
			this.utilisateurSvc.authentifier(this.loginValue,this.passwordValue).subscribe(
				(res:any) => {
					console.log(this.loginValue,'succed',this.passwordValue)
					let etatReponse = res["EtatReponse"];
					if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
						this.g.utilisateur = res["utilisateurVM"];
						this.g.isConnected = true;
						this.router.navigate(['rapports']);
					}else{
						Swal.fire({ text: etatReponse.Message , icon: 'error'});
					}
					this.g.showLoadingBlock(false);    
				}
			);
		} else if(this.methode == "JETON"){
			this.utilisateurSvc.authentifierJeton(this.jetonValue).subscribe(
					(res:any) => {
					let etatReponse = res["EtatReponse"];
					if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
						this.g.utilisateur = res["utilisateurVM"];
						this.g.isConnected = true;
						window.location.href='/caisse';
						//this.router.navigate(['caisse']);
					}else{
						Swal.fire({ text: etatReponse.Message , icon: 'error'});
					}
					this.g.showLoadingBlock(false);    
					}
				);
		}   
	}

	selectJetonMethode(methode : any){
		this.methode = methode;
		if(methode == "JETON"){
			this.jetonValue="";
		}
	}

}
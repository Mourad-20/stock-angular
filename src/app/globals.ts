import { Injectable } from '@angular/core';
import { CookieService  } from 'ngx-cookie-service';
import { Utilisateur } from './entities/Utilisateur';
import { Categorie } from './entities/Categorie';
import { Article } from './entities/Article';
import { Seance } from './entities/Seance';
import * as $ from "jquery";

Injectable()
export class Globals{
	
	HttpStateCode = { 'OK': '1', 'ERROR': '2', 'NOT_CONNECTED': '3', 'NOT_ALLOWED': '4' };
    EtatReponseCode = { 'SUCCESS': '10', 'DANGER': '20', 'WARNING': '30', 'INFO': '40' };
    //public baseUrl? : string  = 'http://localhost:6500'; // pour deploiement local
	//public baseUrl? : string  = 'http://192.168.43.14:6500'; // pour deploiement cafe
	public baseUrl? : string  = 'http://localhost:53270'; // pour VS
    //public baseUrl? : string  = 'http://169.254.233.107:6500'; // pour VM
	
    public utilisateur? : Utilisateur | null;
    public isConnected? : boolean | null;
    public seance? : Seance  | null;
    public categories : Categorie[] = [];
    public articles : Article[] = [];
    public articlesOrg : Article[] = [];
    public typeform :string="";
    public idcaisseparam:number=0;
    public namecaisseparam:string=""
	public typecaisseparam:string=""
	
    setTitle(newTitle : string) {
        document.title = newTitle;
    }
		
	showLoadingBlock (value : any) {
        $("#loadingBlock").css({ "display": (value == true) ? "block" : "none" });
    }

    async settype(typeform:string|any){
 this.typeform=typeform
}
    async setparam(idcaisse:number|any,nameparamcaisse:string|any,paramcaisse:string|any){
        this.namecaisseparam=nameparamcaisse;
 this.idcaisseparam=idcaisse;
 this.typecaisseparam=paramcaisse;
}
}
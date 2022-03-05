import { Component,EventEmitter,Input,OnInit, Output, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { Globals } from '../globals';
import { UtilisateurSvc } from '../services/utilisateurSvc';

import{Rxjs} from '../services/rxjs';

@Component({
  selector: 'app-leftsidebare',
  templateUrl: './leftsidebar.html',
  styleUrls: []
})
export class LeftsidebareComponent implements OnInit {
public collapse:number=0
constructor(public g: Globals, public sharedService:Rxjs , public router:Router) {
	console.log('--------------------------------------');
	console.log('Home constructor()');	
}

  ngOnInit() {	  
	console.log('Home ngOnInit()');
  }
goto(link:string|any){
  console.log(link)
  this.router.navigate([link])

}
showCommandesNonReglees(){
 this.sharedService.sendClickEvent();}

async forme(typeform:string|any){
 
await this.g.settype(typeform)
this.router.navigateByUrl('/forms', { skipLocationChange: true }).then(() => {
    this.router.navigate(['forms/'+typeform]);
}); 
//this.router.navigate(['forms/'+typeform]);	 
}

async liste(typeform:string|any){
this.router.navigate(['liste/'+typeform]);
//this.router.navigate(['forms/'+typeform]);	 
}
Collapse(id:number|any){
  this.collapse==id?
    this.collapse=0:this.collapse=id
}

}




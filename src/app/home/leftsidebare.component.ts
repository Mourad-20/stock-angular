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

constructor(public g: Globals, public sharedService:Rxjs) {
	console.log('--------------------------------------');
	console.log('Home constructor()');	
}

  ngOnInit() {	  
	console.log('Home ngOnInit()');
  }

showCommandesNonReglees(){
 this.sharedService.sendClickEvent();}
}


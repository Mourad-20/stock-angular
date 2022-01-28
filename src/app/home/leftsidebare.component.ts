import { Component,OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { Globals } from '../globals';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { CaisseComponent } from './caisse.component'; 

@Component({
  selector: 'app-leftsidebare',
  templateUrl: './leftsidebar.html',
  styleUrls: []
})
export class LeftsidebareComponent implements OnInit {
  


constructor(public g: Globals) {
	console.log('--------------------------------------');
	console.log('Home constructor()');	
}

  ngOnInit() {	  
	console.log('Home ngOnInit()');
  }
  
showCommandesNonReglees(){

}
  


}
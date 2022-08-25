import { Component,OnInit } from '@angular/core';
import { Router,NavigationStart,NavigationEnd,NavigationError,RoutesRecognized } from '@angular/router';
import { Globals } from '../globals';
import { Categorie } from '../entities/Categorie';
import { Article } from '../entities/Article';
import { Commande } from '../entities/Commande';
import { Utilisateur } from '../entities/Utilisateur';
import { DetailCommande } from '../entities/DetailCommande';
import { Localite } from '../entities/Localite';
import { Reglement } from '../entities/Reglement';
import { DetailReglement } from '../entities/DetailReglement';
import { Seance } from '../entities/Seance';
import { GroupeCode } from '../entities/GroupeCode';
import { EtatCommandeCode } from '../entities/EtatCommandeCode';
import { Recap } from '../entities/Recap';



import { CommandeSvc } from '../services/apiService/commandeSvc';
import { LocaliteSvc } from '../services/apiService/localiteSvc';
import { ReglementSvc } from '../services/apiService/reglementSvc';
import { UtilisateurSvc } from '../services/apiService/utilisateurSvc';
import { CategorieSvc } from '../services/apiService/categorieSvc';
import { ArticleSvc } from '../services/apiService/articleSvc';
import { SeanceSvc } from '../services/apiService/seanceSvc';

import Swal from 'sweetalert2'
import * as $AB from 'jquery';


@Component({
  selector: 'app-caisseMobile',
  templateUrl: './caisseMobile.html',
  styleUrls: []
})
export class CaisseMobileComponent implements OnInit {

constructor(public g: Globals,private commandeSvc:CommandeSvc,private localiteSvc:LocaliteSvc,private reglementSvc:ReglementSvc,public utilisateurSvc:UtilisateurSvc,private router: Router,private seanceSvc:SeanceSvc,private categorieSvc:CategorieSvc,private articleSvc:ArticleSvc) {
	
}

  ngOnInit() {
  	
  }
  

}

import { Component, OnInit } from '@angular/core';
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



import { CommandeSvc } from '../services/commandeSvc';
import { LocaliteSvc } from '../services/localiteSvc';
import { ReglementSvc } from '../services/reglementSvc';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { CategorieSvc } from '../services/categorieSvc';
import { ArticleSvc } from '../services/articleSvc';
import { SeanceSvc } from '../services/seanceSvc';
import { EtatCommandeSvc } from '../services/EtatCommandeSvc';
import {Subscription} from 'rxjs'
import { Rxjs } from '../services/rxjs';
import Swal from 'sweetalert2'
import * as $AB from 'jquery';
import{format} from 'date-fns'

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {
 public type = "";
  public table? : boolean | false;
  //--------------------------------------
public totalColor : string = "box bg-dark text-center";
public serveurColor : string = "box bg-dark text-center";
public tableColor : string = "box bg-dark text-center";


 //------------------------------------
public EtatCommandeCode : EtatCommandeCode = new EtatCommandeCode();
public GroupeCode : GroupeCode = new GroupeCode();
public seance? : Seance  | null;
//--------------------------------------

public imageSrcCat : string =  'assets/categorie.jpg';
public imageSrcArt : string =  'assets/article.jpg';
//--------------------------------------
public totalVal : string = "0";
public calcVal : string = "0";
public searchTerm: string = "";
//--------------------------------------
public categories : Categorie[] = [];
public currentPageCat : number = 1;
public totalPageCat : number = 1;
public pageSizeCat : number = 6;
//--------------------------------------
public articles : Article[] = [];
public currentPageArt : number = 1;
public totalPageArt : number = 1;
public pageSizeArt : number = 9;
//--------------------------------------
public localites : Localite[] = [];
public localitesOrg : Localite[] = [];
public currentPageLoc : number = 1;
public totalPageLoc : number = 1;
public pageSizeLoc : number = 6;
//--------------------------------------
public serveurs : Utilisateur[] = [];
public serveur :string|any
public serveursOrg : Utilisateur[] = [];
public currentPageServ : number = 1;
public totalPageServ : number = 1;
public pageSizeServ : number = 6;
//--------------------------------------
public commandes : Commande[] = [];
public commandesOrg : Commande[] = [];
public currentPageCom : number = 1;
public totalPageCom : number = 1;
public pageSizeCom : number = 6;
//--------------------------------------
public commande : Commande = new Commande();
public commandeReg : Commande = new Commande();
//--------------------------------------
public idxOne : number = -1
public idnav:number=1
//--------------------------------------
public detailsCommandeARegles : DetailCommande[] = [];
public quantiteARegler : number = 0;
public idxTwo : number = -1
//--------------------------------------
public lstReglements : Reglement[] = [];
public idxThree : number = -1
public reglement : Reglement = new Reglement();
//--------------------------------------
public recaps : Recap[] = [];
 public loadAPI!: Promise<any>;
 public percent=0
 public Chart :any
 public etatCommandes:any
 public etatCommande:string|any
public datedebut:string=format(new Date(),'yyyy-MM-dd')+"T00:00:00";
public datefin:string=format(new Date(),'yyyy-MM-dd')+"T23:59:59";
  public  url1 = '../assets/node_modules/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js';

 public  url = '../assets/node_modules/jquery.easy-pie-chart/easy-pie-chart.init.js';
//--------------------------------------

constructor(public EtatCommandeSvc:EtatCommandeSvc,public sharedService:Rxjs, public g: Globals,private commandeSvc:CommandeSvc,private localiteSvc:LocaliteSvc,private reglementSvc:ReglementSvc,public utilisateurSvc:UtilisateurSvc,private router: Router,private seanceSvc:SeanceSvc,private categorieSvc:CategorieSvc,private articleSvc:ArticleSvc) {
	
	this.g.showLoadingBlock(true);
		this.seanceSvc.getSeanceActive().subscribe(
		  (res:any) => {
			let etatReponse = res["EtatReponse"];
			if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  this.g.seance = res["seanceVM"];
			  if(this.g.seance != null){
				//-----------------------------------------------------------------------------------------------
				this.g.showLoadingBlock(true);
				this.commandeSvc.getCommandes(this.datedebut,this.datefin).subscribe(
				  (res:any) => {
					let etatReponse = res["EtatReponse"];
					if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
					  //this.commandesOrg = res["commandeVMs"];
            //this.commandes = res["commandeVMs"];
					  //.totalPageCat = this.calculatePagesCountCat(this.pageSizeCat,this.g.categories.length);
					  //this.chargerListeCat();
					  //----------------------------------------------------

					  this.g.showLoadingBlock(true);
					  this.utilisateurSvc.getServeurs().subscribe(
						(res:any) => {
						  let etatReponse = res["EtatReponse"];
						  if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
							this.serveurs= res["utilisateurVMs"];
             
						  }else{
							Swal.fire({ text: etatReponse.Message , icon: 'error'});
						  }
						  this.g.showLoadingBlock(false);    
						}
					  );

					  //----------------------------------------------------
	  this.EtatCommandeSvc.getAllEtatCommandes().subscribe(
						(res:any) => {
						  let etatReponse = res["EtatReponse"];
						  if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
							this.etatCommandes= res["etatCommandeVMs"];
             
						  }else{
							Swal.fire({ text: etatReponse.Message , icon: 'error'});
						  }
						  this.g.showLoadingBlock(false);    
						}
					  );

					}else{
					  Swal.fire({ text: etatReponse.Message , icon: 'error'});
					}
					this.g.showLoadingBlock(false);    
				  }
				);
				//-----------------------------------------------------------------------------------------------
			  }else{
				this.router.navigate(['ouvertureSeance']);
			  }
			}else{ 
			  Swal.fire({ text: etatReponse.Message , icon: 'error'});
			}
			this.g.showLoadingBlock(false);    
		  }

		);

	}
 
async refrechtable(){
  var datatable = $('#datatableexample').DataTable();
              //datatable reloading 
    datatable.destroy();
  this.getcommandebyparam().then(

     res=>this.commandes=res
  )

setTimeout(()=>{  
        
     $('#datatableexample').DataTable( {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      lengthMenu : [5, 10, 25]
  } ); 
  }, 100);

}

async getcommandebyparam(){
  

  let liste=this.commandesOrg.filter( item=>
             ((this.etatCommande!=undefined && this.etatCommande.length>0)?item.CodeEtatCommande==this.etatCommande:item)
          && ((this.serveur!=undefined && this.serveur.length>0)?item.NomServeur==this.serveur:item)
        
        ) 
return liste;
  }

  ngOnInit(): void {
    
  
    this.chargerCommandes()
       this.loadAPI = new Promise(async (resolve) => {
           await this.showRecap()
            await this.loadScript()
           
             await this.getrecap()
           
           
        });

       
  }

async getrecap(){
      await this.recaps.forEach((item)=>{
 this.Chart  = $('.'+item.IdUtilisateur).data('easyPieChart');

if(item.poucentage>50){
this.Chart.options.barColor="green"
     }
     else{
       this.Chart.options.barColor="red"
     }
     this.Chart.update(item.poucentage);
     
    })
}

  	public async loadScript() {
        console.log('preparing to load...')
      let node1 = document.createElement('script');
        node1.src = this.url1;
        node1.type = 'text/javascript';
      
        let node = document.createElement('script');
        node.src = this.url;
        node.type = 'text/javascript';
       await setTimeout(()=>{
   document.getElementsByTagName('body')[0].appendChild(node1);
        document.getElementsByTagName('body')[0].appendChild(node);
        },1000)
      
    }	

  showRecap(){
    this.chargerRecap();
    
  }
  async chargerRecap(){
	  
	  this.g.showLoadingBlock(true); 
		 await  this.commandeSvc.getRecap().subscribe(
        (res:any) => {
          let etatReponse = res["EtatReponse"];
          if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  this.recaps = res['recapVMs'];
        console.log("recap==",res['recapVMs'])
          }else{ 
            Swal.fire({ text: etatReponse.Message , icon: 'error'});
          }
          this.g.showLoadingBlock(false);    
        }
      );
  }
 
  
  async chargerCommandes(){

   //this.g.showLoadingBlock(true);  
   await this.commandeSvc.getCommandes(this.datedebut,this.datefin).subscribe(
       (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
              this.type="COM";

          this.commandes = res["commandeVMs"];
          this.commandesOrg=res["commandeVMs"];
           this.refrechtable()

         
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
   
  }

}

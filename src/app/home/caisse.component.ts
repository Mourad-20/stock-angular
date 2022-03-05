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

import { ChartType, ChartOptions } from 'chart.js';
import  * as $ab from 'ng2-charts';

import { CommandeSvc } from '../services/commandeSvc';
import { LocaliteSvc } from '../services/localiteSvc';
import { ReglementSvc } from '../services/reglementSvc';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { CategorieSvc } from '../services/categorieSvc';
import { ArticleSvc } from '../services/articleSvc';
import { SeanceSvc } from '../services/seanceSvc';
import {Message}from '../entities/Message';
import {Subscription} from 'rxjs'
import { Rxjs } from '../services/rxjs';
import Swal from 'sweetalert2'
import * as $ from 'jquery';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.html',
  styleUrls: ['./caisse.css']
})
export class CaisseComponent implements OnInit {
 public type = "";
 public percentage = 15;
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
//--------------------------------------
//--------------------------------------
public messages : Message[] = [];
public idxFour : number = -1
public idxFive : number = -1
//--------------------------------------
public reglementVMs : Reglement[] = [];
public detailReglementsNonRegle : DetailReglement[] = [];
public detailReglementsToRegler : DetailReglement[] = [];
public idxSix : number = -1;
public idxSeven : number = -1;
public quantiteToRegler : number = 0;

clickEventSubscription:Subscription;
 
 public pieChartLabels: any[] = [['SciFi'], ['Drama'], 'Comedy'];
  public pieChartData: any = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
 public loadAPI!: Promise<any>;
 public  url = '../assets/node_modules/bootstrap-table/dist/bootstrap-table.min.js';

constructor(public rxjs:Rxjs, public g: Globals,private commandeSvc:CommandeSvc,private localiteSvc:LocaliteSvc,private reglementSvc:ReglementSvc,public utilisateurSvc:UtilisateurSvc,private router: Router,private seanceSvc:SeanceSvc,private categorieSvc:CategorieSvc,private articleSvc:ArticleSvc) {
	interface JQuery {
    easyPieChart():void;
}
	this.g.showLoadingBlock(true);
		this.seanceSvc.getSeanceActive().subscribe(
		  (res:any) => {
			let etatReponse = res["EtatReponse"];
			if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  this.g.seance = res["seanceVM"];
			  if(this.g.seance != null){
				//-----------------------------------------------------------------------------------------------
				this.g.showLoadingBlock(true);
				this.categorieSvc.getCategoriesCommercialisees().subscribe(
				  (res:any) => {
					let etatReponse = res["EtatReponse"];
					if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
					  this.g.categories = res["categorieVMs"];
					  this.totalPageCat = this.calculatePagesCountCat(this.pageSizeCat,this.g.categories.length);
					  this.chargerListeCat();
					  //----------------------------------------------------

					  this.g.showLoadingBlock(true);
					  this.articleSvc.getArticles().subscribe(
						(res:any) => {
						  let etatReponse = res["EtatReponse"];
						  if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
							this.g.articlesOrg = res["articleVMs"];
						  }else{
							Swal.fire({ text: etatReponse.Message , icon: 'error'});
						  }
						  this.g.showLoadingBlock(false);    
						}
					  );

					  //----------------------------------------------------


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
		
    this.clickEventSubscription= this.rxjs.getClickEvent().subscribe(()=>{
      this.showCommandesNonReglees();
    })
	
		
	}

  ngOnInit() {
    var $: any;
  	this.type="CAT";
    this.table=true;
    console.log("table "+this.table);
     this.loadScript()
        
  }
  	public async loadScript() {
     
      console.log(this.url)
        let node = document.createElement('script');
        node.src = this.url;
        node.type = 'text/javascript';
       await setTimeout(()=>{
  
        document.getElementById("script")?.appendChild(node);
        },0)
      
    }	

afficherOnCalculator(x : any){
    if(this.calcVal == "0" && x != "."){
      this.calcVal = "";
    }
    if(x == '.'){
      if(this.calcVal.includes(".") == true) {
        return;
      }
    }
    this.calcVal = this.calcVal + x;
  }

  resetCalculator(){
    
    this.calcVal = "0";
  }
  
  calculatePagesCountCat(elementPerPage : number, totalCount : number) {
    return totalCount < elementPerPage ? 1 : Math.ceil(totalCount / elementPerPage);
  }


  chargerListeCat(){
      this.categories.length = 0;
    if (this.currentPageCat < 1)
        {
            this.currentPageCat = 1;
        }
        else if (this.currentPageCat > this.totalPageCat)
        {
          this.currentPageCat = this.totalPageCat;
      }

      let startIndex = this.currentPageCat * this.pageSizeCat - this.pageSizeCat;
      let endIndex = startIndex + this.pageSizeCat;

      if(endIndex > this.g.categories.length) {
        endIndex = this.g.categories.length;
      }


      for (let i = startIndex; i < endIndex; i++) {
        this.categories.push(this.g.categories[i]);
      }


  }
  //====================================================================================================
nextbutton(){
switch (this.type) {
    case 'CAT':
        this.nextCategorie()
        break;
    case 'ARTICLE':
        this.nextArticle()
        break;
    case 'COM':
        this.nextCommande()
        break;
}
}
previousbutton(){
  switch (this.type) {
    case 'CAT':
        this.previousCategorie()
        break;
    case 'ARTICLE':
        this.previousArticle()
        break;
    case 'COM':
        this.previousCommande()
        break;
}
}
  //====================================================================================================

  nextCategorie(){
    this.currentPageCat++;
    this.chargerListeCat();
  }

  previousCategorie(){
    this.currentPageCat--;
    this.chargerListeCat();
  }
  //====================================================================================================
nextArticle(){
    this.currentPageArt++;
    this.chargerListeArt();
  }

  previousArticle(){
    this.currentPageArt--;
    this.chargerListeArt();
  }
  //====================================================================================================
 nextCommande(){
    this.currentPageCom++;
    this.chargerCommandesNonReglees();
  }
  previousCommande(){
    this.currentPageCom--;
    this.chargerCommandesNonReglees();
  }
  //====================================================================================================

  //====================================================================================================

  chargerArticle(idCategorie : any) {
    this.type="ARTICLE";
    this.g.articles = this.g.articlesOrg.filter(x => x.IdCategorie === idCategorie);
    this.totalPageArt = this.calculatePagesCountArt(this.pageSizeArt,this.g.articles.length);
    this.chargerListeArt();
  }

   chargerArticlebyname() {
    this.type="ARTICLE";
    this.g.articles = this.g.articlesOrg.filter(x => x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.totalPageArt = this.calculatePagesCountArt(this.pageSizeArt,this.g.articles.length);
    this.chargerListeArt();
  }

calculatePagesCountArt(elementPerPage : number, totalCount : number) {
    return totalCount < elementPerPage ? 1 : Math.ceil(totalCount / elementPerPage);
  }


  chargerListeArt(){
	  this.articles = [];
      this.articles.length = 0;
		if (this.currentPageArt < 1)
        {
            this.currentPageArt = 1;
        }
        else if (this.currentPageArt > this.totalPageArt)
        {
          this.currentPageArt = this.totalPageArt;
      }

      let startIndex = this.currentPageArt * this.pageSizeArt - this.pageSizeArt;
      let endIndex = startIndex + this.pageSizeArt;

      if(endIndex > this.g.articles.length) {
        endIndex = this.g.articles.length;
      }


      for (let i = startIndex; i < endIndex; i++) {
        this.articles.push(this.g.articles[i]);
      }


  }

  

  selectArticle(idArticle : any){
	//this.scrollToBottom();
console.log(idArticle)
	if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		if(this.calcVal == '0'){
      this.calcVal = '1';
    }

    /* if(this.commande.DetailCommandes.filter(x => x.IdArticle === idArticle).length > 0) {
      //alert('Existe déja');
      let detailCommande = this.commande.DetailCommandes.filter(x => x.IdArticle === idArticle)[0];
      detailCommande.Quantite = detailCommande.Quantite + Number(this.calcVal);
    }else{ */

      let article = this.g.articlesOrg.filter(x => x.Identifiant === idArticle)[0];
      console.log(this.g.articlesOrg)
      console.log("article",article)
      let detailCommande = new DetailCommande();
      detailCommande.IdArticle = idArticle;
      detailCommande.LibelleArticle = article.Libelle;
      detailCommande.Quantite = Number(this.calcVal);
      detailCommande.Montant = article.Montant;
      this.commande.DetailCommandes.push(detailCommande);
    //}    
    this.commande.DetailCommandes = this.commande.DetailCommandes;
    this.idxOne = this.commande.DetailCommandes.length - 1;
    this.calcVal = '0';
	console.log(this.commande.DetailCommandes.length);
    this.updateTotalVal();
	
	this.scrollToBottom();
	}
	
    

  }
  
  
  getRowIndex(x : any){
		console.log(x);
		this.idxOne = x;
	   //console.log("Row index is: " + x.rowIndex);
	  
  }

   getnavIndex(x : any){
		this.idnav = x;
	   //console.log("Row index is: " + x.rowIndex);
	  
  }

    scrollToBottom () {		
		setTimeout(function(){
			var mydiv = $("#montab");
			mydiv.scrollTop(mydiv.prop("scrollHeight"));
		}, 50);
	}
	
  goUp(){
    if(this.idxOne > 0){
      this.idxOne--;
    }
  }

  goDown(){
    if(this.idxOne < this.commande.DetailCommandes.length - 1){
      this.idxOne++;
    }
  }
chargercat(){
  this.type="CAT";
}
  remove() {
    if(this.commande.DetailCommandes.length > 0 && this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
      this.commande.DetailCommandes.splice(this.idxOne, 1);
      if(this.idxOne == this.commande.DetailCommandes.length){
        this.idxOne--;
      }
    }
    this.updateTotalVal();
  }

  updateTotalVal(){
    let mnt = 0;    
    for(let o of this.commande.DetailCommandes){
      mnt = mnt + (o.Quantite * o.Montant);
    }
    this.totalVal = "" + mnt;
    this.totalColor= (mnt == 0 )? "box bg-dark text-center" : "box bg-success text-center";
  }

  valider(){
	  if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		  
		if(this.commande.Identifiant == null || this.commande.Identifiant === 0){
		  this.ajouterCommande();
		}else{
		  this.modifierCommande();
		}
	}

  }

  getGroupeTemporaire(){
   this.g.showLoadingBlock(true);
      this.utilisateurSvc.getGroupeTemporaire().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
  }

  ajouterCommande(){
    //alert('ajouterCommande');
      
      this.g.showLoadingBlock(true);
      this.commandeSvc.etablirCommande(this.commande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          let idCommande = res["idCommande"];
          this.getCommandeById(idCommande);
          //Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
    
  }

  modifierCommande(){
    //alert('modifierCommande');

      this.g.showLoadingBlock(true);
      this.commandeSvc.modifierCommande(this.commande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          let idCommande = res["idCommande"];
          this.getCommandeById(idCommande);
          //Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
    
  }

  getCommandeById(identifiant:number){
    //this.g.showLoadingBlock(true);  
    this.commandeSvc.getCommandeById(identifiant).subscribe(
      (res:any) => {
        //this.type="CAT"
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.commande = res["commandeVM"];
          if(this.commande == null){
            this.commande = new Commande();
          }
          this.updateTotalVal();
		  this.updateComponentView();
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
  }
  
  updateComponentView(){
	  console.log(this.commande);
  }

  nouvCommande(){
    this.getCommandeById(0);
  }

  calculatePagesCountLoc(elementPerPage : number, totalCount : number) {
    return totalCount < elementPerPage ? 1 : Math.ceil(totalCount / elementPerPage);
  }

  calculatePagesCountServ(elementPerPage : number, totalCount : number) {
    return totalCount < elementPerPage ? 1 : Math.ceil(totalCount / elementPerPage);
  }

  chargerListLocalite(){


    /* this.g.showLoadingBlock(true);   */
    this.localiteSvc.getLocalites().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.localitesOrg = res["localiteVMs"];

          //this.totalPageLoc = this.calculatePagesCountLoc(this.pageSizeLoc,this.localitesOrg.length);
    

          this.localites.length = 0;
          this.localites = [];

          /*if (this.currentPageLoc < 1)
              {
                  this.currentPageLoc = 1;
              }
              else if (this.currentPageLoc > this.totalPageLoc)
              {
                this.currentPageLoc = this.totalPageLoc;
            }

            let startIndex = this.currentPageLoc * this.pageSizeLoc - this.pageSizeLoc;
            let endIndex = startIndex + this.pageSizeLoc;

            if(endIndex > this.localitesOrg.length) {
              endIndex = this.localitesOrg.length;
            }*/


            for (let i = 0; i < this.localitesOrg.length; i++) {
              this.localites.push(this.localitesOrg[i]);
            }

        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );


    
  }

  chargerListServeur(){


   /*  this.g.showLoadingBlock(true);   */
    this.utilisateurSvc.getServeurs().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.serveursOrg = res["utilisateurVMs"];
		  if(this.serveursOrg == null){
			  this.serveursOrg = [];
		  }

          //this.totalPageServ = this.calculatePagesCountServ(this.pageSizeServ,this.serveursOrg.length);
    

          this.serveurs.length = 0;
          this.serveurs = [];

          /*if (this.currentPageServ < 1)
              {
                  this.currentPageServ = 1;
              }
              else if (this.currentPageServ > this.totalPageServ)
              {
                this.currentPageServ = this.totalPageServ;
            }

            let startIndex = this.currentPageServ * this.pageSizeServ - this.pageSizeServ;
            let endIndex = startIndex + this.pageSizeServ;

            if(endIndex > this.serveursOrg.length) {
              endIndex = this.serveursOrg.length;
            }*/


            for (let i = 0; i < this.serveursOrg.length; i++) {
              this.serveurs.push(this.serveursOrg[i]);
            }

        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
  }

  showListeLocalite(){
    this.idnav=3
    this.chargerListLocalite();
    //($('#localiteModal') as any).modal('show');
  }

nextLocalite(){
    this.currentPageLoc++;
    this.chargerListLocalite();
  }
  previousLocalite(){
    this.currentPageLoc--;
    this.chargerListLocalite();
  }

  showListeServeur(){
    this.idnav=2
    this.chargerListServeur();
    ($('#serveurModal') as any).modal('show');
  }

  nextServeur(){
    this.currentPageServ++;
    this.chargerListServeur();
  }
  previousServeur(){
    this.currentPageServ--;
    this.chargerListServeur();
  }
  
  selectLocalite(idLocalite : any){
    //alert('selectLocalite idArticle : ' + idLocalite);
    this.tableColor="box bg-megna text-center";
    let localite = this.localites.filter(x => x.Identifiant === idLocalite)[0];
    this.commande.LibelleLocalite = localite.Libelle;
    this.commande.IdLocalite = localite.Identifiant;
       this.idnav=1;
    ($('#localiteModal') as any).modal('hide');
    this.tableColor="box bg-megna text-center";
  }

  selectServeur(idServeur : any){
    //alert('selectS idArticle : ' + idLocalite);
    this.serveurColor="box bg-primary text-center";
    let serveur = this.serveurs.filter(x => x.Identifiant === idServeur)[0];
    this.commande.NomServeur = serveur.Nom;
    this.commande.IdServeur = serveur.Identifiant;
    this.idnav=1;
    ($('#serveurModal') as any).modal('hide');
    
  }

  showCommandesNonReglees(){
    this.chargerCommandesNonReglees();
    //($('#commandesNonRegleesModal') as any).modal('show');
  }

  calculatePagesCountCom(elementPerPage : number, totalCount : number) {
    return totalCount < elementPerPage ? 1 : Math.ceil(totalCount / elementPerPage);
  }

  chargerCommandesNonReglees(){


    //this.g.showLoadingBlock(true);  
    this.commandeSvc.getCommandesNonReglees().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
              this.type="COM";

          this.commandesOrg = res["commandeVMs"];

          this.totalPageCom = this.calculatePagesCountCom(this.pageSizeCom,this.commandesOrg.length);
    

          this.commandes.length = 0;
          this.commandes = [];

          if (this.currentPageCom < 1)
              {
                  this.currentPageCom = 1;
              }
              else if (this.currentPageCom > this.totalPageCom)
              {
                this.currentPageCom = this.totalPageCom;
            }

            let startIndex = this.currentPageCom * this.pageSizeCom - this.pageSizeCom;
            let endIndex = startIndex + this.pageSizeCom;

            if(endIndex > this.commandesOrg.length) {
              endIndex = this.commandesOrg.length;
            }


            for (let i = startIndex; i < endIndex; i++) {
              this.commandes.push(this.commandesOrg[i]);
            }
console.log(this.commandes)
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );

    
  }

  selectCommande(idCommande : any){
    this.getCommandeById(idCommande);
    //($('#commandesNonRegleesModal') as any).modal('hide');
  }

  showReglements(){
	  this.idxSix = -1;
	  this.quantiteToRegler = 0;
	  this.detailReglementsNonRegle = [];
	  this.detailReglementsToRegler = [];
	  if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		  if(this.commande.DetailCommandes.length > 0){
			  
			  
			  
			  
			  this.commandeSvc.getDetailCommandesNonReglees(this.commande.Identifiant).subscribe(
          
				(res:any) => {
         
				let etatReponse = res["EtatReponse"];
        
				if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
				  
				  let detailCommandesNonReglees = res["detailCommandeVMs"];
				   
				  
				  if(detailCommandesNonReglees.length > 0){
					for(let dc of detailCommandesNonReglees){
						let detailReglement = new DetailReglement();
						detailReglement.IdDetailCommande = dc.Identifiant;
						detailReglement.LibelleArticle = dc.LibelleArticle;
						detailReglement.Quantite = dc.Quantite;
						detailReglement.Montant = dc.Montant;
						this.detailReglementsNonRegle.push(detailReglement);	
            console.log("etatReponse",this.detailReglementsNonRegle)			
					}
				}
           ($('#responsive-modal') as any).modal('show');
				  
				}else{ 
				  Swal.fire({ text: etatReponse.Message , icon: 'error'});
				}
				this.g.showLoadingBlock(false);    
			  }
			);
			  
			  
			  
			  
				
		  }
	  }	
  }
  
  getReglementsByIdCommande(idCommande : number){
	  this.g.showLoadingBlock(true);  
      this.reglementSvc.getReglementsByIdCommande(this.commande.Identifiant).subscribe(
        (res:any) => {
          let etatReponse = res["EtatReponse"];
          if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
            this.lstReglements = res["reglementVMs"];
			this.idxThree = this.lstReglements.length - 1;
			this.reglement = this.lstReglements[this.idxThree];
            console.log(this.lstReglements);
          }else{ 
            Swal.fire({ text: etatReponse.Message , icon: 'error'});
          }
          this.g.showLoadingBlock(false);    
        }
      );
  }
  
  goUpReglement(){
	  if(this.idxThree > 0){
		  this.idxThree--;
		  this.reglement = this.lstReglements[this.idxThree];
		}
  }
  
  goDownReglement(){
	  if(this.idxThree < this.lstReglements.length - 1){
		  this.idxThree++;
		  this.reglement = this.lstReglements[this.idxThree];;
		}
  }
  
  reglerTemporairement(){
	  if(this.commande.Identifiant > 0 && this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
	  this.g.showLoadingBlock(true); 
		  this.reglementSvc.reglerTemporairement(this.commande.Identifiant).subscribe(
        (res:any) => {
          let etatReponse = res["EtatReponse"];
          if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  this.getCommandeById(this.commande.Identifiant);
			  Swal.fire({ text: etatReponse.Message , icon: 'success'});
          }else{ 
            Swal.fire({ text: etatReponse.Message , icon: 'error'});
          }
          this.g.showLoadingBlock(false);    
        }
      );
	  }	  
  }
  
  imprimerPreparation(){
	  if(this.commande.Identifiant > 0){
	  this.g.showLoadingBlock(true); 
		  this.commandeSvc.envoyerTicketPrepation(this.commande.Identifiant).subscribe(
        (res:any) => {
          let etatReponse = res["EtatReponse"];
          if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  //Swal.fire({ text: etatReponse.Message , icon: 'success'});
          }else{ 
            Swal.fire({ text: etatReponse.Message , icon: 'error'});
          }
          this.g.showLoadingBlock(false);    
        }
      );
	  }
  }
  
  imprimerNote(){
	  if(this.commande.Identifiant > 0){
	  this.g.showLoadingBlock(true); 
		  this.commandeSvc.envoyerTicketNote(this.commande.Identifiant).subscribe(
        (res:any) => {
          let etatReponse = res["EtatReponse"];
          if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  //Swal.fire({ text: etatReponse.Message , icon: 'success'});
          }else{ 
            Swal.fire({ text: etatReponse.Message , icon: 'error'});
          }
          this.g.showLoadingBlock(false);    
        }
      );
	  }
  }
  
  showRecap(){
    this.chargerRecap();
    ($('#recapModal') as any).modal('show');
  }
  
  chargerRecap(){
	  
	  this.g.showLoadingBlock(true); 
		  this.commandeSvc.getRecap().subscribe(
        (res:any) => {
          let etatReponse = res["EtatReponse"];
          if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  this.recaps = res['recapVMs'];
          }else{ 
            Swal.fire({ text: etatReponse.Message , icon: 'error'});
          }
          this.g.showLoadingBlock(false);    
        }
      );
  }
  
  cloturerSeance(){
	  this.router.navigate(['clotureSeance']);
  }
  
   getRowIdxSix(x : any){
		this.idxSix = x;
		let detailReglementSrc = this.detailReglementsNonRegle[this.idxSix];
		this.quantiteToRegler = detailReglementSrc.Quantite;		
  }
  
  getRowIdxSeven(x : any){
	  this.idxSeven = x;
		let detailReglementSrc = this.detailReglementsToRegler[this.idxSeven];
		this.quantiteToRegler = detailReglementSrc.Quantite;	
  }
  
  tagToReglement(){
	if(this.idxSix >= 0 && this.detailReglementsNonRegle.length > 0){
		let detailReglementSrc = this.detailReglementsNonRegle[this.idxSix]; 
		let detailReglement = new DetailReglement();
		detailReglement.IdDetailCommande = detailReglementSrc.IdDetailCommande;
		detailReglement.LibelleArticle = detailReglementSrc.LibelleArticle;
		detailReglement.Quantite = detailReglementSrc.Quantite;
		detailReglement.Montant = detailReglementSrc.Montant;
		this.detailReglementsToRegler.push(detailReglement);
		this.detailReglementsNonRegle.splice(this.idxSix, 1);
		if(this.idxSix > 0){
			this.idxSix = this.idxSix - 1;
		}
		this.idxSeven = this.detailReglementsToRegler.length - 1;
		
	}
  }
  
  untagToReglement(){
	  if(this.idxSeven >= 0 && this.detailReglementsToRegler.length > 0){
		let detailReglementSrc = this.detailReglementsToRegler[this.idxSeven]; 
		let detailReglement = new DetailReglement();
		detailReglement.IdDetailCommande = detailReglementSrc.IdDetailCommande;
		detailReglement.LibelleArticle = detailReglementSrc.LibelleArticle;
		detailReglement.Quantite = detailReglementSrc.Quantite;
		detailReglement.Montant = detailReglementSrc.Montant;
		this.detailReglementsNonRegle.push(detailReglement);
		this.detailReglementsToRegler.splice(this.idxSeven, 1);
		if(this.idxSeven > 0){
			this.idxSeven = this.idxSeven - 1;
		}
		this.idxSix = this.detailReglementsNonRegle.length - 1;
	}
  }
  
  tagAllToReglement(){
	if(this.detailReglementsNonRegle.length > 0){
		let i = 0;
		for(let dr of this.detailReglementsNonRegle){
			let detailReglement = new DetailReglement();
			detailReglement.IdDetailCommande = dr.IdDetailCommande;
			detailReglement.LibelleArticle = dr.LibelleArticle;
			detailReglement.Quantite = dr.Quantite;
			detailReglement.Montant = dr.Montant;
			this.detailReglementsToRegler.push(detailReglement);
		}
		this.detailReglementsNonRegle = [];	
		this.idxSeven = this.detailReglementsToRegler.length - 1;
	}
  }
  
  untagAllToReglement(){
	  if(this.detailReglementsToRegler.length > 0){
		let i = 0;
		for(let dr of this.detailReglementsToRegler){
			let detailReglement = new DetailReglement();
			detailReglement.IdDetailCommande = dr.IdDetailCommande;
			detailReglement.LibelleArticle = dr.LibelleArticle;
			detailReglement.Quantite = dr.Quantite;
			detailReglement.Montant = dr.Montant;
			this.detailReglementsNonRegle.push(detailReglement);
		}
		this.detailReglementsToRegler = [];	
		this.idxSix = this.detailReglementsNonRegle.length - 1;	
	}
  }
  
  
  effectuerReglement(){
	  if(this.detailReglementsToRegler.length > 0){
		  let reglement = new Reglement();
		  reglement.IdCommande = this.commande.Identifiant;
		  reglement.IdModeReglement = 1;
		  reglement.DetailReglements = [];
		  for(let dr of this.detailReglementsToRegler){
				let detailReglement = new DetailReglement();
				detailReglement.IdDetailCommande = dr.IdDetailCommande;
				detailReglement.LibelleArticle = dr.LibelleArticle;
				detailReglement.Quantite = dr.Quantite;
				detailReglement.Montant = dr.Montant;
				reglement.DetailReglements.push(detailReglement);				
			}

	   this.g.showLoadingBlock(true);  
	   this.reglementSvc.etablirReglement(reglement).subscribe(
		(res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
		  Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
	   
	
	  }
  }
  

}

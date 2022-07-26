import { Component,HostListener,OnInit } from '@angular/core';
import { Router,NavigationStart,NavigationEnd,NavigationError,RoutesRecognized, ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';
import { Categorie } from '../entities/Categorie';
import { Article } from '../entities/Article';
import { Commande } from '../entities/Commande';
import { Utilisateur } from '../entities/Utilisateur';
import { DetailCommande } from '../entities/DetailCommande';
import { Localite } from '../entities/Localite';
import { Reglement } from '../entities/Reglement';
import { GroupeCode } from '../entities/GroupeCode';
import { EtatCommandeCode } from '../entities/EtatCommandeCode';
import { LocaliteCode } from '../entities/LocaliteCode';
import { ChartType, ChartOptions } from 'chart.js';
import  * as $ab from 'ng2-charts';

import { CommandeSvc } from '../services/commandeSvc';
import { LocaliteSvc } from '../services/localiteSvc';
import { ReglementSvc } from '../services/reglementSvc';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { CategorieSvc } from '../services/categorieSvc';
import { ArticleSvc } from '../services/articleSvc';
import{TypeUniteSvc} from '../services/typeuniteSvc';
import{CaisseSvc} from '../services/caisseSvc';
import {Subscription} from 'rxjs'
import { Rxjs } from '../services/rxjs';
import Swal from 'sweetalert2';
//import * as $ from 'jquery';


import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CategoriesComponent } from '../listes/categories/categories.component';
import { Caisse } from '../entities/Caisse';
@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.css']
})
export class CaisseComponent implements OnInit {
public type = "";
 public percentage = 15;
  public table? : boolean | false;
  //--------------------------------------
public totalColor : string = "box bg-dark text-center";
public serveurColor : string = "box bg-dark text-center";
public tableColor : string = "box bg-dark text-center";
public showlocale:boolean=false;
public showcaisse:boolean=true;
public showserveur:boolean=false;
 //------------------------------------
public EtatCommandeCode : EtatCommandeCode = new EtatCommandeCode();
public GroupeCode : GroupeCode = new GroupeCode();
public LocaliteCode:LocaliteCode=new LocaliteCode()
//--------------------------------------
public imageSrcCat : string =  'assets/categorie.jpg';
public imageSrcArt : string =  'assets/article.jpg';
//--------------------------------------
public totalVal : string = "0";
public calcVal : string = "0";
public searchTerm: string = "";
//--------------------------------------
public categories : Categorie[] = [];

//--------------------------------------
public articles : Article[] = [];
public article : Article =new Article();

//--------------------------------------
public localites : Localite[] = [];
public codelocalites :string[] = [];

public localitesOrg : Localite[] = [];

//--------------------------------------
public serveurs : Utilisateur[] = [];
public serveursOrg : Utilisateur[] = [];

//--------------------------------------
public commandes : Commande[] = [];
public commandesOrg : Commande[] = [];

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
public dateexpiration:string=""
public Message:string=""
public quantite:number=0
public numlot:string=''
public description:string=''
public numcommande:string=""
public caisses:Caisse[]=[]
public caissesOrg:Caisse[]=[]
public Unite:number=0
//--------------------------------------
public lstReglements : Reglement[] = [];
public idxThree : number = -1
public reglement : Reglement = new Reglement();
//--------------------------------------
//--------------------------------------
//--------------------------------------
public idxFour : number = -1
public idxFive : number = -1
//--------------------------------------
public reglementVMs : Reglement[] = [];
public typeunite:any
public idxSix : number = -1;
public idxSeven : number = -1;
public quantiteToRegler : number = 0;
public localeactive:string="";
public commandeCount:number=0
public caisse:Caisse|any=new Caisse()
//clickEventSubscription:Subscription;
//controleEventSubscription:Subscription;

 
 public pieChartLabels: any[] = [['SciFi'], ['Drama'], 'Comedy'];
  public pieChartData: any = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public id:number|any=0;
  public isReadOnly:boolean=false
  public backgroundcategorie:string=""
 public loadAPI!: Promise<any>;
 public  url = '../assets/node_modules/bootstrap-table/dist/bootstrap-table.min.js';
public colorMessage:string=""

  constructor(public route:ActivatedRoute,public TypeUniteSvc:TypeUniteSvc,public rxjs:Rxjs, public g: Globals,private commandeSvc:CommandeSvc,public CaisseSvc:CaisseSvc,
  private localiteSvc:LocaliteSvc,private reglementSvc:ReglementSvc,public utilisateurSvc:UtilisateurSvc,
  private router: Router,private categorieSvc:CategorieSvc,
  private articleSvc:ArticleSvc) {
    this.g.showLoadingBlock(true);
   this.route.params.subscribe(params => {
      if(params['id']!=null) {
       debugger
       	this.commandeSvc.getCommandeById(params['id']).subscribe((res:any) => {
			let etatReponse = res["EtatReponse"];
			if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			  this.commande = res["commandeVM"];
        this.numcommande=this.commande.Numero
     this.isReadOnly=true
    }
  });
      }
        })


    this.TypeUniteSvc.getListeTypeUnites().subscribe(
      (res:any) => {
      let etatReponse = res["EtatReponse"];
      if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        this.typeunite = res["typeUniteVMs"];
        console.log( this.typeunite)
      }})

  this.CaisseSvc.getCaisse().subscribe(
    (res:any) => {
    let etatReponse = res["EtatReponse"];
    if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
      this.caissesOrg = res["caisseVMs"];
    }})
	
				//-----------------------------------------------------------------------------------------------
				this.g.showLoadingBlock(true);
				this.categorieSvc.getCategories().subscribe(
				  (res:any) => {
					let etatReponse = res["EtatReponse"];
					if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
					  this.g.categories = res["categorieVMs"];
            /*  for(let o of this.g.categories){
						  o.PathImage = this.g.baseUrl + '/api/Categorie/showImageCategorie?identifiant=' + o.Identifiant;
					  } */
					  //this.chargerListeCat();
					  //----------------------------------------------------

					  this.g.showLoadingBlock(true);
					  this.articleSvc.getArticles().subscribe(
						(res:any) => {
						  let etatReponse = res["EtatReponse"];
						  if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
							this.g.articlesOrg = res["articleVMs"];
             /*  for(let a of this.g.articlesOrg){
								  a.PathImage = this.g.baseUrl + '/api/Article/showImageArticle?identifiant=' + a.Identifiant;
							  } */
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
			 
			
		
   }

  ngOnInit(): void {
    this.g.title="Allimentation"
        var $: any;
  	this.type="CAT";
    this.table=true;
    console.log("table "+this.g.articlesOrg);
     this.loadScript()
     for(const x in this.LocaliteCode){
        if(x!=this.LocaliteCode.EMPORTER){
      this.codelocalites.push(x)}
     }
     this. getcountcommande()
  }
  async refrechtable(){
   
    var datatable = $('#datatableexample').DataTable();
                //datatable reloading 
                  datatable.destroy();
    setTimeout(() => {
     $('#datatableexample').DataTable( {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        lengthMenu : [5, 10, 25]
    } );
   }, 200);
  
  } 
  getcountcommande(){
       this.commandeSvc.getCommandesNonReglees().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
         console.log("code",etatReponse.Code)
        
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
           let commandes:Commande[]=res["commandeVMs"]
           commandes = commandes.filter(x=>x.IdCreePar==this.g.utilisateur!.Identifiant);
      this.commandeCount=commandes.length
          }})
 
  }
  initcommande(){
    
this.localeactive=""
    this.commande=new Commande();
  }
  	public async loadScript() {
     
      //console.log(this.url)
        let node = document.createElement('script');
        node.src = this.url;
        node.type = 'text/javascript';
       await setTimeout(()=>{
  
        document.getElementById("script")?.appendChild(node);
        },0)
      
    }	
show(showparam:string){
  //console.log(showparam)
switch (showparam){
  case "localite":
    if(this.showlocale==false){
this.showcaisse=false
this.showlocale=true
this.showserveur=false
    }
    else{
      this.showcaisse=true
this.showlocale=false
this.showserveur=false
    }

    break;
     case "serveur":
    if(this.showserveur==false){
      this.showListeServeur()
this.showcaisse=false
this.showserveur=true
this.showlocale=false
    }
    else{
      this.showcaisse=true
this.showlocale=false
this.showserveur=false
    }

    break;
}

}
setarticle(item:Article){
 
this.article=item;
console.log(item)
this.Unite=item.IdTypeUnite;
($('#responsive-modal') as any).modal('hide');
}

setcaisse(item:Caisse){
 
  this.caisse=item;
  ($('#stock-modal') as any).modal('hide');
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


    chargerArticle(event :any) {
     
     
    this.type="ARTICLE";
   if(event){
    let id:number= event.target.value   
if(id!=0){
 this.articles = this.g.articlesOrg.filter(x=>x.IdCategorie==id)
}
else{
  this.articles = this.g.articlesOrg;
}
   }
   else{
    this.articles = this.g.articlesOrg;
   }
   
  
    this.refrechtable()
    //this.totalPageArt = this.calculatePagesCountArt(this.pageSizeArt,this.g.articles.length);
    //this.chargerListeArt();
  }

  chargerstock(event :any) {
     console.log(this.caissesOrg)
   if(event){
    let id:number= event.target.value   
if(id!=0){
 //this.caisses = this.caissesOrg.filter(x=>x.Identifiant==id)
}
else{
  this.caisses = this.caissesOrg;
}
   }
   else{
    this.caisses = this.caissesOrg;
   }
   
  
    this.refrechtable()
    //this.totalPageArt = this.calculatePagesCountArt(this.pageSizeArt,this.g.articles.length);
    //this.chargerListeArt();
  }
showarticle(){
   ($('#responsive-modal') as any).modal('show');
   this.chargerArticle(null)
   
}
 showstock(){
  ($('#stock-modal') as any).modal('show');
  this.chargerstock(null)
  
} 

   chargerArticlebyname() {
     console.log('this.searchTerm')
    this.type="ARTICLE";
    this.articles = this.g.articlesOrg.filter(x => x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }





 //====================================================================================================

  //====================================================================================================


  //====================================================================================================

  //====================================================================================================

  //====================================================================================================

  //====================================================================================================

  

  selectArticle(){
	//this.scrollToBottom();
//console.log(idArticle)
	if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		if(this.calcVal == '0'){
      this.calcVal = '1';
    }
      let detailCommande = new DetailCommande();
      detailCommande.IdArticle = this.article.Identifiant;
      detailCommande.LibelleArticle = this.article.Libelle;
      detailCommande.IdTypeUnite=this.article.IdTypeUnite;
      detailCommande.Quantite = Number(this.quantite);
      detailCommande.Montant = this.article.Montant;
      detailCommande.TauxTVA=this.article.TauxTva;
      detailCommande.LibelleTypeUnite=this.article.LibelleTypeUnite
      detailCommande.DateExpiration=this.dateexpiration
      detailCommande.Description=this.description
      detailCommande.NumerodeLot=this.numlot
      detailCommande.IdCaisse=this.caisse.Identifiant
if(this.validatepush(detailCommande)){
  this.commande.DetailCommandes.push(detailCommande);
      this.calcVal = '0';
    this.initdetailcommande()
}
    
	}

  }
   validatepush(detailCommande:DetailCommande){
   let res:boolean
if(detailCommande.IdArticle==0){
res= false
this.Message="selectioner article"
}
else if(detailCommande.Quantite==0 ){
res=false
this.Message="erreur de quanite saisie"
}
else if(detailCommande.DateExpiration=="" ){
res=false
this.Message="erreur date expiration"
}
else if(detailCommande.IdTypeUnite==0 ){
  res=false
  this.Message="erreur Unite"
  }
  else if(detailCommande.IdCaisse==0 ){
    res=false
    this.Message="erreur Stock"
    }
else{
  res=true
}
return res
}
  initdetailcommande(){
    this.quantite=0
    this.description=''
    this.numlot=''
    this.dateexpiration=""
    this.article=new Article()
    this.caisse=new Caisse()
  }
  
  getRowIndex(x : any){
	//	console.log(x);
		this.idxOne = x;
	   //console.log("Row index is: " + x.rowIndex);
	  
  }

   getnavIndex(x : any){
		this.idnav = x;
	   //console.log("Row index is: " + x.rowIndex);
	  
  }


  remove(index:number) {
         Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes!'
}).then((result) => {
     if( result.isConfirmed && this.commande.DetailCommandes.length > 0 && this.commande.DetailCommandes[index].QuantiteServi==0 &&  this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
      this.commande.DetailCommandes.splice(index, 1);
      if(this.idxOne == this.commande.DetailCommandes.length){
        this.idxOne--;
      }
    }
    this.updateTotalVal();
})

  }

  updateTotalVal(){
    let mnt = 0;    
    for(let o of this.commande.DetailCommandes){
      mnt = mnt + (o.Quantite * o.Montant);
    }
    this.totalVal = "" + mnt;
    this.totalColor= (mnt == 0 )? "box bg-dark text-center" : "box bg-success text-center";
  }

  async valider(){
  
  if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		  
		if(this.commande.Identifiant == null || this.commande.Identifiant === 0){
     // this.commande.CodeCommande="VENT"
     // this.commande.Numero=this.numcommande
		  this.ajouterCommande();
		}else{
		  this.modifierCommande();
		}

	}

  }


  ajouterCommande(){
    //alert('ajouterCommande');
      
      this.g.showLoadingBlock(true);
      this.commandeSvc.allimentationstock(this.commande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          //let idCommande = res["idCommande"];
          this.commande=new Commande()
          
         // this.getCommandeById(idCommande);
         // this.getcountcommande()
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
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
          console.log(this.commande)
          if(this.commande == null){
            this.commande = new Commande();
          }
          this.updateTotalVal();
		 
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
  }
  


  nouvCommande(){
    this.initcaisse()
  }

  chargerListLocalite(code:string){
console.log("ok")
if(this.type=='CONTROLE'|| this.type=='COM'){
  console.log("liste commande")
   this.localiteSvc.getLocalites().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.localitesOrg = res["localiteVMs"];
          console.log( this.localitesOrg)
this.localitesOrg=this.localitesOrg.filter(x => x.Code === code)
          //this.totalPageLoc = this.calculatePagesCountLoc(this.pageSizeLoc,this.localitesOrg.length);
    

          this.localites.length = 0;
          this.localites = [];

         


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
else{
  console.log("liste commande dispo")
    this.localiteSvc.getLocalitesDisponible().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.localitesOrg = res["localiteVMs"];
         // console.log( this.localitesOrg[0])
this.localitesOrg=this.localitesOrg.filter(x => x.Code === code)
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
    /* this.g.showLoadingBlock(true);   */
   

    
  }

  chargerListServeur(){


   /*  this.g.showLoadingBlock(true);   */
    this.utilisateurSvc.getServeurs(null).subscribe(
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

  showListeLocalite(code:string){
     if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		  this.localeactive=code
   // this.idnav=3
    this.chargerListLocalite(code);
	  }
   
  }



  showListeServeur(){
    
   // this.idnav=2
    this.chargerListServeur();
    //($('#serveurModal') as any).modal('show');
  }


  
  selectLocalite(idLocalite : any){
    //alert('selectLocalite idArticle : ' + idLocalite);
    if(this.type=='CONTROLE'|| this.type=='COM'){
this.commandes=this.commandesOrg.filter(x=>x.IdLocalite==idLocalite)
    }
    else{

   
    this.tableColor="box bg-megna text-center";
    let localite = this.localites.filter(x => x.Identifiant === idLocalite)[0];
    this.commande.LibelleLocalite = localite.Libelle;
    this.commande.IdLocalite = localite.Identifiant;
       this.idnav=1; }
    //($('#localiteModal') as any).modal('hide');
    this.tableColor="box bg-megna text-center";
    this.localites=[]
    this.localeactive=""
    this.show('localite')
  }

  selectServeur(idServeur : any){
    //alert('selectS idArticle : ' + idLocalite);
    this.serveurColor="box bg-primary text-center";
    let serveur = this.serveurs.filter(x => x.Identifiant === idServeur)[0];
    this.commande.NomServeur = serveur.Nom;
    this.commande.IdServeur = serveur.Identifiant;
    this.idnav=1;
    
    //($('#serveurModal') as any).modal('hide');
    this.show('serveur')
  }




  selectCommande(idCommande : any){
    this.getCommandeById(idCommande);
    //($('#commandesNonRegleesModal') as any).modal('hide');
  }


  initcaisse(){
    this.type="CAT"
    this.commandes=[]
    this.commandes.length=0
    this.getCommandeById(0);
   
  }
  controler(){

 this.g.showLoadingBlock(true);
      this.commandeSvc.controlerCommande(this.commande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.initcommande();
          let idCommande = res["idCommande"];
             let idx=0
             let y:Commande
	     for(y of this.commandes){
if(y.Identifiant===idCommande){

  break
}
else{
  idx+=1
}

     }
     console.log(idx)
this.commandes.splice(idx, 1)
          //this.getCommandeById(idCommande);
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
  }

 
}


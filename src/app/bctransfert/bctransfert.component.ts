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
import { DetailReglement } from '../entities/DetailReglement';
import { GroupeCode } from '../entities/GroupeCode';
import { EtatCommandeCode } from '../entities/EtatCommandeCode';
import { LocaliteCode } from '../entities/LocaliteCode';
import { ChartType, ChartOptions } from 'chart.js';
import {Location} from '@angular/common';
import  * as $ab from 'ng2-charts';
import { CommandeSvc } from '../services/commandeSvc';
import { LocaliteSvc } from '../services/localiteSvc';
import { ReglementSvc } from '../services/reglementSvc';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { CategorieSvc } from '../services/categorieSvc';
import { ArticleSvc } from '../services/articleSvc';
import{CaisseSvc} from '../services/caisseSvc';
import {Subscription} from 'rxjs'
import { Rxjs } from '../services/rxjs';
import{Caisse}from '../entities/Caisse';
import{TypeUniteSvc} from '../services/typeuniteSvc';
import Swal from 'sweetalert2'
//import * as $ from 'jquery';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CategoriesComponent } from '../listes/categories/categories.component';

@Component({
  selector: 'app-bctransfert',
  templateUrl: './bctransfert.component.html',
  styleUrls: ['./bctransfert.component.css']
})

export class BctransfertComponent implements OnInit {
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
public typeunite:any
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

public detailCommande:DetailCommande=new DetailCommande()
public detailCommandes:DetailCommande[]=[]
public detailCommandesOrg:DetailCommande[]=[]
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
public quantite:number=0
public tva:number=0
public prix:number=0
public numlot:string=''
public description:string=''
public numcommande:string=""
//--------------------------------------
public lstReglements : Reglement[] = [];
public idxThree : number = -1
public reglement : Reglement = new Reglement();
//--------------------------------------
//--------------------------------------
public caisses:Caisse[]=[]
public caissesOrg:Caisse[]=[]
//--------------------------------------

//--------------------------------------
public reglementVMs : Reglement[] = [];

public boncommande: Commande |any;
public detailboncommande: DetailCommande[] = [];
public idxSix : number = -1;
public idxSeven : number = -1;
public quantiteToRegler : number = 0;
public localeactive:string="";
public commandeCount:number=0;
public Unite:number=0

//clickEventSubscription:Subscription;
//controleEventSubscription:Subscription;
public Message:string=""
public TotaleHT:number=0
public TotaleTTC:number=0
public TotaleTVA:number=0
public lstdc:DetailCommande[]=[]
 public pieChartLabels: any[] = [['SciFi'], ['Drama'], 'Comedy'];
  public pieChartData: any = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public backgroundcategorie:string=""
 public loadAPI!: Promise<any>;
 public  url = '../assets/node_modules/bootstrap-table/dist/bootstrap-table.min.js';
public colorMessage:string=""
public caisse:Caisse|any=new Caisse()
public sub:any
public id:number=0
  constructor(public route:ActivatedRoute,public rxjs:Rxjs, public g: Globals,private commandeSvc:CommandeSvc,public TypeUniteSvc:TypeUniteSvc,
  private localiteSvc:LocaliteSvc,private reglementSvc:ReglementSvc,public utilisateurSvc:UtilisateurSvc,
  private router: Router,private categorieSvc:CategorieSvc,public CaisseSvc:CaisseSvc,
  private articleSvc:ArticleSvc,private _location: Location) {

	this.g.showLoadingBlock(true);
  this.sub = this.route.params.subscribe(params => {
    if(params['id']!=null) {
      this.id=params['id']}
      })
this.commandeSvc.getCommandeById(this.id).subscribe((res:any) => {
    let etatReponse = res["EtatReponse"];
    if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
      this.boncommande = res["commandeVM"];
     
    this.commande.IdLocalite=this.boncommande.IdLocalite;
    this.commande.IdSource=this.boncommande.Identifiant;
     this.commande.LibelleLocalite=this.boncommande.LibelleLocalite;
      this.commande.CodeCommande="ACHAT";
      this.getfilter(this.boncommande.DetailCommandes)
  }
});
    
    this.TypeUniteSvc.getListeTypeUnites().subscribe(
      (res:any) => {
      let etatReponse = res["EtatReponse"];
      if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        this.typeunite = res["typeUniteVMs"];
        console.log( this.typeunite)
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
                
                this.CaisseSvc.getCaisse().subscribe(
                  (res:any) => {
                  let etatReponse = res["EtatReponse"];
                  if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
                    this.caissesOrg = res["caisseVMs"];
                  }})
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
    var $: any;
    this.g.title="Achat"
this.type="CAT";
this.table=true;
console.log("table "+this.g.articlesOrg);
 this.loadScript()
 for(const x in this.LocaliteCode){
    if(x!=this.LocaliteCode.EMPORTER){
  this.codelocalites.push(x)}
 }
// this. getcountcommande()
}

 async refrechtableste(){

var datatable = $('#datatableste').DataTable();
            //datatable reloading 
              datatable.destroy();
setTimeout(() => {
 $('#datatableste').DataTable( {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    lengthMenu : [5, 10, 25]
} );
}, 200);

} 
showstock(){
  ($('#stock-modal') as any).modal('show');
  this.chargerstock(null)
  
}
chargerstock(event :any) {
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


 this.refrechtableste()

}
setcaisse(item:Caisse){
 
  this.caisse=item;
  ($('#stock-modal') as any).modal('hide');
  }
async refrechtabledc(){

var datatable = $('#datatabledc').DataTable();
            //datatable reloading 
              datatable.destroy();
setTimeout(() => {
 $('#datatabledc').DataTable( {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    lengthMenu : [5, 10, 25]
} );
}, 200);

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
setarticle(item:DetailCommande){
  console.log(item)
  this.article=new Article
  this.article.Identifiant=item.IdArticle;
  this.article.Libelle=item.LibelleArticle
  this.article.Montant=item.Montant
  this.prix=item.Montant
  this.quantite=item.Quantite
  this.tva=item.TauxTVA
  //console.log(item)
  this.Unite=item.IdTypeUnite;
  ($('#responsive-modal') as any).modal('hide');
}
//===================================================================
setdc(item:DetailCommande){
console.log(this.article)
this.article=this.g.articlesOrg.filter(x=>x.Identifiant==item.IdArticle)[0]
this.detailCommande=item;
this.numlot=item.NumerodeLot;
this.prix=  this.article.Montant;
this.tva= this.article.TauxTva;
this.detailCommandes=[];
this.refrechtabledc();
($('#responsive-modal') as any).modal('hide');

}

getdetailcommandes(item:Article){
//debugger
console.log(item)

this.commandeSvc.getDetailCommandesstockparam(item.Identifiant).subscribe(
  (res:any) => {
    this.detailCommandes.length=0
  //  this.refrechtabledc()
    let etatReponse = res["EtatReponse"];
  
    
    if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        
       this.detailCommandes=res["detailCommandeVMs"]
     console.log(this.detailCommandes)
      this.detailCommandes= this.detailCommandes.filter(x=>x.IdValiderPar!=null && x.Quantite>x.QuantiteServi)
      if(this.commande.DetailCommandes.length>0){
        this.detailCommandes= this.detailCommandes.filter(x=>!this.commande.DetailCommandes.find(y=>y.NumerodeLot==x.NumerodeLot))
      }
    this.refrechtabledc()
       //commandes = commandes.filter(x=>x.IdCreePar==this.g.utilisateur!.Identifiant);
  //this.commandeCount=commandes.length
      }})
}

updatetotale(){
this.TotaleHT=0
this.TotaleTVA=0
this.commande.DetailCommandes.forEach((x:any)=>{
this.TotaleHT+= x.Montant*x.Quantite
this.TotaleTVA+= x.Montant*x.Quantite*x.TauxTVA/100
})


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
showarticle(){
this.searchTerm="";
($('#responsive-modal') as any).modal('show');
this.chargerArticle(null)

}
showcomercial(){
this.searchTerm="";
($('#responsive-modal') as any).modal('show');
//this.chargerArticle(null)

}

chargerArticlebyname() {
 console.log('this.searchTerm')
this.type="ARTICLE";
this.articles = this.g.articlesOrg.filter(x => x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()));
}
chargerlocalbyname(){
this.localites=this.localitesOrg.filter(x=>x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()))
}



//====================================================================================================

//====================================================================================================


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

selectArticle(){
//this.scrollToBottom();
if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
if(this.calcVal == '0'){
  this.calcVal = '1';
}
 // let article = this.g.articlesOrg.filter(x => x.Identifiant === idArticle)[0];
  console.log("dc=",this.detailCommande)
  let detailCommande = new DetailCommande();
  detailCommande.IdArticle = this.article.Identifiant;
  detailCommande.LibelleArticle = this.article.Libelle;
  detailCommande.IdTypeUnite=this.Unite;
  detailCommande.Quantite = Number(this.quantite);
  detailCommande.Montant = this.article.Montant;
  detailCommande.TauxTVA=this.article.TauxTva;
  detailCommande.LibelleTypeUnite=this.article.LibelleTypeUnite
  detailCommande.DateExpiration=this.dateexpiration
  detailCommande.Description=this.description
  detailCommande.NumerodeLot=this.numlot
  detailCommande.IdCaisse=this.caisse.Identifiant




  //detailCommande2.NumerodeLot=this.numlot
 
if(this.validatepush(detailCommande)){
this.commande.DetailCommandes.push(detailCommande);
this.boncommande.DetailCommandes.filter((dc:DetailCommande)=>dc.IdArticle==detailCommande.IdArticle && (dc.QuantiteServi+=detailCommande.Quantite))
this.TotaleHT+= detailCommande.Montant*detailCommande.Quantite
this.TotaleTVA+= detailCommande.Montant*detailCommande.Quantite*detailCommande.TauxTVA/100
  this.calcVal = '0';
  this.getfilter(this.boncommande.DetailCommandes)
this.initdetailcommande()
}
else{
Swal.fire({ text: this.Message , icon: 'error'});
this.Message=""
}


 //  console.log("article",detailCommande)
//}    
// this.commande.DetailCommandes = this.commande.DetailCommandes;

//this.idxOne = this.commande.DetailCommandes.length - 1;

//console.log(this.commande.DetailCommandes.length);
//this.updateTotalVal();

//this.scrollToBottom();
}



}
initdetailcommande(){
this.quantite=0
this.description=''
this.numlot=''

this.prix=0
this.tva=0
this.article=new Article()
}


chargercat(){
this.type="CAT";
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
 if( result.isConfirmed &&  this.commande.DetailCommandes.length > 0 && this.commande.DetailCommandes[index].QuantiteServi==0 
  &&  this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
    this.boncommande.DetailCommandes.filter((dc:DetailCommande)=>dc.IdArticle==this.commande.DetailCommandes[index].IdArticle && (dc.QuantiteServi-=this.commande.DetailCommandes[index].Quantite))
  this.commande.DetailCommandes.splice(index, 1);
  if(this.idxOne == this.commande.DetailCommandes.length){
    this.idxOne--;
  }
}
this.updatetotale()
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
 // this.commande.Numero=this.numcommande
 this.commande.CodeCommande="ACHAT"
  this.ajouterCommande();
}else{
  this.modifierCommande();
}

}
this.getcountcommande()

}
getfilter(items:DetailCommande[]|any){
  this.lstdc=[]
  if(items!=null  ){
    //console.log(items)
    this.lstdc=items.filter((x:any)=>x.Quantite!=x.QuantiteServi)
    console.log( "xx=",this.lstdc)
  }

}

ajouterCommande(){
//alert('ajouterCommande');
  
  this.g.showLoadingBlock(true);
  this.commandeSvc.etablirCommande(this.commande).subscribe(
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
      Swal.fire({ text: etatReponse.Message , icon: 'success'});
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
  this.updateComponentView();
    }else{ 
      Swal.fire({ text: etatReponse.Message , icon: 'error'});
    }
    //this.g.showLoadingBlock(false);    
  }
);
}

updateComponentView(){
// console.log(this.commande);
}

nouvCommande(){
this.initcaisse()
}


chargerListLocalite(){

console.log("liste commande dispo")
this.localiteSvc.getLocalites().subscribe(
  (res:any) => {
    let etatReponse = res["EtatReponse"];
    if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
      this.localitesOrg = res["localiteVMs"];
     // console.log( this.localitesOrg[0])
this.localitesOrg=this.localitesOrg.filter(x => x.Code === "CLIENT")
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
    this.refrechtableste()
  }
);


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

showListeLocalite(){
this.searchTerm="";
this.chargerListLocalite();
($('#societe-modal') as any).modal('show')

}


showListeServeur(){

// this.idnav=2
this.chargerListServeur();
//($('#serveurModal') as any).modal('show');
}


selectLocalite(idLocalite : any){
//alert('selectLocalite idArticle : ' + idLocalite);
this.tableColor="box bg-megna text-center";
let localite = this.localites.filter(x => x.Identifiant === idLocalite)[0];
this.commande.LibelleLocalite = localite.Libelle;
this.commande.IdLocalite = localite.Identifiant;
($('#societe-modal') as any).modal('hide');
this.localites=[]   
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
getstyle(item:Categorie){
return    {'background-color': item.Background}
}

}
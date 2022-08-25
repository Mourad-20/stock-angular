import { Component,HostListener,OnInit } from '@angular/core';
import { Router,NavigationStart,NavigationEnd,NavigationError,RoutesRecognized,ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';
import { Categorie } from '../entities/Categorie';
import { Article } from '../entities/Article';
import { Commande } from '../entities/Commande';
import { Utilisateur } from '../entities/Utilisateur';
import { DetailCommande } from '../entities/DetailCommande';
import { Localite } from '../entities/Localite';
import { GroupeCode } from '../entities/GroupeCode';
import { EtatCommandeCode } from '../entities/EtatCommandeCode';
import { SocieteCode } from '../entities/LocaliteCode';
import { CommandeSvc } from '../services/apiService/commandeSvc';
import { LocaliteSvc } from '../services/apiService/localiteSvc';
import { UtilisateurSvc } from '../services/apiService/utilisateurSvc';
import { CategorieSvc } from '../services/apiService/categorieSvc';
import { ArticleSvc } from '../services/apiService/articleSvc';
import { Rxjs } from '../services/apiService/rxjs';
import Swal from 'sweetalert2';
import { TransfertSvc } from '../services/frontService/transfertSvc';
//import * as $ from 'jquery';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CategoriesComponent } from '../listes/categories/categories.component';
@Component({
  selector: 'app-dtransfert',
  templateUrl: './dtransfert.component.html',
  styleUrls: ['./dtransfert.component.css']
})

export class DtransfertComponent implements OnInit {
public commande:Commande=new Commande;
public commandedevis:Commande=new Commande;
public idxOne : DetailCommande|any=null
public type = "";
 public percentage = 15;
  public table? : boolean | false;
  public sub:any
  public id:number=0
  public articles : Article[] = [];
public article : Article =new Article();
public commandeCount:number=0
  //--------------------------------------
public dateexpiration:string=""
public quantite:number=0
public tva:number=0
public prix:number=0
public numlot:string=''
public description:string=''
public numcommande:string=""
public TotaleHT:number=0
public TotaleTTC:number=0
public TotaleTVA:number=0
public quantitemax:number=0
public EtatCommandeCode : EtatCommandeCode = new EtatCommandeCode();
public detailcommandedevis: DetailCommande[] = [];
public detailCommande:DetailCommande=new DetailCommande()
public detailCommandes:DetailCommande[]=[]
public detailCommandesOrg:DetailCommande[]=[]
public calcVal : string = "0";
public Message:string=""
public categories : Categorie[] = [];
  //--------------------------------------
public SocieteCode:SocieteCode=new SocieteCode()
public searchTerm: string = "";

public localites : Localite[] = [];
public codelocalites :string[] = [];
public localitesOrg : Localite[] = [];
//--------------------------------------

//clickEventSubscription:Subscription;
//controleEventSubscription:Subscription;

  constructor(public route:ActivatedRoute,public rxjs:Rxjs, public g: Globals,private commandeSvc:CommandeSvc,
  private localiteSvc:LocaliteSvc,public utilisateurSvc:UtilisateurSvc,
  private router: Router,private categorieSvc:CategorieSvc,
  private articleSvc:ArticleSvc,public transfertSvc:TransfertSvc) {

  this.g.showLoadingBlock(true);
  this.route.params.subscribe(params => {
    if(params['id']!=null) {

     this.transfertSvc.setCommandeOregine(params['id'])

	
		
			if(transfertSvc.commandeOregine.Identifiant != null) {
        transfertSvc.commande.CodeCommande="VENT";
    }
 
    }
      })

		
			
				//-----------------------------------------------------------------------------------------------
				this.g.showLoadingBlock(true);
				this.categorieSvc.getCategories().subscribe(
				  (res:any) => {
					let etatReponse = res["EtatReponse"];
					if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
					  this.g.categories = res["categorieVMs"];
          this.g.showLoadingBlock(true);
					  this.articleSvc.getArticles().subscribe(
						(res:any) => {
						  let etatReponse = res["EtatReponse"];
						  if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
							this.g.articlesOrg = res["articleVMs"];
              this.chargerListeCat()
						  }
              else{
                console.log("Message01")
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
			  
			
			this.g.showLoadingBlock(false);    
		  
   }


  ngOnInit(): void {
    this.initcommande()

        var $: any;
  	this.type="CAT";
    this.table=true;
  
     for(const x in this.SocieteCode){
        if(x==this.SocieteCode.CLIENT){
      this.codelocalites.push(x)}
     }
  }
  chargerListeCat(){
    this.categories.length = 0;

    for (let i = 0; i < this.g.categories.length; i++) {
      this.categories.push(this.g.categories[i]);
    }


}
  async refrechtableste(){
  var datatable = $('#datatableste').DataTable();
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

   async refrechtabledc(){
    var datatable = $('#datatabledc').DataTable();
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

filter(items:DetailCommande[]|any){
  if(items!=null  ){
    return items.filter((x:any)=>x.Quantite!=x.QuantiteServi)
  }
return []
}


//==================================================================
setarticle(item:DetailCommande){
  this.idxOne=item
  this.quantitemax=item.Quantite-item.QuantiteServi;
 this.getdetailcommandes(item.IdArticle)
 this.refrechtabledc()
 }

//===================================================================
setdc(item:DetailCommande){
 
  this.article=this.g.articlesOrg.filter(x=>x.Identifiant==item.IdArticle)[0]
  this.detailCommande=item;
  this.numlot=item.NumerodeLot;
 this.prix=  this.article.Montant;
  this.tva= this.article.TauxTva;
  
this.quantite=(this.idxOne.Quantite-this.idxOne.QuantiteServi)>(item.Quantite-item.QuantiteServi)?(item.Quantite-item.QuantiteServi):(this.idxOne.Quantite-this.idxOne.QuantiteServi);
  this.detailCommandes=[];
  this.refrechtabledc();
  ($('#responsive-modal') as any).modal('hide');

}

getdetailcommandes(item:number){
  //debugger

 this.commandeSvc.getDetailCommandesstockparam(item).subscribe(
      (res:any) => {
        this.detailCommandes.length=0
      //  this.refrechtabledc()
        let etatReponse = res["EtatReponse"];
      
        
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
            
           this.detailCommandes=res["detailCommandeVMs"]
          
         console.log(this.detailCommandes)
          this.detailCommandes= this.detailCommandes.filter(x=>x.IdValiderPar!=null && x.Quantite>x.QuantiteServi)
          if(this.transfertSvc.commande.DetailCommandes.length>0){
            this.detailCommandes= this.detailCommandes.filter(x=>!this.transfertSvc.commande.DetailCommandes.find(y=>y.NumerodeLot==x.NumerodeLot))
          }
        //this.refrechtabledc()
           //commandes = commandes.filter(x=>x.IdCreePar==this.g.utilisateur!.Identifiant);
      //this.commandeCount=commandes.length
          }})
}

updatetotale(){
  this.TotaleHT=0
  this.TotaleTVA=0
  this.transfertSvc.commande.DetailCommandes.forEach((x:any)=>{
    this.TotaleHT+= x.Montant*x.Quantite
    this.TotaleTVA+= x.Montant*x.Quantite*x.TauxTVA/100
  })
  

}

showarticle(){
  this.searchTerm="";
   ($('#responsive-modal') as any).modal('show');
  // this.chargerArticle(null)

   //this.transfertSvc.commandeOregine.DetailCommandes.filter((dc:DetailCommande)=>dc.Quantite>dc.QuantiteServi)
   this.transfertSvc.filterCommandeOregine();
   //console.log( this.transfertSvc.commandeOregine.DetailCommandes)
}

   chargerArticlebyname() {
    this.type="ARTICLE";
    this.articles = this.g.articlesOrg.filter(x => x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

chargerlocalbyname(){
  this.localites=this.localitesOrg.filter(x=>x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()))
}


 
  
 validatepush(detailCommande:DetailCommande){
  debugger
   let res:boolean

if(detailCommande.IdArticle==0){
res= false
this.Message="selectioner article"
}
else if(detailCommande.Quantite<=0 || detailCommande.Quantite>(this.detailCommande.Quantite-this.detailCommande.QuantiteServi) || detailCommande.Quantite>this.quantitemax){
res=false
this.Message="erreur de quanite saisie"
}
else{
  res=true
}
return res
}

  selectArticle(){
    
	if(this.transfertSvc.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		if(this.calcVal == '0'){
      this.calcVal = '1';
    }
    
      let detailCommande2 = new DetailCommande();
      let detailCommande1=JSON.parse(JSON.stringify(this.detailCommande))
      detailCommande2.NumerodeLot= detailCommande1.NumerodeLot
      detailCommande2.IdArticle= detailCommande1.IdArticle
      detailCommande2.LibelleArticle= detailCommande1.LibelleArticle
      detailCommande2.IdTypeUnite= detailCommande1.IdTypeUnite
      detailCommande2.LibelleTypeUnite= detailCommande1.LibelleTypeUnite
      detailCommande2.Quantite = Number(this.quantite);
      
      detailCommande2.Montant=this.prix
      detailCommande2.TauxTVA=this.tva
      detailCommande2.Description=this.description

if(this.validatepush(detailCommande2)){
  this.transfertSvc.commande.DetailCommandes.push(detailCommande2);

  this.updatetotale()
      this.calcVal = '0';
    this.initdetailcommande()

}
else{
  console.log("Message1")
   Swal.fire({ text: this.Message , icon: 'error'});
   this.Message=""
}
	}
  }
 initcommande(){
   this.transfertSvc.initservice()
 }
  initdetailcommande(){
   
    this.quantite=0
    this.description=''
    this.numlot=''
   this.dateexpiration=''
    this.prix=0
    this.tva=0
    this.article=new Article()
  }
  
  remove(index:number) {
    console.log(this.transfertSvc.commande.DetailCommandes[index])
         Swal.fire({
          title: 'Êtes-vous sûr?',
          text: "Vous ne pourrez pas revenir en arrière !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui!'
}).then((result) => {
     if( result.isConfirmed &&  this.transfertSvc.commande.DetailCommandes.length > 0 && this.transfertSvc.commande.DetailCommandes[index].QuantiteServi==0 
      &&  this.transfertSvc.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
        this.transfertSvc.commandeOregine.DetailCommandes.filter((dc:DetailCommande)=>dc.IdArticle==this.transfertSvc.commande.DetailCommandes[index].Identifiant && (dc.QuantiteServi-=this.transfertSvc.commande.DetailCommandes[index].Quantite))
      this.transfertSvc.commande.DetailCommandes.splice(index, 1);
   
    }
    this.updatetotale()
})}


  async valider(){

    if(  this.transfertSvc.commandeOregine.DetailCommandes.filter(x=>x.Quantite>x.QuantiteServi).length>0
){

var Message="Votre commande est pas valide avec devis"
 Swal.fire({ text: Message , icon: 'error'});
return
}
	  if(this.transfertSvc.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		  
		if(this.transfertSvc.commande.Identifiant == null || this.transfertSvc.commande.Identifiant === 0){
     // this.transfertSvc.commande.Numero=this.numcommande
     this.transfertSvc.commande.CodeCommande="VENT"
		  this.ajouterCommande();
		}else{
		  this.modifierCommande();
		}

	}
  this.getcountcommande()

  }
  getcountcommande(){
    this.commandeSvc.getCommandesNonReglees().subscribe(
   (res:any) => {
     let etatReponse = res["EtatReponse"];
     
     if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        let commandes:Commande[]=res["commandeVMs"]
        commandes = commandes.filter(x=>x.IdCreePar==this.g.utilisateur!.Identifiant);
   this.commandeCount=commandes.length
       }})

}


 ajouterCommande(){
      this.g.showLoadingBlock(true);
      this.commandeSvc.etablirCommande(this.transfertSvc.commande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
            this.commandeSvc.controlerCommande(this.transfertSvc.commandeOregine).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
	  this.modifierCommandedevis(this.transfertSvc.commandeOregine);

        }})
        //  this.commande=new Commande()
          
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
      this.commandeSvc.modifierCommande(this.transfertSvc.commande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          let idCommande = res["idCommande"];
          this.getCommandeById(idCommande);
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          console.log("Message4")
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
    
  }
  modifierCommandedevis(item:Commande){
    //alert('modifierCommande');

      this.g.showLoadingBlock(true);
      this.commandeSvc.modifierCommande(item).subscribe(
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
          this.updatetotale();
		  //this.updateComponentView();
        }else{ 
          console.log("Message5")
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
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
          console.log("Message6")
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
        this.refrechtableste()
      }
    );


    /* this.g.showLoadingBlock(true);   */
   

    
  }

 /*  chargerListServeur(){


  
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


          /*  for (let i = 0; i < this.serveursOrg.length; i++) {
              this.serveurs.push(this.serveursOrg[i]);
            }

        }else{ 
          console.log("Message7")
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
  } */

  showListeLocalite(){
    this.searchTerm="";
    this.chargerListLocalite();
($('#societe-modal') as any).modal('show')
   
  }


  showListeServeur(){
    
   // this.idnav=2
   // this.chargerListServeur();
    //($('#serveurModal') as any).modal('show');
  }


  
/*   selectLocalite(idLocalite : any){
    //alert('selectLocalite idArticle : ' + idLocalite);
    this.tableColor="box bg-megna text-center";
    let localite = this.localites.filter(x => x.Identifiant === idLocalite)[0];
    this.transfertSvc.commande.LibelleLocalite = localite.Libelle;
    this.transfertSvc.commande.IdLocalite = localite.Identifiant;
    ($('#societe-modal') as any).modal('hide');
    this.localites=[]   
  } */

/*   selectServeur(idServeur : any){
    //alert('selectS idArticle : ' + idLocalite);
    this.serveurColor="box bg-primary text-center";
    let serveur = this.serveurs.filter(x => x.Identifiant === idServeur)[0];
    this.transfertSvc.commande.NomServeur = serveur.Nom;
    this.transfertSvc.commande.IdServeur = serveur.Identifiant;
    this.idnav=1;
    //($('#serveurModal') as any).modal('hide');
    this.show('serveur')
  } */


  calculatePagesCountCom(elementPerPage : number, totalCount : number) {
    return totalCount < elementPerPage ? 1 : Math.ceil(totalCount / elementPerPage);
  }



  selectCommande(idCommande : any){
    console.log("commandeid")
    this.getCommandeById(idCommande);
    //($('#commandesNonRegleesModal') as any).modal('hide');
  }

 
  /* controler(){

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
          console.log("Message17")
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    );
  } */
 
}


import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { SocieteCode } from '../entities/LocaliteCode';
import { ChartType } from 'chart.js';
import { AffectationMessage } from '../entities/AffectationMessage';
import { CommandeSvc } from '../services/apiService/commandeSvc';
import { LocaliteSvc } from '../services/apiService/localiteSvc';
import { ReglementSvc } from '../services/apiService/reglementSvc';
import { UtilisateurSvc} from '../services/apiService/utilisateurSvc';
import { CategorieSvc} from '../services/apiService/categorieSvc';
import { ArticleSvc} from '../services/apiService/articleSvc';
import { SeanceSvc} from '../services/apiService/seanceSvc';
import { MessageSvc} from '../services/apiService/messageSvc';
import { AssociationMessageSvc } from '../services/apiService/associationMessageSvc';
import {Message}from '../entities/Message';
import { Rxjs} from '../services/apiService/rxjs';
import { LoadingtableComponent} from '../components/loadingtable/loadingtable.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-boncommande',
  templateUrl: './boncommande1.component.html',
  styleUrls: ['./boncommande.component.css']
})

export class BonCommandeComponent implements OnInit {

  //#region declarations
  public type = "";
  public percentage = 15;
  public table? : boolean | false;
  //--------------------------------------
 
  //------------------------------------
  public EtatCommandeCode : EtatCommandeCode = new EtatCommandeCode();
  public GroupeCode : GroupeCode = new GroupeCode();
  public SocieteCode:SocieteCode=new SocieteCode()
  //--------------------------------------

  //--------------------------------------
public idcatsearch:number=0;
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
  //--------------------------------------
  public commande : Commande = new Commande();
  public commandeReg : Commande = new Commande();
  //--------------------------------------
 
  //--------------------------------------
  public detailsCommandeARegles : DetailCommande[] = [];
  public quantiteARegler : number = 0;
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
  public Message=""
  //--------------------------------------
  //--------------------------------------
  //--------------------------------------
  //--------------------------------------

  //--------------------------------------
 
  //#endregion
   public societeState: boolean = false;
   public articleState: boolean = false;
   
  constructor(public route:ActivatedRoute,public rxjs:Rxjs,public g: Globals,
  private commandeSvc:CommandeSvc,private localiteSvc:LocaliteSvc,public utilisateurSvc:UtilisateurSvc,
  private categorieSvc:CategorieSvc,private articleSvc:ArticleSvc,
 ) {

  this.g.showLoadingBlock(true);
  this.route.params.subscribe(params => {
    if(params['id']!=null) {
     
       this.commandeSvc.getCommandeById(params['id']).subscribe((res:any) => {
    let etatReponse = res["EtatReponse"];
    if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
      this.commande = res["commandeVM"];
      this.numcommande=this.commande.Numero
   this.updatetotale()
  }
});
    }
      })

				//-----------------------------------------------------------------------------------------------
				this.g.showLoadingBlock(true);
				this.categorieSvc.getCategories().subscribe(
				  (res:any) => {
					let etatReponse = res["EtatReponse"];
					if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          
					  this.g.categories = res["categorieVMs"];
           
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
			
		
		
   }

  ngOnInit(): void {
    this.g.title="Bon de Commande"
    this.commande.CodeCommande="BONCOMMANDE"
    var $: any;
  	this.type="CAT";
    this.table=true;
    console.log("table "+this.g.articlesOrg);
    for(const x in this.SocieteCode){
      if(x==this.SocieteCode.FOURNISEUR){
    this.codelocalites.push(x)}
    }
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
   }, 1000);
  
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
    }, 1000);
  
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
   }, 1000);
  
  } 

  getcountcommande(){
       this.commandeSvc.getCommandesNonReglees().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
         console.log("code",etatReponse.Code)
        
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
           let commandes:Commande[]=res["commandeVMs"]
           commandes = commandes.filter(x=>x.IdCreePar==this.g.utilisateur!.Identifiant);
          }})
 
  }
  
  initcommande(){
    this.commande=new Commande();
  }



  setarticle(item:Article){
    this.article=item;
    this.tva= this.article.TauxTva;
    ($('#responsive-modal') as any).modal('hide');
  }

  setdc(item:DetailCommande){
    
    console.log(this.article)
    this.article=this.g.articlesOrg.filter(x=>x.Identifiant==item.IdArticle)[0]
    this.detailCommande=item;
    this.numlot=item.NumerodeLot;
  this.prix=  this.article.Montant;
    this.tva= this.article.TauxTva;

    ($('#responsive-modal') as any).modal('hide');
  }



  chargerArticle(event :any) {
     this.articleState=false;
     this.g.tableloading=[];
this.g.tableloading.push('Libelle','Categorie');
setTimeout(() => {
  this.articleState=true;
}, 1000);
     
    this.type="ARTICLE";
     this.articles = this.g.articlesOrg;
   if(event){
    let id:number= event.target.value   
if(id!=0){
 this.articles = this.g.articlesOrg.filter(x=>x.IdCategorie==id)
}
   }
   
    this.articles=this.articles.filter(x=>{
    return this.commande.DetailCommandes.map(function(a) {return a.IdArticle;}).indexOf(x.Identifiant) === -1;
  })
    this.refrechtable()
    //this.totalPageArt = this.calculatePagesCountArt(this.pageSizeArt,this.g.articles.length);
    //this.chargerListeArt();
  }

  showarticle(){
    this.searchTerm="";
    this.idcatsearch=0;
    ($('#responsive-modal') as any).modal('show');
    this.chargerArticle(null)
    
  }



  chargerArticlebyname() {          
     console.log('this.searchTerm')
    this.type="ARTICLE";
    this.articles = this.g.articlesOrg.filter(x => x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()));
       this.articles=this.articles.filter(x=>{
    return this.commande.DetailCommandes.map(function(a) {return a.IdArticle;}).indexOf(x.Identifiant) === -1;
  })
  }

  chargerlocalbyname(){
    this.localites=this.localitesOrg.filter(x=>x.Libelle.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }

  
  validatepush(detailCommande:DetailCommande){
    let res:boolean
  if(detailCommande.IdArticle==0){
  res= false
  this.Message="selectioner article"
  }
  else if(detailCommande.Quantite<=0){
  res=false
  this.Message="erreur de quanite saisie"
  }
  else{
    res=true
  }
  return res
  }

  selectArticle(){
      if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
       
        let detailCommande = new DetailCommande();
        detailCommande.IdArticle = this.article.Identifiant;
        detailCommande.LibelleArticle = this.article.Libelle;
        detailCommande.Quantite = Number(this.quantite);
        // detailCommande.Montant = this.article.Montant;
        detailCommande.LibelleTypeUnite=this.article.LibelleTypeUnite
        detailCommande.IdTypeUnite=this.article.IdTypeUnite
        detailCommande.Montant=this.prix
        detailCommande.TauxTVA=this.tva
      
        detailCommande.Description=this.description
        detailCommande.NumerodeLot=this.numlot

        if(this.validatepush(detailCommande)){
          this.commande.DetailCommandes.push(detailCommande);
        
          this.initdetailcommande()
          this.updatetotale()
        }
        else{
          Swal.fire({ text: this.Message , icon: 'error'});
          this.Message=""
        }
      }
  }

  updatetotale(){
    this.TotaleHT=0
    this.TotaleTVA=0
    this.commande.DetailCommandes.forEach((x:any)=>{
      this.TotaleHT+= x.Montant*x.Quantite
      this.TotaleTVA+= x.Montant*x.Quantite*x.TauxTVA/100
    })
    

  }

  initdetailcommande(){
    this.quantite=0
    this.description=''
    this.numlot=''
   
    this.prix=0
    this.tva=0
    this.article=new Article()
  }
  





  remove(index:number) {
         Swal.fire({
          title: 'Êtes-vous sûr?',
          text: "Vous ne pourrez pas revenir en arrière !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui!'
}).then((result) => {
     if(result.isConfirmed &&  this.commande.DetailCommandes.length > 0 && this.commande.DetailCommandes[index].QuantiteServi==0 &&  this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
      this.commande.DetailCommandes.splice(index, 1);
   
    }
    this.updatetotale()
})

  }

  updateTotalVal(){
    
    for(let o of this.commande.DetailCommandes){
    
      this.TotaleHT+= o.Montant*o.Quantite
      this.TotaleTVA+= o.Montant*o.Quantite*o.TauxTVA/100
    
    }
     }

  async valider(){
	  if(this.commande.CodeEtatCommande != this.EtatCommandeCode.REGLEE){
		  
		if(this.commande.Identifiant == null || this.commande.Identifiant === 0){
     // this.commande.Numero=this.numcommande
		  this.ajouterCommande();
		}else{
		  this.modifierCommande();
		}

	}
  this.getcountcommande()

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
    console.log("ok")
    this.commande.CodeCommande="BONCOMMANDE"
     // this.g.showLoadingBlock(true);
     //debugger
      this.commandeSvc.etablirCommande(this.commande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          //let idCommande = res["idCommande"];
          this.commande=new Commande()
          this.commande.CodeCommande="BONCOMMANDE"
          this.TotaleHT= 0
          this.TotaleTVA= 0
        
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
		 
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
  }



  chargerListLocalite(){
this.societeState=false;
this.g.tableloading=[];
this.g.tableloading.push('Libelle');
setTimeout(() => {
  this.societeState=true;
}, 1000);
    this.localiteSvc.getLocalites().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.localitesOrg = res["localiteVMs"];
         // console.log( this.localitesOrg[0])
          this.localitesOrg=this.localitesOrg.filter(x => x.Code === "CLIENT")
    
        
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
    //debugger
    this.societeState=false;
    this.searchTerm="";
     this.localites=[]   
    this.refrechtableste()
  
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
    let localite = this.localites.filter(x => x.Identifiant === idLocalite)[0];
    this.commande.LibelleLocalite = localite.Libelle;
    this.commande.IdLocalite = localite.Identifiant;
    ($('#societe-modal') as any).modal('hide');
    this.localites=[]   
    this.refrechtableste()
  }

  selectServeur(idServeur : any){
    //alert('selectS idArticle : ' + idLocalite);
    let serveur = this.serveurs.filter(x => x.Identifiant === idServeur)[0];
    this.commande.NomServeur = serveur.Nom;
    this.commande.IdServeur = serveur.Identifiant;
    //($('#serveurModal') as any).modal('hide');
  }

  selectCommande(idCommande : any){
    this.getCommandeById(idCommande);
    //($('#commandesNonRegleesModal') as any).modal('hide');
  }

}


import { Component,HostListener,OnInit } from '@angular/core';
import { Router,NavigationStart,NavigationEnd,NavigationError,RoutesRecognized,ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';
import { Categorie } from '../entities/Categorie';
import { Article } from '../entities/Article';
import { Commande } from '../entities/Commande';
import { Utilisateur } from '../entities/Utilisateur';
import { DetailCommande } from '../entities/DetailCommande';
import { Localite } from '../entities/Localite';
import { EtatCommandeCode } from '../entities/EtatCommandeCode';

import { GroupeCode } from '../entities/GroupeCode';
import { LocaliteCode } from '../entities/LocaliteCode';
import { ChartType, ChartOptions } from 'chart.js';
import  * as $ab from 'ng2-charts';
import { CommandeSvc } from '../services/commandeSvc';
import { LocaliteSvc } from '../services/localiteSvc';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { CategorieSvc } from '../services/categorieSvc';
import { ArticleSvc } from '../services/articleSvc';
import {Subscription} from 'rxjs'
import { Rxjs } from '../services/rxjs';
import Swal from 'sweetalert2'
//import * as $ from 'jquery';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CategoriesComponent } from '../listes/categories/categories.component';

@Component({
  selector: 'app-boncommande',
  templateUrl: './boncommande.component.html',
  styleUrls: ['./boncommande.component.css']
})
export class BonCommandeComponent implements OnInit {
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
public GroupeCode : GroupeCode = new GroupeCode();
public LocaliteCode:LocaliteCode=new LocaliteCode()
//--------------------------------------
public imageSrcCat : string =  'assets/categorie.jpg';
public imageSrcArt : string =  'assets/article.jpg';
public EtatCommandeCode : EtatCommandeCode = new EtatCommandeCode();

//--------------------------------------
public categories : Categorie[] = [];

public detailCommande:DetailCommande=new DetailCommande()
public detailCommandes:DetailCommande[]=[]
public detailCommandesOrg:DetailCommande[]=[]
//--------------------------------------
public articles : Article[] = [];
public article : Article =new Article();
public searchTerm: string = "";
//--------------------------------------
//--------------------------------------
public serveurs : Utilisateur[] = [];
public serveursOrg : Utilisateur[] = [];

public localites : Localite[] = [];
public localitesOrg : Localite[] = [];
//--------------------------------------
public commandes : Commande[] = [];
public commandesOrg : Commande[] = []

//--------------------------------------
public commande : Commande = new Commande();
public commandeReg : Commande = new Commande();
//--------------------------------------
public Message:string="";
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
public TotaleHT:number=0
public TotaleTTC:number=0
public TotaleTVA:number=0
//--------------------------------------
//--------------------------------------
//--------------------------------------

//--------------------------------------



 public isReadOnly:boolean=false;
 public pieChartLabels: any[] = [['SciFi'], ['Drama'], 'Comedy'];
  public pieChartData: any = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public backgroundcategorie:string=""
 public loadAPI!: Promise<any>;
 public  url = '../assets/node_modules/bootstrap-table/dist/bootstrap-table.min.js';
public colorMessage:string=""

  constructor(public route:ActivatedRoute,public rxjs:Rxjs, public g: Globals,private commandeSvc:CommandeSvc,
  private localiteSvc:LocaliteSvc,public utilisateurSvc:UtilisateurSvc,
  private router: Router,private categorieSvc:CategorieSvc,
  private articleSvc:ArticleSvc) {

  this.g.showLoadingBlock(true);
  this.route.params.subscribe(params => {
    if(params['id']!=null) {
     
       this.commandeSvc.getCommandeById(params['id']).subscribe((res:any) => {
    let etatReponse = res["EtatReponse"];
    if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
      this.commande = res["commandeVM"];
      this.numcommande=this.commande.Numero
   this.isReadOnly=true
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
            debugger
					  this.g.categories = res["categorieVMs"];
           
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
    this.g.title="Bon de Commande"
    this.commande.CodeCommande="BONCOMMANDE"
        var $: any;
  	this.type="CAT";
    this.table=true;
     this.loadScript()
  
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
 
  initcommande(){
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


setarticle(item:Article){
 
  this.article=item;
 // this.prix=  this.article.Montant;
  this.tva= this.article.TauxTva;
  ($('#responsive-modal') as any).modal('hide');
  }
//===================================================================


getdetailcommandes(item:Article){
 this.commandeSvc.getDetailCommandesstockparam(item.Identifiant).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
      
        
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
            
           this.detailCommandes=res["detailCommandeVMs"]
         console.log(this.detailCommandes)
          this.detailCommandes= this.detailCommandes.filter(x=>x.IdValiderPar!=null)
           this.refrechtabledc()
           //commandes = commandes.filter(x=>x.IdCreePar==this.g.utilisateur!.Identifiant);
      //this.commandeCount=commandes.length
          }})
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
    
  }
showarticle(){
  this.searchTerm="";
   ($('#responsive-modal') as any).modal('show');
   this.chargerArticle(null)
   
}
showcomercial(){
  this.searchTerm="";
   ($('#responsive-modal') as any).modal('show');
   this.chargerArticle(null)
   
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

  //====================================================================================================

  //====================================================================================================

  //====================================================================================================

  //====================================================================================================

  
 validatepush(detailCommande:DetailCommande){
   let res:boolean
if(detailCommande.IdArticle==0){
res= false
this.Message="selectioner article"
}
else if(detailCommande.Quantite==0){
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
	//	if(this.calcVal == '0'){
     // this.calcVal = '1';
   // }

   
    
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
     // this.calcVal = '0';
    this.initdetailcommande()
    this.updatetotale()
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
  

  

    scrollToBottom () {		
		setTimeout(function(){
			var mydiv = $("#montab");
			mydiv.scrollTop(mydiv.prop("scrollHeight"));
		}, 50);
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
//this.getcountcommande()

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
		 // this.updateComponentView();
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
    this.utilisateurSvc.getServeurs(null).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          this.serveursOrg = res["utilisateurVMs"];
		  if(this.serveursOrg == null){
			  this.serveursOrg = [];
		  }

         
          this.serveurs.length = 0;
          this.serveurs = [];

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
    
    this.chargerListServeur();
  }

  selectLocalite(idLocalite : any){
    this.tableColor="box bg-megna text-center";
    let localite = this.localites.filter(x => x.Identifiant === idLocalite)[0];
    this.commande.LibelleLocalite = localite.Libelle;
    this.commande.IdLocalite = localite.Identifiant;
    ($('#societe-modal') as any).modal('hide');
    this.localites=[]   
  }

  selectCommande(idCommande : any){
    this.getCommandeById(idCommande);
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


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { Article } from '../entities/Article';
import { Globals } from '../globals';
import { ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2'
import { ArticleSvc } from '../services/articleSvc';
import { DetailCommande } from '../entities/DetailCommande';
import{CommandeSvc}from '../services/commandeSvc';
import{Commande}from '../entities/Commande';
import{format} from 'date-fns'
@Component({
  selector: 'app-detailarticle',
  templateUrl: './detailarticle.component.html',
  styleUrls: ['./detailarticle.component.css']
})
export class DetailarticleComponent implements OnInit {
  public id:number=0
  sub: any;
  public detailCommande:DetailCommande=new DetailCommande()
public detailCommandes:DetailCommande[]=[]
public detailCommandesOrg:DetailCommande[]=[]
public inventaire:number=0;
public purcentinventaire:number=0;

public commande:number=0;
public purcentcommande:number=0;

public maxpurcent:number=0;

public typecommande:string="VENT"
public commandes : Commande[]|any = [];
public commandesOrg : Commande[] = [];
public quantiteexpiration:number=0;
public dateexpiration:any;
public purcentexpirer:number=0;
public datedebut:string=format(new Date(),'yyyy-MM-dd')+"T00:00:00";

public datefin:string=format(new Date(),'yyyy-MM-dd')+"T23:59:59";

  public Article:Article=new Article();
  constructor(public CommandeSvc:CommandeSvc,public router:Router, 
    public route:ActivatedRoute,private commandeSvc:CommandeSvc,private http: HttpClient,private g:Globals,private articleSvc:ArticleSvc) {
   }

  ngOnInit(): void {
    let x=1;
    this.g.showLoadingBlock(true);
    this.articleSvc.getArticles().subscribe(
    (res:any) => {
      let etatReponse = res["EtatReponse"];
      if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
      this.g.articlesOrg = res["articleVMs"];
      for(let a of this.g.articlesOrg){
          a.PathImage = this.g.baseUrl + '/api/Article/showImageArticle?identifiant=' + a.Identifiant;
        }
        this.sub = this.route.params.subscribe(params => {
          //this.g.showLoadingBlock(true)
             if(params['id']!=null && params['id']!=0) {
               this.Article=this.g.articlesOrg.filter(x=>x.Identifiant==params['id'])[0]
this.CommandeSvc.getDetailCommandesstockparam(params['id']).subscribe((res:any) => {
 let etatReponse = res["EtatReponse"];
      if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
         this.detailCommandes=res["detailCommandeVMs"]
               this.detailCommandes= this.detailCommandes.filter(x=>x.IdValiderPar!=null)

               this.detailCommandes.sort(function (a:any, b:any) {
                return new Date(a.DateExpiration).getTime() - new Date(b.DateExpiration).getTime();
              } );

var dtc:DetailCommande[]=this.detailCommandes.filter(x=>{
  return(new Date(x.DateExpiration).getTime()<=new Date(this.detailCommandes[0].DateExpiration).getTime())
}) 
console.log("dtc=",dtc)
this.quantiteexpiration=dtc.reduce((sum, current) => sum + current.Quantite, 0)-dtc.reduce((sum, current) => sum + current.QuantiteServi, 0)
this.dateexpiration=this.detailCommandes[0].DateExpiration


           
               this.inventaire=this.detailCommandes.reduce((sum, current) => sum + current.Quantite, 0)-this.detailCommandes.reduce((sum, current) => sum + current.QuantiteServi, 0)
this.maxpurcent=this.Article.QuantiteMin>0?this.Article.QuantiteMin*10:this.inventaire

this.purcentinventaire= (this.inventaire*100/this.maxpurcent)|0
this.purcentinventaire = Math.min(100, Math.max(0, this.purcentinventaire));

this.purcentexpirer= (this.quantiteexpiration*100/this.maxpurcent)|0
this.purcentexpirer = Math.min(100, Math.max(0, this.purcentexpirer));
//console.log("max=",Math.max(0, this.purcentinventaire))
this.chargerCommandeControle()
this.chargerCommandes()
              }
})


             //  this.Article.PathImage = this.g.baseUrl + '/api/Categorie/showImageCategorie?identifiant=' + params['id'];
             }
             else{
               
               this.id=0
             }})

      }else{
      Swal.fire({ text: etatReponse.Message , icon: 'error'});
      }
      this.g.showLoadingBlock(false);    
    }
    );



  }
 
  async chargerCommandes(){
    var datedebut:string=format(this.addMonths(new Date(), -3),'yyyy-MM-dd')+"T00:00:00";
    console.log(datedebut)
    // this.g.showLoadingBlock(true);  
      this.commandeSvc.getMouvement(datedebut,this.datefin).subscribe(
         (res:any) => {
          let etatReponse = res["EtatReponse"];
          if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
          
            this.commandesOrg=res["commandeVMs"];
            this.commandes=res["commandeVMs"];
            console.log('res==',this.commandesOrg)
          //  this.refrechtable()
          }else{ 
            Swal.fire({ text: "commandeseance" , icon: 'error'});
          }
          this.g.showLoadingBlock(false);    
        }
      );
     
    }
     addMonths(date:Date, months:number) {
      date.setMonth(date.getMonth() + months);
      return date;
    }
  async chargerCommandeControle(){

    //this.g.showLoadingBlock(true);  
 
    this.CommandeSvc.getCommandesNonControle().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        // console.log(etatReponse.Code)
        
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
             // this.type="CONTROLE";

          this.commandesOrg = res["commandeVMs"];
         

          this.commandes.length = 0;
          this.commandes = [];
          let detailcommandecontrole:DetailCommande[]=[];
          
          this.commandesOrg.filter(x=>{
x.DetailCommandes.find(y=>y.IdArticle==this.Article.Identifiant)
          })
          detailcommandecontrole.length=0
            for (let i = 0; i < this.commandesOrg.length; i++) {
              if(this.commandesOrg[i].CodeCommande==this.typecommande){
                this.commandes.push(this.commandesOrg[i]);
               var x=this.commandesOrg[i].DetailCommandes.filter(x=>x.IdArticle==this.Article.Identifiant)[0]
               if(x!=null){
                  detailcommandecontrole.push(x)
               }
               
              }
            
            }
            this.commande=detailcommandecontrole.reduce((sum, current) => sum + current.Quantite, 0)-this.detailCommandes.reduce((sum, current) => sum + current.QuantiteServi, 0)

              // this.commande=detailcommandecontrole[1].Quantite

              this.purcentcommande= (this.commande*100/this.maxpurcent)|0
              this.purcentcommande = Math.min(100, Math.max(0, this.purcentcommande));
            
          
         //   this.refrechtable()
           // this.g.typecommande="COMMANDENONCONTROLER"
//console.log(this.commandes)
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );

    
  }
  async chargerCommandeexpirer(){

    //this.g.showLoadingBlock(true);  
 
    this.CommandeSvc.getCommandesNonControle().subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        // console.log(etatReponse.Code)
        
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
             // this.type="CONTROLE";

          this.commandesOrg = res["commandeVMs"];
         

          this.commandes.length = 0;
          this.commandes = [];
          let detailcommandecontrole:DetailCommande[]=[];
          
          this.commandesOrg.filter(x=>{
x.DetailCommandes.find(y=>y.IdArticle==this.Article.Identifiant)
          })
          detailcommandecontrole.length=0
            for (let i = 0; i < this.commandesOrg.length; i++) {
              if(this.commandesOrg[i].CodeCommande==this.typecommande){
                this.commandes.push(this.commandesOrg[i]);
               var x=this.commandesOrg[i].DetailCommandes.filter(x=>x.IdArticle==this.Article.Identifiant)[0]
               if(x!=null){
                  detailcommandecontrole.push(x)
               }
               
              }
            
            }
            this.commande=detailcommandecontrole.reduce((sum, current) => sum + current.Quantite, 0)-this.detailCommandes.reduce((sum, current) => sum + current.QuantiteServi, 0)

              // this.commande=detailcommandecontrole[1].Quantite

              this.purcentcommande= (this.commande*100/this.maxpurcent)|0
              this.purcentcommande = Math.min(100, Math.max(0, this.purcentcommande));
            
          
         //   this.refrechtable()
           // this.g.typecommande="COMMANDENONCONTROLER"
//console.log(this.commandes)
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );

    
  }

}

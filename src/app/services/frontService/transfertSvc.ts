import { Commande } from "src/app/entities/Commande";
import{DetailCommande}from "src/app/entities/DetailCommande";
import { CommandeSvc } from "../apiService/commandeSvc";
import { Globals } from "src/app/globals";
import { Article } from "src/app/entities/Article";
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TransfertSvc {
  public commandeOregine:Commande=new Commande;
   public commandeOreginefiltre:Commande=new Commande;
  public commande:Commande=new Commande;
  public lstdetailcommandegive:DetailCommande[]=[]
  public detailcommandegive:DetailCommande=new DetailCommande
 public commandegive:Commande=new Commande;
 
   constructor(private commandeSvc:CommandeSvc,public g:Globals) 
 { 
this.initservice()
 }
  ngOnInit(): void {
    this.initservice()
  }
initservice(){
    this.commandeOregine=new Commande;
   this.commandeOreginefiltre=new Commande;
  this.commande=new Commande;
  this.lstdetailcommandegive=[]
  this.detailcommandegive=new DetailCommande
 this.commandegive=new Commande;
}
    public setCommandeOregine(IdCommande:number){
     
       //this.commandeOregine = new Commande();
    //this.g.showLoadingBlock(true);  
    this.commandeSvc.getCommandeById(IdCommande).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
                  this.commandeOregine = res["commandeVM"];
                  this.commandeOreginefiltre=res["commandeVM"];
                  this.commande.IdLocalite=this.commandeOregine.IdLocalite;
                  this.commande.IdSource=this.commandeOregine.Identifiant;
                  this.commande.LibelleLocalite=this.commandeOregine.LibelleLocalite;
        }
      }
    );
     //return this.commandeOregine
    }

filterCommandeOregine(){


//console.log("items=",items)
  if(this.commandeOreginefiltre.DetailCommandes!=[]  ){
    this.commandeOregine=JSON.parse(JSON.stringify( this.commandeOreginefiltre))

     this.commandeOregine.DetailCommandes.forEach((element:DetailCommande) => {
    //debugger
   element.QuantiteServi = this.commande.DetailCommandes.filter(item => item.IdArticle == element.IdArticle)
                        .reduce((sum, current) => sum + current.Quantite, 0);
  });



     this.commandeOregine.DetailCommandes= this.commandeOregine.DetailCommandes.filter((x:DetailCommande)=>x.Quantite>x.QuantiteServi)
  }
  console.log( this.commandeOreginefiltre)
}

    updateQuantiteOregine(detailCommandeOregine:DetailCommande,quantite:number){
      detailCommandeOregine.QuantiteServi+=quantite;
      return detailCommandeOregine;
    }
    




}
import { Globals } from '../globals';
import { Injectable } from '@angular/core';
import { Utilisateur } from '../entities/Utilisateur';
import { Article } from '../entities/Article';
import { Categorie } from '../entities/Categorie';
import { ArticleSvc } from '../services/articleSvc';
import Swal from 'sweetalert2';
import { JsonFormData } from '../components/json-form/json-form.component';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { GroupeSvc } from '../services/groupeSvc';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CategorieSvc } from '../services/categorieSvc';
import { Caisse } from '../entities/Caisse';
import { CaisseSvc } from '../services/caisseSvc';
import{GroupeCode}from '../entities/GroupeCode'; 
import { HttpClient } from '@angular/common/http';
@Injectable()
export class Objettoupdate{
    public sub:any
    public id:number|any
    public utilisateur:Utilisateur|any
    public GroupeCode : GroupeCode = new GroupeCode();
public groupe :any= {
        "name": "Groupe",
      "label": "Groupe:",
      "value": "",
      "type": "select",
      "option":[],
      "validators": {"required": true,
        }
    };
  constructor(private http: HttpClient,public CaisseSvc:CaisseSvc,public CategorieSvc:CategorieSvc,public ArticleSvc:ArticleSvc,public GroupeSvc:GroupeSvc,public route:ActivatedRoute,private g: Globals,public utilisateurSvc:UtilisateurSvc) {
  this.sub = this.route.params.subscribe(params => {
      if(params['id']!=null) {
        this.id=params['id']}
        })
  
      }

  _objettoupdate(): Observable<string>{


     var subject = new Subject<string>();
switch (this.g.typeform) {
    case 'utilisateur':
      
       this.utilisateurSvc.getListeUtilisateurs().subscribe(
       (res:any) => {
        let etatReponse = res["EtatReponse"];

        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
             // console.log("resultat==",res["utilisateurVMs"])

          let utilisateurs:Utilisateur[] = res["utilisateurVMs"];
        let objet:Utilisateur=utilisateurs.filter(x => x.Identifiant==this.id)[0]
      

            subject.next (JSON.stringify(objet)) 
          
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
        break;

       case 'article':
       this.ArticleSvc.getArticles().subscribe(
       (res:any) => {
        let etatReponse = res["EtatReponse"];

        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
             // console.log("resultat==",res["utilisateurVMs"])

        let articles:Article[] = res["articleVMs"];
        let objet:Article=articles.filter(x => x.Identifiant==this.id)[0]

        subject.next (JSON.stringify(objet)) 
          
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
        break;
       case 'categorie':
       this.CategorieSvc.getCategories().subscribe(
       (res:any) => {
        let etatReponse = res["EtatReponse"];

        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
             // console.log("resultat==",res["utilisateurVMs"])

        let categories:Categorie [] = res["categorieVMs"];
        let objet:Categorie=categories.filter(x => x.Identifiant==this.id)[0]

        subject.next (JSON.stringify(objet)) 
          
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
        break;

                    case 'caisse':
       this.CaisseSvc.getCaisse().subscribe(
       (res:any) => {
        let etatReponse = res["EtatReponse"];

        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
             // console.log("resultat==",res["utilisateurVMs"])

        let Caisses:Caisse [] = res["caisseVMs"];
        let objet:Caisse=Caisses.filter(x => x.Identifiant==this.id)[0]

        subject.next (JSON.stringify(objet)) 
          
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
        break;
      }
 

    return subject.asObservable();
}

 getGroupe():Observable<string>{

  var groupestring = new Subject<string>();
  let groupe:any= {
        "name": "Groupe",
      "label": "Groupe:",
      "value": "",
      "type": "select",
      "option":[],
      "validators": {"required": true,
        }
    }
  groupestring.next(JSON.stringify(groupe))
 this.GroupeSvc.getListeGroupes().subscribe(
		   (res:any) => {
			let etatReponse = res["EtatReponse"];
			if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			   let resultat=res["groupeVMs"];
         resultat.forEach( (element: any) => {
            groupe.option.push({"text":element.Code,"value":element.Code,"selected":false})
         });
      }
      groupestring.next(JSON.stringify(groupe))
      }
     
      ) 
     
        //return this.groupe;
        return groupestring.asObservable();
}

 getCategorie():Observable<string>{

  var groupestring = new Subject<string>();
  let categorie:any= {
        "name": "IdCategorie",
      "label": "Categorie:",
      "value": "",
      "type": "select",
      "option":[],
      "validators": {"required": true,
        }
    }
  

        this.CategorieSvc.getCategories().subscribe(
		   (res:any) => {
			let etatReponse = res["EtatReponse"];
			if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			   let resultat=res["categorieVMs"];
         resultat.forEach( (element: any) => {
            categorie.option.push({"text":element.Libelle,"value":element.Identifiant,"selected":false})
         });
      }
      groupestring.next(JSON.stringify(categorie))
      }
     
      )
     
        //return this.groupe;
        return groupestring.asObservable();
}

rechargerutilisateurformdata(formData: JsonFormData|any):Observable<string>{
  var form = new Subject<string>();
   this.getGroupe().subscribe((res)=>{
     let groupe=JSON.parse(res);
  
     formData.controls.push(groupe)
         this._objettoupdate().subscribe(
      (res:Utilisateur|any)=>{

      let objet=JSON.parse(res)
  formData.controls.forEach((control:any) => {
    console.log(objet)
switch (control.name) {
    case 'Nom':
        control.value=objet!=undefined? objet.Nom:""
        break;
    case 'Prenom':
        control.value=objet!=undefined?objet.Prenom:""
        break;
  case 'login':
          control.value=objet!=undefined?objet.Login:""
        break;
        
         case 'Groupe':
          
          control.value=objet.CodesGroupes!=undefined?objet.CodesGroupes[0]:""
        break;  
}
})
    form.next(JSON.stringify(formData.controls)) 
         
  

//console.log("test string",string)

    })
   })
 
 
  

return form.asObservable();

}


rechargerarticleformdata(formData: JsonFormData|any):Observable<string>{
  var form = new Subject<string>();
    this.getCategorie().subscribe((res)=>{
     let groupe=JSON.parse(res);
  
     formData.controls.push(groupe)
        this._objettoupdate().subscribe(
      (res:Article|any)=>{

      let objet=JSON.parse(res)
     // console.log(objet)
  formData.controls.forEach((control:any) => {
//console.log("controle===",objet)

switch (control.name) {

    case 'Libelle':
        control.value=objet!=undefined? objet.Libelle:""
        break;

    case 'Montant':
        control.value=objet!=undefined?objet.Montant:""
        break; 

        case 'IdCategorie':
          control.value=objet!=undefined?objet.IdCategorie:""
          // console.log("Groupe===")
        break; 
}
})
    form.next(JSON.stringify(formData.controls)) 
         
  

//console.log("test string",string)

    })
   }) 
 
 
   

return form.asObservable();

}

rechargercaisseformdata(formData: JsonFormData|any):Observable<string>{
 var form = new Subject<string>();
    
        this._objettoupdate().subscribe(
      (res:Caisse|any)=>{

      let objet=JSON.parse(res)
  formData.controls.forEach((control:any) => {
switch (control.name) {
    case 'Libelle':
        control.value=objet!=undefined? objet.Libelle:""
        break;
        
}
})
    form.next(JSON.stringify(formData.controls)) 
  })
return form.asObservable();

}
rechargercategorieformdata(formData: JsonFormData|any):Observable<string>{
  
  var form = new Subject<string>();
    
        this._objettoupdate().subscribe(
      (res:Categorie|any)=>{ 
       
let objet =JSON.parse(res)
        
      
     // console.log(objet)
     
  formData.controls.forEach((control:any) => {
   

//console.log("controle===",objet)

switch (control.name) {

    case 'Libelle':
        control.value=objet!=undefined? objet.Libelle:""
        break;
}
})
  console.log("ok==",formData.controls)
    form.next(JSON.stringify(formData.controls)) 
  })
   
return form.asObservable();

}
async getutilisateur(forms: FormGroup|any){
let util:Utilisateur={
    Nom:forms.value.Nom,
    Prenom:forms.value.Prenom,
  CodesGroupes:[forms.value.Groupe],
Identifiant:this.id,
Login:forms.value.login,
EnActivite:true,
  }

    return util
}

async getarticle(forms: FormGroup|any){
let article:Article={
    Libelle:forms.value.Libelle,
    Montant:forms.value.Montant,
  IdCategorie:forms.value.IdCategorie,
Identifiant:this.id,
EnActivite:true,
Libellecategorie:'',
 }

    return article
}
async getcategorie(forms: FormGroup|any){
let categorie:Categorie={
    Libelle:forms.value.Libelle,
Identifiant:this.id,
Code:'',
EnActivite:true,
  }

    return categorie
}
async getcaisse(forms: FormGroup|any){
let caisse:Caisse={
    Libelle:forms.value.Libelle,
Identifiant:this.id,

  }

    return caisse
}

}
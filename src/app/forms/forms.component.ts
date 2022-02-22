import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { JsonFormData } from '../components/json-form/json-form.component';
import { GroupeSvc } from '../services/groupeSvc';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { Utilisateur } from '../entities/Utilisateur';
import {Login} from '../entities/Login';
import { Rxjs } from '../services/rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2';
import { Observable, Subject, Subscription } from 'rxjs';
import { Objettoupdate } from './objettoupdate';
import { ArticleSvc } from '../services/articleSvc';
import { CategorieSvc } from '../services/categorieSvc';
import { CaisseSvc } from '../services/caisseSvc';
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
public formData: JsonFormData |any;
public resultat:any
public utilisateur : Utilisateur|any
private obj: Array<string>=[];
public utilisateurOrg : Utilisateur[] = [];
public form:string="utilisateur"
public url:string=""
public title:string=""
public id:number=0
public login:Login|any
public logins:Login[]=[]


    
  sub: any;

  constructor(public CaisseSvc:CaisseSvc,public CategorieSvc:CategorieSvc,public articleSvc:ArticleSvc,public objettoupdat:Objettoupdate, public route:ActivatedRoute,public GroupeSvc:GroupeSvc,private http: HttpClient,private g:Globals,public utilisateurSvc:UtilisateurSvc,public rxjs:Rxjs) { 
    
  if(this.g.typeform=="utilisateur"){ 
    this.url='/assets/utilisateur-form.json'
 this.title="Forms->Utilisateur"

}
  if(this.g.typeform=="article"){ 
    this.url='/assets/article-form.json'
 this.title="Forms->Article"

}
  if(this.g.typeform=="categorie"){ 
    this.url='/assets/categorie-form.json'
 this.title="Forms->Categorie"

}
 if(this.g.typeform=="caisse"){ 
    this.url='/assets/caisse-form.json'
 this.title="Forms->Caisse"

}
  }

 

 async  ngOnInit() {
  
this.sub = this.route.params.subscribe(params => {

   this.g.showLoadingBlock(true)
      if(params['id']!=null) {
        this.objettoupdat.id=params['id']}
      else{
        this.objettoupdat.id=undefined
      }})

 setTimeout(() => {

    this.http
      .get(this.url)
      .subscribe((formData: JsonFormData|any) => {

if(this.g.typeform=="utilisateur"){
  //console.log("sub==", this.sub)
       
          this.objettoupdat.rechargerutilisateurformdata(formData).subscribe((form:any)=>{
            // console.log("test01===",form)
            formData.controls=JSON.parse(form)
   
  //console.log("formData",formData.controls)
          })
    

    setTimeout(()=>{
      this.formData = formData
       this.g.showLoadingBlock(false);
    },300)
}

if(this.g.typeform=="article"){
  //console.log("sub==", this.sub)
       
          this.objettoupdat.rechargerarticleformdata(formData).subscribe((form:any)=>{
            // console.log("test01===",form)
            formData.controls=JSON.parse(form)
   
  //console.log("formData",formData.controls)
          })
    

    setTimeout(()=>{
      this.formData = formData
       this.g.showLoadingBlock(false);
    },300)
}

if(this.g.typeform=="categorie"){
  //console.log("sub==", this.sub)
       
          this.objettoupdat.rechargercategorieformdata(formData).subscribe((form:any)=>{
            // console.log("test01===",form)
            formData.controls=JSON.parse(form)
   
  //console.log("formData",formData.controls)
          })
    

    setTimeout(()=>{
      this.formData = formData
       this.g.showLoadingBlock(false);
    },300)
}
if(this.g.typeform=="caisse"){
  //console.log("sub==", this.sub)
       
          this.objettoupdat.rechargercaisseformdata(formData).subscribe((form:any)=>{
            // console.log("test01===",form)
            formData.controls=JSON.parse(form)
   
  //console.log("formData",formData.controls)
          })
    

    setTimeout(()=>{
      this.formData = formData
       this.g.showLoadingBlock(false);
    },300)
}
      });
 }, 200);
 
 
      
  }



  submit(forms: FormGroup|any){

   		if(this.objettoupdat.id == undefined || this.objettoupdat.id === 0){
         if(this.g.typeform=="utilisateur"){
this.ajouterUtilisateur(forms);
         }
		   if(this.g.typeform=="article"){
this.ajouterArticle(forms);
         }
         if(this.g.typeform=="categorie"){
this.ajouterCategorie(forms);
         } 
          if(this.g.typeform=="caisse"){
this.ajouterCaisse(forms);
         } 
		}
    
    
    else{
       if(this.g.typeform=="utilisateur"){
this.modifierUtilisateur(forms);
         }
		   if(this.g.typeform=="article"){
this.modifierArticle(forms);
         }
		  if(this.g.typeform=="categorie"){
        this.modifierCategorie(forms)
      }
      if(this.g.typeform=="caisse"){
        this.modifierCaisse(forms)
      }
		}

  }

  ajouterUtilisateur(forms:FormGroup|any){
this.objettoupdat.getutilisateur(forms).then((result)=>{
    this.g.showLoadingBlock(true);
      this.utilisateurSvc.addUtilisateur(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }

    ajouterArticle(forms:FormGroup|any){
this.objettoupdat.getarticle(forms).then((result)=>{
    this.g.showLoadingBlock(true);
      this.articleSvc.addArticle(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }
    
    ajouterCategorie(forms:FormGroup|any){
this.objettoupdat.getcategorie(forms).then((result)=>{
    this.g.showLoadingBlock(true);
      this.CategorieSvc.addCategorie(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }

      ajouterCaisse(forms:FormGroup|any){
this.objettoupdat.getcaisse(forms).then((result)=>{
    this.g.showLoadingBlock(true);
      this.CaisseSvc.addCaisse(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }

    modifierUtilisateur(forms:FormGroup|any){
      //console.log('forms',forms)
this.objettoupdat.getutilisateur(forms).then((result)=>{
  //console.log("resltat",result)
    this.g.showLoadingBlock(true);
      this.utilisateurSvc.updatUtilisateur(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }

     modifierArticle(forms:FormGroup|any){
      //console.log('forms',forms)
this.objettoupdat.getarticle(forms).then((result)=>{
  //console.log("resltat",result)
    this.g.showLoadingBlock(true);
      this.articleSvc.updateArticle(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }
     modifierCategorie(forms:FormGroup|any){
      //console.log('forms',forms)
this.objettoupdat.getcategorie(forms).then((result)=>{
  //console.log("resltat",result)
    this.g.showLoadingBlock(true);
      this.CategorieSvc.updateCategories(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }
  modifierCaisse(forms:FormGroup|any){
      //console.log('forms',forms)
this.objettoupdat.getcaisse(forms).then((result)=>{
  //console.log("resltat",result)
    this.g.showLoadingBlock(true);
      this.CaisseSvc.updateCaisse(result).subscribe(
      (res:any) => {
        let etatReponse = res["EtatReponse"];
        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
        //console.log("Succes")
          Swal.fire({ text: etatReponse.Message , icon: 'success'});
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        this.g.showLoadingBlock(false);    
      }
    ); 

})
  }
}

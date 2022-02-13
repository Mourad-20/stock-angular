import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { JsonFormData } from '../components/json-form/json-form.component';
import { GroupeSvc } from '../services/groupeSvc';
import { UtilisateurSvc } from '../services/utilisateurSvc';
import { Utilisateur } from '../entities/Utilisateur';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
public formData: JsonFormData |any;
public resultat:any
public serveurs : Utilisateur[] = [];
public serveursOrg : Utilisateur[] = [];
public form:string="utilisateur"
public url:string=""
public title:string=""
public groupe :any= {
        "name": "Groupe",
      "label": "Groupe:",
      "value": "",
      "type": "select",
      "option":[],
      "validators": {"required": true,
        }
    };

  constructor(public GroupeSvc:GroupeSvc,private http: HttpClient,private g:Globals,public utilisateurSvc:UtilisateurSvc) { 
  if(this.form=="utilisateur")
 this.url='/assets/utilisateur-form.json'
 this.title="Forms->Utilisateur"
  }
async getGroupe(){
  
  this.GroupeSvc.getAllGroupe().subscribe(
		   (res:any) => {
			let etatReponse = res["EtatReponse"];
			if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
			   this.resultat=res["groupeVMs"];
         this.resultat.forEach( (element: any) => {
            this.groupe.option.push({"text":element.Code})
         });
        //this.groupe.option.push({"value":});
      }
      return this.groupe;
      })
      console.log("grp==",this.groupe)
        return this.groupe;
}
 async  ngOnInit() {
  
   this.http
      .get(this.url)
      .subscribe((formData: JsonFormData|any) => {

        if(this.form=="utilisateur"){this.getGroupe().then(
         res=>formData.controls.push(res),
  )}

    setTimeout(()=>{
      this.formData = formData
    },1000)
      });
      await  this.g.showLoadingBlock(false);
  }

  submit(forms: FormGroup|any){
    console.log("forms recu",forms)
  }
    
}

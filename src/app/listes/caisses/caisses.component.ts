import { Component, OnInit } from '@angular/core';
import { Router,NavigationStart,NavigationEnd,NavigationError,RoutesRecognized } from '@angular/router';
import { Globals } from '../../globals';
import { Article } from 'src/app/entities/Article';
import { Caisse } from 'src/app/entities/Caisse';
import { ArticleSvc } from 'src/app/services/articleSvc';
import { CaisseSvc } from 'src/app/services/caisseSvc';

import {Subscription} from 'rxjs'
import { Rxjs } from '../../services/rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-caisses',
  templateUrl: './caisses.component.html',
  styleUrls: ['./caisses.component.css']
})
export class CaissesComponent implements OnInit {
public caisses : Caisse[] = [];
public caissesOrg : Caisse[] = [];
  constructor(public CaisseSvc:CaisseSvc,public sharedService:Rxjs, public g: Globals,public articleSvc:ArticleSvc,private router: Router) { }

  ngOnInit(): void {

    this.chargerCaisse()
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
 }, 100);

} 

async update(_caisse:Caisse|any,param:string|any){
  await this.g.setparam(_caisse.Identifiant,_caisse.Libelle,param)
  //this.g.settype("caisse")
 this.router.navigate(['/caisseparam']);}


async chargerCaisse(){

   //this.g.showLoadingBlock(true);  
   await this.CaisseSvc.getCaisse().subscribe(
       (res:any) => {
        let etatReponse = res["EtatReponse"];

        if(etatReponse.Code == this.g.EtatReponseCode.SUCCESS) {
              console.log("resultat==",res["caisseVMs"])

          this.caisses = res["caisseVMs"];
          this.caissesOrg=res["caisseVMs"];
           this.refrechtable()

         
        }else{ 
          Swal.fire({ text: etatReponse.Message , icon: 'error'});
        }
        //this.g.showLoadingBlock(false);    
      }
    );
   return this.caisses
  }
}

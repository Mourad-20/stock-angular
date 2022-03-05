import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms'; 
import { BrowserModule } from '@angular/platform-browser';
import { CookieService  } from 'ngx-cookie-service';
import { Router,NavigationStart,NavigationEnd,NavigationError,RoutesRecognized } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { RequestInterceptor } from './interceptors/requestInterceptor';
import {DataTablesModule} from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Globals } from './globals';

import { LoginComponent } from './authentification/login.component';
import { LoginMobileComponent } from './authentification/loginMobile.component';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './home/header.component';
import { LeftsidebareComponent } from './home/leftsidebare.component';
import { CaisseComponent } from './home/caisse.component';
import{OuvertureSeanceComponent} from './seances/ouvertureSeance.component'
import { CaisseMobileComponent } from './home/caisseMobile.component';
import { ClotureSeanceComponent } from './home/clotureSeance.component';
import { TestComponent } from './home/test.component';
import { PercentComponent } from './rapport/percent.component';



import { UtilisateurSvc } from './services/utilisateurSvc';
import { CategorieSvc } from './services/categorieSvc';
import { ArticleSvc } from './services/articleSvc';
import { CommandeSvc } from './services/commandeSvc';
import { LocaliteSvc } from './services/localiteSvc';
import { SeanceSvc } from './services/seanceSvc';
import { ReglementSvc } from './services/reglementSvc';
import { CaisseSvc } from './services/caisseSvc';
import { EtatCommandeSvc } from './services/EtatCommandeSvc';
import { CommercialisationSvc } from './services/commercialisationSvc';
import { AffectationCaisseSvc } from './services/affectationCaisseSvc';
import { ActeurSeanceSvc } from './services/acteurSeanceSvc';
import { Objettoupdate } from './forms/objettoupdate';
import Swal from 'sweetalert2';
import { RapportComponent } from './rapport/rapport.component';
import { FormsComponent } from './forms/forms.component';
import { GroupeSvc } from './services/groupeSvc';
import { JsonFormComponent } from './components/json-form/json-form.component';
import { UtilisateursComponent } from './listes/utilisateurs/utilisateurs.component';
import { ArticlesComponent } from './listes/articles/articles.component';
import { CategoriesComponent } from './listes/categories/categories.component';
import { CaissesComponent } from './listes/caisses/caisses.component';
import { CaisseparamComponent } from './param/caisse/caisse.component';


@NgModule({
  declarations: [
    PercentComponent,
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    LeftsidebareComponent,
    CaisseComponent,
    OuvertureSeanceComponent,
    TestComponent,
	LoginMobileComponent,
	CaisseMobileComponent,
	ClotureSeanceComponent,
 RapportComponent,
 FormsComponent,
 JsonFormComponent,
 UtilisateursComponent,
 ArticlesComponent,
 CategoriesComponent,
 CaissesComponent,
CaisseparamComponent

  ],
  imports: [
    DataTablesModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }, 
    Globals,
    CookieService,
    UtilisateurSvc,
    CategorieSvc,
    ArticleSvc,
    CommandeSvc,
    LocaliteSvc,
    SeanceSvc,
    ReglementSvc,
    CaisseSvc,
    EtatCommandeSvc,
    GroupeSvc,
    Objettoupdate,
    CommercialisationSvc,
    AffectationCaisseSvc,
    ActeurSeanceSvc
    ],
  bootstrap: [AppComponent]
})
export class AppModule {



	constructor(private g: Globals,private router: Router,private utilisateurSvc:UtilisateurSvc) {
	  //alert('AppModule');
	}
	
}

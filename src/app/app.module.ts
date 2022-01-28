import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { BrowserModule } from '@angular/platform-browser';
import { CookieService  } from 'ngx-cookie-service';
import { Router,NavigationStart,NavigationEnd,NavigationError,RoutesRecognized } from '@angular/router';

import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { RequestInterceptor } from './interceptors/requestInterceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Globals } from './globals';

import { LoginComponent } from './authentification/login.component';
import { LoginMobileComponent } from './authentification/loginMobile.component';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './home/header.component';
import { LeftsidebareComponent } from './home/leftsidebare.component';
import { CaisseComponent } from './home/caisse.component';
import { OuvertureSeanceComponent } from './home/ouvertureSeance.component';
import { CaisseMobileComponent } from './home/caisseMobile.component';
import { ClotureSeanceComponent } from './home/clotureSeance.component';
import { TestComponent } from './home/test.component';




import { UtilisateurSvc } from './services/utilisateurSvc';
import { CategorieSvc } from './services/categorieSvc';
import { ArticleSvc } from './services/articleSvc';
import { CommandeSvc } from './services/commandeSvc';
import { LocaliteSvc } from './services/localiteSvc';
import { SeanceSvc } from './services/seanceSvc';
import { ReglementSvc } from './services/reglementSvc';
import { CaisseSvc } from './services/caisseSvc';

import Swal from 'sweetalert2';
import * as $AB from 'jquery';


@NgModule({
  declarations: [
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
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
    
    ],
  bootstrap: [AppComponent]
})
export class AppModule {



	constructor(private g: Globals,private router: Router,private utilisateurSvc:UtilisateurSvc) {
	  //alert('AppModule');
	}
	
}

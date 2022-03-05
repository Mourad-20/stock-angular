import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './authentification/login.component';
import { LoginMobileComponent } from './authentification/loginMobile.component';
import { LogoutComponent } from './authentification/logout.component';
import { HomeComponent } from './home/home.component';
import { CaisseComponent } from './home/caisse.component';
import { OuvertureSeanceComponent } from './seances/ouvertureSeance.component';
import { CaisseMobileComponent } from './home/caisseMobile.component';
import { ClotureSeanceComponent } from './home/clotureSeance.component';
import { RapportComponent } from './rapport/rapport.component';
import { FormsComponent } from './forms/forms.component';
import { UtilisateursComponent } from './listes/utilisateurs/utilisateurs.component';
import { ArticlesComponent } from './listes/articles/articles.component';
import { TestComponent } from './home/test.component';
import { CategoriesComponent } from './listes/categories/categories.component';
import { CaissesComponent } from './listes/caisses/caisses.component';
import { CaisseparamComponent } from './param/caisse/caisse.component';
const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'loginMobile', component: LoginMobileComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'caisse', component: CaisseComponent },
  { path: 'ouvertureSeance', component: OuvertureSeanceComponent },
  { path: 'caisseMobile', component: CaisseMobileComponent },
  { path: 'clotureSeance', component: ClotureSeanceComponent },
  { path: 'test', component: TestComponent },
  { path: 'rapport', component: RapportComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'forms/:id', component: FormsComponent },
  { path: 'liste/utilisateurs', component: UtilisateursComponent },
  { path: 'liste/articles', component: ArticlesComponent },
{ path: 'liste/categories', component: CategoriesComponent },
{ path: 'liste/caisses', component: CaissesComponent },
{ path: 'caisseparam', component: CaisseparamComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

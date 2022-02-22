import { Login } from "./Login";
export class Utilisateur {
    Identifiant: number = 0;
    Nom: string = "";
    Prenom: string = "";
	CodesGroupes : string[] = [];
    _Login:Login[]=[];
}
/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: app.routes.ts
 * Archivos relacionados:
    * ./components/login/login.component.ts
    * ./components/login/login.component.html
    * ./components/users/users.component.ts
    * ./components/users/users.component.html
    * app.module.ts (Aquí importamos globalmente este archivo.)
 * Ejecucion: Se manda como singleton a la configuración de la aplicación
 * Plataforma: Windows y OsX
 * Descripción: Programa encargado de la configuración de rutas en angular
 *  en el, tenemos los componentes a los que corresponde cada ruta.
 *
 * @author jatapiaro
 */

import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { UsersComponent} from "./components/users/users.component";

/*
* Creamos una constante para almacenar todas las rutas
* tenemos el path que seria a donde apuntaria http://proyecto/ruta
* y que compone nte va a responder a dicha ruta
*/
const APP_ROUTES : Routes = [
  { path: 'home', component: LoginComponent },
  { path: 'users', component: UsersComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

/*
* Estamos asignando a una variable el conjunto de rutas que angular tendra disponible
* y se importan en app.module.ts
*/
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

/*
* Rutas
*/
import { APP_ROUTING } from './app.routes';

/*
* Firebase
*/
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

/*
* Data tables
*/
import { DataTablesModule } from 'angular-datatables';

/*
* Componentes
*/
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';

/*
* Servicios
*/
import { UserService } from "./services/user.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    APP_ROUTING,
    BrowserModule,
    DataTablesModule,
    FormsModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

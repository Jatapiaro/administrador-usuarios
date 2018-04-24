import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    APP_ROUTING
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

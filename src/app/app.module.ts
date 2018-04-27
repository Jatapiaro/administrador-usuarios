import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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
import { SecurityService } from "./services/security.service";
import { UserService } from "./services/user.service";
import { ParametersService } from "./services/parameters.service";
import { LogService } from "./services/log.service";

/*
* Pipes
*/
import { ProfilePipe } from './pipes/profile.pipe';
import { PasswordPipe } from './pipes/password.pipe';
import { ActivityPipe } from './pipes/activity.pipe';

/*
* Electron
*/
import { NgxElectronModule } from 'ngx-electron';
import { StatusPipe } from './pipes/status.pipe';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    ProfilePipe,
    PasswordPipe,
    ActivityPipe,
    StatusPipe,
    ResetPasswordComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    APP_ROUTING,
    BrowserModule,
    DataTablesModule,
    NgxElectronModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    SecurityService,
    UserService,
    ParametersService,
    LogService,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

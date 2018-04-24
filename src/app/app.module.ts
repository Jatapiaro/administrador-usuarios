import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/*
* Rutas
*/
import { APP_ROUTING } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

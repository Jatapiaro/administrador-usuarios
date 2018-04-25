import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersComponent } from './../users/users.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public username : string;
  public password : string;

  constructor( private router : Router ) { }

  ngOnInit() {
    console.log("Init");
    /*if ( !localStorage.getItem('userSession') ) {
      localStorage.setItem('userSession', 'este wey es puto');
    } else {
      console.log(localStorage.getItem('userSession'));
    }*/
  }

  goToUsers() {
    this.router.navigate(['users']);
  }

}

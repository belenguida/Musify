import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]

})

export class AppComponent implements OnInit{
  title = 'App Test! Musify';
  public user: User;
  public newUser: User;
  public identity;
  public token;
  public errorMsg;

  constructor(
    private _userService:UserService
  ){
    this.user = new User('', '','','','','ROLE_USER','');
    this.newUser = new User('', '','','','','ROLE_USER','');
  }

  ngOnInit(){
    console.log(this.identity);
    console.log(this.token);
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

  }

  public onSubmit(){
    this.errorMsg = '';
    console.log(this.user);

    // conseguir datos del user identificado
    this._userService.signUp(this.user).subscribe(
      res =>{
        this.identity = res.user;

        if(!this.identity._id){
         alert("El usuario no está correctamente identificado");
        }

        //crear elemento en el localStorage para tener al usuario en sesión
        localStorage.setItem('identity', JSON.stringify(this.identity));

// conseguir token
        this._userService.signUp(this.user, true).subscribe(
          res =>{
            this.token = res.token;

            if(this.token.length <= 0){
             alert("Token invalido");
           }
           // crear Token
           localStorage.setItem('token', this.token);
           console.log(this.token);
           console.log(this.identity);
          },
          error =>{
              var errorMsg = <any>error;
              var body = JSON.parse(error._body);

              this.errorMsg = body.message;
              if(errorMsg != null){
                console.log(error);
              }
          }
        );
        // conseguir token para enviar a cada peticion http
      },
      error =>{
          var errorMsg = <any>error;
          var body = JSON.parse(error._body);

          this.errorMsg = body.message;
          if(errorMsg != null){
            console.log(error);
          }
      }
    );
  }

  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    console.log(this.identity);
    console.log(this.token);
  }
}

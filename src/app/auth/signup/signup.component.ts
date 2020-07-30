import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm){
    if (form.invalid){
      return;
    }

    this.authService.createUser(form.value.firstname, form.value.lastname, form.value.email, form.value.password);
  }

}

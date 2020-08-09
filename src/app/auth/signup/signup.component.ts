import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubs: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignUp(form: NgForm){
    if (form.invalid){
      return;
    }

    this.authService.createUser(form.value.firstname, form.value.lastname, form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }
}

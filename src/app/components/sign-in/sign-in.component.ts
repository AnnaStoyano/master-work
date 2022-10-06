import { Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../../app.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [ Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  get email(): FormControl { 
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl{ 
    return this.loginForm.get('password') as FormControl;
  }

  get getErrorEmailMessage(): string {
    if(this.email.hasError('email')) {
      return 'You must enter a email';
    }

    return this.email.hasError('required') ? 'You must enter a email' : '';
  }

  get getErrorUserPasswordMessage(): string {
    return this.password.hasError('required') ? 'You must enter a password' : '';
  }

  login(): void {
    this._authService.SignIn(this.email.value, this.password.value);
  }

  loginWithGoogle(): void {
    this._authService.GoogleAuth();
  }
}

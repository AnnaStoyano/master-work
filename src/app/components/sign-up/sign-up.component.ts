import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../../app.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get email(): FormControl { 
    return this.signUpForm.get('email') as FormControl;
  }

  get password(): FormControl{ 
    return this.signUpForm.get('password') as FormControl;
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

  signUp(): void {
    this._authService.SignUp(this.email.value, this.password.value);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../../app.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;

  constructor( private _authService: AuthService) { }

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  get email(): FormControl { 
    return this.resetForm.get('email') as FormControl;
  }

  get getErrorEmailMessage(): string {
    if(this.email.hasError('email')) {
      return 'You must enter a email';
    }

    return this.email.hasError('required') ? 'You must enter a email' : '';
  }

  reset(): void {
    this._authService.ForgotPassword(this.email.value);
  }
}

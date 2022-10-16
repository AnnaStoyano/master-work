import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../app.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userUid: string = ':id';
  
  private _signOut$!: Subscription;
  private _signedUserState$!: Subscription;

  constructor(private _authService: AuthService,
    private _dialog: MatDialog,
    private _router: Router) {
  }

  ngOnInit(): void {
    this._signOut$ = this._authService.subjectSignOut.asObservable()
      .subscribe((data) => {
        if (!data.isError) {
          this._router.navigate(['/sign-in']);
        } else {
          this._dialog.open(ModalComponent, { data });
        }
      });

      this._signedUserState$ = this._authService.signedUserState$()
      .subscribe((data) => {
        this.userUid = data?.uid || '';
      });
  }

  ngOnDestroy(): void {
    this._signOut$.unsubscribe();
    this._signedUserState$.unsubscribe();
  }

  signOut(): void {
    this._authService.signOut();
  }
}

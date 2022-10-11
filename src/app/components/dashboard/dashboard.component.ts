import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from "firebase/auth";
import { take, takeLast } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user!: User | null;

  constructor(private _authService: AuthService,
    private _database: DatabaseService,
    private _dialog: MatDialog,
    private _router: Router) {
  }

  ngOnInit(): void {
    this._authService.signedUserState$()
      .subscribe((user) => {
        this.user = user;
      });

    this._authService.subjectSignOut.asObservable()
    .subscribe((data) => {
      if (!data.isError) {
        this._router.navigate(['/sign-in']);
      } else {
        this._dialog.open(ModalComponent, { data });
      }
    });
  }

  getInfo() {
    if (this.user) {
      this._database.getUserData(this.user)
        .pipe(
          take(1)
        )
        .subscribe((data) => {
          console.log(data);
        });
    }
  }

  signOut() {
    this._authService.signOut();
  }

  setInfo() {
    this._database.writeUserData(this.user as User, { tasks: ['Task1', 'Task2'] });
  }

  addTask(): void {

  }

}

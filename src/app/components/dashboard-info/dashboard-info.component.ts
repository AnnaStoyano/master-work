import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from "firebase/auth";
import { mergeMap, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { ModalComponent } from '../modal/modal.component';
import { v4 as uuid } from 'uuid';
import { List } from 'src/app/app.model';

@Component({
    selector: 'app-dashboard-info',
    templateUrl: './dashboard-info.component.html',
    styleUrls: ['./dashboard-info.component.scss', '../../app.component.scss']
})
export class DashboardInfoComponent implements OnInit, OnDestroy {
    user!: User | null;
    showAddForm: boolean = false;
    newListName: FormControl = new FormControl('', [Validators.required]);
    toDoLists: List[] = [];
    listsDataJSON: { [key: string]: List } = {};

    private _signedUserState$!: Subscription;

    @ViewChild('listName', { static: false }) listNameRef?: ElementRef<HTMLElement>;

    constructor(private _authService: AuthService,
        private _database: DatabaseService,
        private _dialog: MatDialog,
        private _router: Router) {
    }

    ngOnInit(): void {
        this._signedUserState$ = this._authService.signedUserState$()
            .pipe(
                mergeMap((user) => {
                    this.user = user;
                    return this._database.getUserData(user);
                })
            )
            .subscribe((userData) => {
                if (userData) {
                    this.listsDataJSON = userData.lists || {};
                    this.toDoLists = Object.values(this.listsDataJSON);
                }
            });
    }

    ngOnDestroy(): void {
        this._signedUserState$.unsubscribe();
    }

    addList(): void {
        this.showAddForm = true;

        setTimeout(() => {
            this.listNameRef?.nativeElement.focus();
        }, 0);
    }

    getErrorMessage(): string {
        if (this.newListName.hasError('required')) {
            return 'You must enter a list name';
        }

        return '';
    }

    onCancel(): void {
        this.showAddForm = false;
        this.newListName.setValue('');
        this.newListName.markAsUntouched();
    }

    onAdd(): void {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        if (!this.newListName.value) {
            return;
        }

        const newList: List = {
            id: uuid(),
            label: this.newListName.value,
            taskCount: 0,
            createdData: dd + '.' + mm + '.' + yyyy
        };

        this.toDoLists.push(newList);
        Object.defineProperty(this.listsDataJSON, newList.id, { value: newList });

        this.showAddForm = false;
        this.newListName.setValue('');
        this.newListName.markAsUntouched();

        this._database.writeUserListData(this.user as User, newList);
    }

    onRemove(event: Event, listId: string): void {
        event.preventDefault();

        const list = this.toDoLists.find(list => list.id === listId);
        const index = list ? this.toDoLists.indexOf(list) : null;

        if (index) {
            this.toDoLists.splice(index, 1);
            this._delete(this.listsDataJSON, listId);
        }

        if (index === 0) {
            this.toDoLists.splice(index, 1);
            this.listsDataJSON = {};
        }

        this._database.updateListsData(this.user as User, this.listsDataJSON);
    }

    private _delete(obj: { [key: string]: any }, prop: string): void {
        if (obj[prop] && !obj[prop].length) {
            delete obj[prop];
        }
    }
}

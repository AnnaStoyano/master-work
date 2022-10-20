import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from "firebase/auth";
import { mergeMap, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { v4 as uuid } from 'uuid';
import { List } from 'src/app/app.model';
import { VoiceRecognitionService } from 'src/app/shared/services/voice-recognition.service';

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
    textCommand: string = '';
    listNameClasses: string[] = [];

    private _signedUserState$!: Subscription;
    private _textRecognition$!: Subscription;

    @ViewChild('listName', { static: false }) listNameRef?: ElementRef<HTMLElement>;
    @ViewChild('newListRef', { read: ElementRef }) addListRef!: ElementRef;
    @ViewChild('cancelRef', { read: ElementRef }) cancelRef!: ElementRef;
    @ViewChild('addRef', { read: ElementRef }) addRef!: ElementRef;
    @ViewChildren('listRef', { read: ElementRef }) listsRef!: QueryList<ElementRef>;
    @ViewChildren('removeListRef', { read: ElementRef }) removeListRef!: QueryList<ElementRef>;

    constructor(private _authService: AuthService,
        private _database: DatabaseService,
        private _voice: VoiceRecognitionService,
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

                    this.listNameClasses = this.toDoLists.map((list: List) => this.getNameListClass(list.label));
                }
            });

        this._textRecognition$ = this._voice.onTextChange$()
            .subscribe((command: string) => {
                this.textCommand = command.toLowerCase();

                if (this.textCommand === 'new list' || this.textCommand === 'new' || this.textCommand === 'add new list' || this.textCommand === 'ed new list' || this.textCommand === 'list' || this.textCommand.includes('create')) {
                    this.addListRef.nativeElement.click();
                }

                if (this.textCommand === 'add' || this.textCommand === 'ed') {
                    this.addRef.nativeElement.click();
                }

                if (this.textCommand === 'cancel' || this.textCommand === 'clear' || this.textCommand === 'remove') {
                    this.cancelRef.nativeElement.click();
                }

                if (this.textCommand.includes('open') || this.textCommand.includes('click')) {
                    const listName = this.textCommand.split(' ').filter((item, i) => i !== 0).join('-');
                    const lists = this.listsRef.toArray();
                    const selectedList = lists.filter(list => list.nativeElement.classList.contains(listName));

                    selectedList[0]?.nativeElement.click();
                }

                if (this.textCommand.includes('remove') || this.textCommand.includes('delete')) {
                    const listName = this.textCommand.split(' ').filter((item, i) => i !== 0).join('-');
                    const lists = this.removeListRef.toArray();
                    const selectedList = lists.filter(list => list.nativeElement.classList.contains(listName));

                    selectedList[0]?.nativeElement.click();
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
        this.listNameClasses.push(this.getNameListClass(newList.label));
        Object.defineProperty(this.listsDataJSON, newList.id, { value: newList });

        this.showAddForm = false;
        this.newListName.setValue('');
        this.newListName.markAsUntouched();

        this._database.writeUserListData(this.user as User, newList);
    }

    onRemove(event: Event, listId: string): void {
        event.preventDefault();
        event.stopPropagation();

        const list = this.toDoLists.find(list => list.id === listId);
        const index: number = list ? this.toDoLists.indexOf(list) : -1;

        if (index > -1) {
            this._delete(this.listsDataJSON, listId);
            this.toDoLists.splice(index, 1);
        }

        this._database.updateListsData(this.user as User, this.listsDataJSON);
    }

    getNameListClass(label: string): string {
        const labelWords: string[] = label.split(' ');

        return labelWords.join('-').toLowerCase();
    }

    private _delete(obj: { [key: string]: any }, prop: string): void {
        if (obj[prop]) {
           delete obj[prop];
        }
    }
}

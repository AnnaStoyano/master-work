import { Injectable } from '@angular/core';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { User } from 'firebase/auth';
import { child, getDatabase, ref, set, get, update, remove } from "firebase/database";
import { Observable, Subject } from 'rxjs';
import { List, ListTask } from 'src/app/app.model';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    userDataSubject: Subject<any> = new Subject<any>();
    userListSubject: Subject<any> = new Subject<any>();
    userAllListSubject: Subject<any> = new Subject<any>();
    userAllTasksSubject: Subject<any> = new Subject<any>();
    userListTasksSubject: Subject<any> = new Subject<any>();

    constructor() {

    }

    writeUserData(user: User): void {
        const db = getDatabase();

        set(ref(db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email
        });
    }

    writeUserListData(user: User, list: any): void {
        const db = getDatabase();

        set(ref(db, `users/${user.uid}/lists/${list.id}`), {
            taskCount: list.taskCount,
            id: list.id,
            label: list.label,
            createdData: list.createdData
        });
    }

    writeUserTaskData(user: User, task: any): void {
        const db = getDatabase();

        set(ref(db, `users/${user.uid}/tasks/${task.id}`), {
            id: task.id,
            label: task.label,
            createdData: task.createdData,
            listId: task.listId
        });
    }

    getUserData(user: User): Observable<any> {
        const dbRef = ref(getDatabase());

        if (user && user.uid) {
            get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    this.userDataSubject.next(snapshot.val());
                } else {
                    this.userDataSubject.next("No data available");
                }
            });
        }

        return this.userDataSubject.asObservable();
    }

    getAllUserList(user: User): Observable<any> {
        const dbRef = ref(getDatabase());

        if (user && user.uid) {
            get(child(dbRef, `users/${user.uid}/lists`)).then((snapshot) => {
                if (snapshot.exists()) {
                    this.userAllListSubject.next(snapshot.val());
                } else {
                    this.userAllListSubject.next(null);
                }
            });
        }

        return this.userAllListSubject.asObservable();
    }

    getAllUserTasks(user: User): Observable<any> {
        const dbRef = ref(getDatabase());

        if (user && user.uid) {
            get(child(dbRef, `users/${user.uid}/tasks`)).then((snapshot) => {
                if (snapshot.exists()) {
                    this.userAllTasksSubject.next(snapshot.val());
                } else {
                    this.userAllTasksSubject.next(null);
                }
            });
        }

        return this.userAllTasksSubject.asObservable();
    }

    getUserList(user: User, listId: string): Observable<any> {
        const dbRef = ref(getDatabase());

        if (user && user.uid) {
            get(child(dbRef, `users/${user.uid}/lists/${listId}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    this.userListSubject.next(snapshot.val());
                } else {
                    this.userListSubject.next(null);
                }
            });
        }

        return this.userListSubject.asObservable();
    }

    updateListData(user: User, listData: Partial<List>): void {
        const dbRef = ref(getDatabase());
        const updates: { [key: string]: any } = {};

        updates[`users/${user.uid}/lists/${listData.id}`] = listData;

        if (user && user.uid) {
            update(dbRef, updates);
        }
    }

    updateListsData(user: User, lists: {[key: string]: List}): void {
        const dbRef = ref(getDatabase());
        const updates: { [key: string]: any } = {};

        updates[`users/${user.uid}/lists`] = lists;

        if (user && user.uid) {
            update(dbRef, updates);
        }
    }

    updateTasksData(user: User, tasks: {[key: string]: ListTask}): void {
        const dbRef = ref(getDatabase());
        const updates: { [key: string]: any } = {};

        updates[`users/${user.uid}/tasks`] = tasks;

        if (user && user.uid) {
            update(dbRef, updates);
        }
    }
}
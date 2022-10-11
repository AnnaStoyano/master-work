import { Injectable } from '@angular/core';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { User } from 'firebase/auth';
import { child, getDatabase, ref, set, get } from "firebase/database";
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    userDataSubject: Subject<any> = new Subject<any>();

    constructor() {

    }

    writeUserData(user: User, data: any): void {
        const db = getDatabase();

        set(ref(db, 'users/' + user.uid), {
            username: user.displayName,
            email: user.email,
            tasks: data?.tasks
        });
    }

    getUserData(user: User): Observable<any> {
        const dbRef = ref(getDatabase());

        get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                this.userDataSubject.next(snapshot.val());
            } else {
                this.userDataSubject.next("No data available");
            }
        });

        return this.userDataSubject.asObservable();
    }

}
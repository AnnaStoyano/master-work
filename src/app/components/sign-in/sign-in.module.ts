import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {MatFormFieldModule} from '@angular/material/form-field';
import { SignInComponent } from "./sign-in.component";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { ModalModule } from "../modal/modal.modal";
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        ModalModule,
        MatIconModule
    ],
    declarations: [SignInComponent],
})
export class SignInModule { }
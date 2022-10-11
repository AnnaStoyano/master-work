import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {MatFormFieldModule} from '@angular/material/form-field';
import { SignUpComponent } from "./sign-up.component";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { ModalModule } from "../modal/modal.modal";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        ModalModule
    ],
    declarations: [SignUpComponent],
})
export class SignUpModule { }
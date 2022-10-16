import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardInfoComponent } from './components/dashboard-info/dashboard-info.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotFindComponent } from './components/not-find/not-find.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ToDoListComponent } from './components/todo-list/todo-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard/:id', component: DashboardComponent,
    children: [
      { path: '', component: DashboardInfoComponent},
      { path: ':id', component: DashboardInfoComponent},
      { path: 'dashboard-info/:id', component: DashboardInfoComponent },
      { path: 'list/:id', component: ToDoListComponent }
    ]
  },
  //{ path: 'list/:id', component: ToDoListComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', component: NotFindComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

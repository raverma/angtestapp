import { AuthGuard } from './auth/auth.guard';
import { PostCreateComponent } from './posts/post-create/posts-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent} from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', component: PostListComponent},
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]}, 
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}
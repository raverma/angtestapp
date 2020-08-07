import { AuthService } from './../../auth/auth.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription}  from 'rxjs';
import { PageEvent } from '@angular/material';
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
/*posts = [
    {title: "First post", content: "This is the content for First post"},
    {title: "Second post", content: "This is the content for Second post"},
    {title: "Third post", content: "This is the content for Third post"},
]*/
posts: Post[] = [];
postsSub: Subscription;
isLoading = false;
userIsAuthenticated: Boolean = false;
loggedInUserId: string;
private authListenerSubs: Subscription;
totalItems = 0;     //to hold total posts count overall
itemsPerPage = 2;
currentPage = 1;
pageSizeOptions = [1,2,5,10];
//postsServ : PostsService;   //not required if public is used before the constructor parameter
constructor(public postsService: PostsService, private authService: AuthService){
   
}

ngOnInit(){
    this.isLoading = true

    this.postsService.getPosts(this.itemsPerPage, this.currentPage);
    
    this.postsSub = this.postsService.getPostUpdatedListener().subscribe((postData: {posts: Post[], postCount: number})=> {
        this.posts = postData.posts;
        this.totalItems = postData.postCount;
        this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.loggedInUserId = this.authService.getUserId();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated)=>{
        this.userIsAuthenticated = isAuthenticated;
        this.loggedInUserId = this.authService.getUserId();
    }); 
}

onDelete(postId: string)
{
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=> {
       /* if (this.posts.length==1){
            this.currentPage = this.currentPage -1;
        } */
        this.postsService.getPosts(this.itemsPerPage, this.currentPage);
    });
}


onChangedPage(pageEventData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageEventData.pageIndex +1 ;
    this.itemsPerPage = pageEventData.pageSize;
    this.postsService.getPosts(this.itemsPerPage, this.currentPage);
}

ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
}


}
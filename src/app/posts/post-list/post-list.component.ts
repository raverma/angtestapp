import { Component, Input, OnInit } from '@angular/core';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit{
/*posts = [
    {title: "First post", content: "This is the content for First post"},
    {title: "Second post", content: "This is the content for Second post"},
    {title: "Third post", content: "This is the content for Third post"},
]*/
posts: Post[] = [];
//postsServ : PostsService;   //not required if public is used before the constructor parameter
constructor(public postsService: PostsService){
   
}

ngOnInit(){
    this.posts = this.postsService.getPosts();
}

}
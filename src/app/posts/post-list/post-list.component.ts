import { Component, Input } from '@angular/core';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Post } from '../post.model';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent{
/*posts = [
    {title: "First post", content: "This is the content for First post"},
    {title: "Second post", content: "This is the content for Second post"},
    {title: "Third post", content: "This is the content for Third post"},
]*/
@Input() posts: Post[] = [];

}
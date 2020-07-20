import { Post} from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();
 

    constructor(private http: HttpClient, private router: Router){
        
    }
    getPosts() {
        //return [...this.posts];
        this.http.get<{ message: string, posts: any}>("http://localhost:3000/api/posts")
        .pipe(map((postData)=> {
            return postData.posts.map(post => {
                return {title: post.title,
                content: post.content,
                id: post._id
                };
            });
        }))
        .subscribe((mappedPosts)=>{
            this.posts = mappedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(postId: string){
        //return {...this.posts.find(p => p.id === postId)};
        return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + postId);
    }

    addPost(post: Post, imageFile: File) {
        const postData = new FormData();
        postData.append('id', post.id);
        postData.append('title', post.title);
        postData.append('content', post.content);
        postData.append('image', imageFile, imageFile.name);
        this.http.post<{message: string, postId: string}>("http://localhost:3000/api/posts", postData)
                .subscribe(responseData=> {
                    post.id = responseData.postId;
                    console.log(responseData.message);
                    this.posts.push(post);
                    this.postsUpdated.next([...this.posts]);
                    this.router.navigate(["/"]);
                });
    }
    
    deletePost(postId: string){
        this.http.delete("http://localhost:3000/api/posts/" + postId)
        .subscribe(()=> {
            console.log(postId + " is deleted");
            this.posts = this.posts.filter(post => post.id != postId);
            this.postsUpdated.next([...this.posts]);
        });
    }

    updatePost(post: Post){
        //console.log(post);
        this.http.put("http://localhost:3000/api/posts/" + post.id, post)
            .subscribe((responseData)=> {
                console.log(responseData);
                this.router.navigate(["/"]);
            });
    }

}
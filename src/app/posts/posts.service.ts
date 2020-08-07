import { Post} from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
 

    constructor(private http: HttpClient, private router: Router){
        
    }
    getPosts(itemsPerPage: number, currentPage: number) {
        const queryString = `?pageSize=${itemsPerPage}&page=${currentPage}`;
        //return [...this.posts];
        this.http.get<{ message: string, posts: any, maxPosts: number}>("http://localhost:3000/api/posts" + queryString)
        .pipe(map((postData)=> {
            return {
                    posts: postData.posts.map(post => {
                        return {title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                        };
                    }),
                    maxPosts: postData.maxPosts
                }
        }))
        .subscribe((mappedPostsData)=>{
            this.posts = mappedPostsData.posts;
            this.postsUpdated.next({
                posts: [...this.posts], 
                postCount: mappedPostsData.maxPosts
            });
        });
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(postId: string){
        //return {...this.posts.find(p => p.id === postId)};
        return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>("http://localhost:3000/api/posts/" + postId);
    }

    addPost(post: Post, imageFile: File) {
        const postData = new FormData();
        //postData.append('id', post.id);
        postData.append('title', post.title);
        postData.append('content', post.content);
        postData.append('image', imageFile, imageFile.name);
        this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts", postData)
                .subscribe(responseData=> {
                    //post.id = responseData.post.id;
                    //post.imagePath = responseData.post.imagePath;
                    
                    //this.posts.push(post);
                    //this.postsUpdated.next([...this.posts]);
                    this.router.navigate(["/"]);
                });
    }
    
    deletePost(postId: string){
        return this.http.delete("http://localhost:3000/api/posts/" + postId);
    }

    updatePost(post: Post, imageFile: File){
        let postData: Post | FormData;
        if (imageFile === null){
            postData =  {   id: post.id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: null
            }
        } else if (typeof(imageFile)=== 'object'){
            postData = new FormData();
            postData.append("id", post.id);
            postData.append("title", post.title);
            postData.append("content", post.content);
            postData.append("image", imageFile, imageFile.name)
        }

        this.http.put("http://localhost:3000/api/posts/" + post.id, postData)
            .subscribe((responseData)=> {
                this.router.navigate(["/"]);
            });
    }

}
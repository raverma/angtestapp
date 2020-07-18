import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

//@Output()  postCreated = new EventEmitter<Post>();
    private isLoading = false;
    private mode = 'create';    //initialize with create mode as this same component is used for edit mode also
    private postId: string;
    private post: Post;
    constructor(public postsService: PostsService, public route: ActivatedRoute ){}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading=true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {id: postData._id, title: postData.title,content: postData.content};
                });
                
            }
            else{
                this.mode = 'create';
                this.postId = null;
            }
        });

    }
    onSavePost(form: NgForm) {
        if (form.invalid){
            return;
        }

        const post: Post = {id: this.postId, title: form.value.title, content: form.value.content};
        //this.postCreated.emit(post);
        this.isLoading = true;
        if (this.mode === "edit" ){
            this.postsService.updatePost(post);
        }
        else{
            this.postsService.addPost(post);
            form.resetForm();
        }
        this.isLoading = false;
    }

 
}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    imagePreview: string;
    form: FormGroup;
    constructor(public postsService: PostsService, public route: ActivatedRoute ){}

    ngOnInit(){
        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, {validators: [Validators.required]}),
            image: new FormControl(null, {validators: [Validators.required]})
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading=true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {id: postData._id, title: postData.title,content: postData.content};
                    this.form.setValue({title: this.post.title, content: this.post.content});
                });
                
            }
            else{
                this.mode = 'create';
                this.postId = null;
            }
        });

    }
    onSavePost() {
        if (this.form.invalid){
            return;
        }

        const post: Post = {id: this.postId, title: this.form.value.title, content: this.form.value.content};
        //this.postCreated.emit(post);
        this.isLoading = true;
        if (this.mode === "edit" ){
            this.postsService.updatePost(post);
        }
        else{
            this.postsService.addPost(post);
            this.form.reset();
        }
        this.isLoading = false;
    }

    onFilePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            console.log(reader.result);
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
     
    }
}
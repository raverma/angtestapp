import { Component} from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

//@Output()  postCreated = new EventEmitter<Post>();

    constructor(public postsService: PostsService){}

 
    onAddPost(form: NgForm) {
        if (form.invalid){
            return;
        }

        const post: Post = {id: null, title: form.value.title, content: form.value.content};
        //this.postCreated.emit(post);
        this.postsService.addPost(post);

        form.resetForm();
    }
}
import { Component } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
newPost = 'No content';
    private _title = '';
    public get title() {
        return this._title;
    }
    public set title(value) {
        this._title = value;
    }
    onAddPost(postInput: HTMLTextAreaElement) {
        this.newPost = postInput.value;
        
    }
}
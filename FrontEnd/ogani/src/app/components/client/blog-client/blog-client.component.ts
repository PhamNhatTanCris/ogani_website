import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/_service/blog.service';
import { TagService } from 'src/app/_service/tag.service';

@Component({
  selector: 'app-blog-client',
  templateUrl: './blog-client.component.html',
  styleUrls: ['./blog-client.component.css']
})
export class BlogClientComponent implements OnInit {

  nameTag: number = 0;
  listTag: any;
  listBlog: any;
  listBlogNewest: any;

  constructor(private tagService: TagService, private blogService: BlogService, private route: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.getListBlog();
    this.getListTag();
    this.getListNewest();
    this.nameTag = this.route.snapshot.params['id'];
    console.log(this.nameTag)

  }

  getListTag() {
    this.tagService.getListTag().subscribe({
      next: res => {
        this.listTag = res;
      }, error: err => {
        console.log(err);
      }
    })
  }

  getAllTag() {
    this.blogService.getBlogByTag(this.nameTag).subscribe({
      next: (res) => {
        this.listBlog = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getListBlog() {
    this.blogService.getList().subscribe({
      next: res => {
        this.listBlog = res;
        console.log(this.listBlog)
      }, error: err => {
        console.log(err);
      }
    })
  }

  getListNewest() {
    this.blogService.getListNewest(3).subscribe({
      next: res => {
        this.listBlogNewest = res;
      }, error: err => {
        console.log(err);
      }
    })
  }



}

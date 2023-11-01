import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { faHeart, faRetweet, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/_service/cart.service';
import { CategoryService } from 'src/app/_service/category.service';
import { ProductService } from 'src/app/_service/product.service';
import { WishlistService } from 'src/app/_service/wishlist.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [MessageService]

})
export class SearchComponent implements OnInit {


  heart = faHeart;
  bag = faShoppingBag;
  retweet = faRetweet;

  keyword: any;
  listProduct: any;
  listProductNewest: any;
  listCategory: any;
  rangeValues = [0, 100];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private messageService: MessageService,
    private wishlistService: WishlistService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Cuộn lên đầu trang khi chuyển đến trang mới
    //     window.scroll(0, 400);
    //   }
    // });
  }

  ngOnInit(): void {
    this.keyword = this.route.snapshot.params['keyword'];
    this.getListProduct();
    this.getListCategoryEnabled();
    this.getNewestProduct();
  }

  getListProduct() {
    this.productService.searchProduct(this.keyword).subscribe({
      next: res => {
        this.listProduct = res;
        console.log(this.listProduct);
      }, error: err => {
        console.log(err);
      }
    })
  }

  getListCategoryEnabled() {
    this.categoryService.getListCategoryEnabled().subscribe({
      next: res => {
        this.listCategory = res;
      }, error: err => {
        console.log(err);
      }
    })
  }

  getNewestProduct() {
    this.productService.getListProductNewest(4).subscribe({
      next: res => {
        this.listProductNewest = res;
      }, error: err => {
        console.log(err);
      }
    })
  }


  addToCart(item: any) {
    this.cartService.getItems();
    this.cartService.addToCart(item, 1);
    this.showSuccess("Thêm vào giỏ hàng thành công")
  }

  addToWishList(item: any) {
    if (!this.wishlistService.productInWishList(item)) {
      this.wishlistService.addToWishList(item);
      this.showSuccess("Thêm vào ưa thích thành công")
    }
    else {
      this.showWarn("Đã có trong mục ưa thích!")
    }
  }

  showSuccess(text: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: text });
  }
  showError(text: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: text });
  }

  showWarn(text: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: text });
  }
}

import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faHeart, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { MenuItem, MessageService } from 'primeng/api';
import { every } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { CartService } from 'src/app/_service/cart.service';
import { CategoryService } from 'src/app/_service/category.service';
import { StorageService } from 'src/app/_service/storage.service';
import { WishlistService } from 'src/app/_service/wishlist.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [MessageService]

})
export class IndexComponent implements OnInit {
  sidebarVisible: boolean = false;
  currentTime!: Date;
  listItemInCart: any[] = [];
  totalPrice = 0;
  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  userIcon = faUser;
  logoutIcon = faRightFromBracket;
  bars = faBars;


  items!: MenuItem[];
  showDepartment = false;



  loginForm: any = {
    username: null,
    password: null
  }

  registerForm: any = {
    username: null,
    email: null,
    password: null
  }

  isSuccessful = false;
  isSignUpFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];
  errorMessage = '';
  authModal: boolean = false;
  listCategoryEnabled: any;


  keyword: any;

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    private authService: AuthService,
    private storageService: StorageService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private router: Router,
    private elementRef: ElementRef) {

  }

  ngOnInit(): void {
    this.getCategoryEnbled();
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.wishlistService.loadWishList();
    this.cartService.loadCart();

    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)

    this.items = [
      {
        label: 'HOME',
        icon: 'pi pi-fw pi-home',
        command: () => this.closeSideBar(),
        routerLink: '/',

      },
      {
        label: 'SHOP',
        icon: 'pi pi-fw pi-shopping-bag',
        command: () => this.scrollToShop(),
        routerLink: '/',
      },
      {
        label: 'PAGES',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Shop Details',
            command: () => this.closeSideBar(),
            routerLink: '',
          },
          {
            label: 'Shoping Cart',
            command: () => this.closeSideBar(),
            routerLink: '/cart',
          },
          {
            label: 'Check Out',
            routerLink: '/checkout',
            command: () => this.closeSideBar(),
          },
          {
            label: 'Blog Details',
            command: () => this.closeSideBar(),
            routerLink: '',
          },
        ]
      },
      {
        label: 'BLOG',
        icon: 'pi pi-fw pi-book',
        command: () => this.closeSideBar(),
        routerLink: '/blog',
      },
      {
        label: 'CONTACT',
        icon: 'pi pi-fw pi-phone',
        routerLink: '',
        command: () => this.scrollToBottom(),

      }
    ];
  }

  showDepartmentClick() {
    this.showDepartment = !this.showDepartment;
  }

  getCategoryEnbled() {
    this.categoryService.getListCategoryEnabled().subscribe({
      next: res => {
        this.listCategoryEnabled = res;
      }, error: err => {
        console.log(err);
      }
    })
  }

  removeFromCart(item: any) {
    this.cartService.remove(item);
  }

  removeWishList(item: any) {
    this.wishlistService.remove(item);
  }

  showAuthForm() {
    if (!this.isLoggedIn) {
      this.authModal = true;
      this.loginForm = { username: null, password: null };
      this.registerForm = { username: null, email: null, password: null };
    }
  }

  login(): void {
    const { username, password } = this.loginForm;
    console.log(this.loginForm);
    this.authService.login(username, password).subscribe({

      next: res => {
        this.storageService.saveUser(res);
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.roles = this.storageService.getUser().roles;

        if (this.roles[0] == "ROLE_ADMIN" || this.roles[1] == "ROLE_ADMIN" || this.roles[2] == "ROLE_ADMIN") {
          this.showSuccess("Đăng nhập quyền admin thành công!!");
          this.router.navigate(['/admin']);
          console.log(this.roles);
        } else {
          this.showSuccess("Đăng nhập thành công!!");
          console.log(this.roles);
        }
        this.authModal = false;

      }, error: err => {
        console.log(err);
        this.isLoggedIn = false;
        this.isLoginFailed = true;
        // this.showError(err.message);
        this.showError("Nhập sai tài khoản hoặc mật khẩu!");

      }
    })
  }

  register(): void {
    const { username, email, password } = this.registerForm;
    console.log(this.registerForm);
    this.authService.register(username, email, password).subscribe({
      next: res => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.storageService.saveUser(res);
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.showSuccess("Đăng ký thành công")
        this.authModal = false;
      }, error: err => {
        this.showError(err.message);
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    })
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        this.storageService.clean();
        this.isLoggedIn = false;
        this.authModal = false;
        this.showSuccess("Bạn đã đăng xuất!!");
      }, error: err => {
        this.showError(err.message);
      }
    })
  }

  openNavMenu() {

  }

  closeSideBar() {
    this.sidebarVisible = false;
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

  scrollToBottom() {
    this.sidebarVisible = false;
    const element = this.elementRef.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  scrollToShop() {
    this.sidebarVisible = false;
    const element = this.elementRef.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollBy(0, 1000);
  }


}

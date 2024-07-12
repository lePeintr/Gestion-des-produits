import { Component, OnInit} from '@angular/core';
import {NgFor, NgIf,NgClass} from '@angular/common';
import {FormGroup, FormBuilder} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import {Product} from "../model/product.model"
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, NgClass,FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [ProductService]

})
export class ProductsComponent implements OnInit{

  products! : Array<Product>; //declare un tableau et ! = je ne veucx pas initialiser la variable à la déclaration
  currentPage : number=0;
  pageSize:number = 5;
  totalPages : number=0;
  errorMessage !: string;
   searchFormGroup! : FormGroup;
   currentAction :string ="all";

  constructor(private productService: ProductService,
               private fb: FormBuilder,
               public authService: AuthentificationService,
              private router: Router){}

  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      //on liste les inputs du formulaire
      keyword : this.fb.control(null)
    });
  //this.handleGetAllProducts();
  this.handleGetPageProducts();
  }
  handleGetPageProducts(){
    //programmation Asynchrone: j'appelle la methode getAllProducts() qui retourne un objet de type observable
     //ensuite je subscribe cet objet obsevé dès que la donnée arrive je recupère je stocke dans product.
     //Subscribe = souscrire à l'attente de retour de donnée
 
       this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
       next : (data) => {
         this.products = data.products;
         this.totalPages= data.totalPages;
       },
       error:(err)=>{
         this.errorMessage=err;
       }
       });
     }
  handleGetAllProducts(){
   //programmation Asynchrone: j'appelle la methode getAllProducts() qui retourne un objet de type observable
    //ensuite je subscribe cet objet obsevé dès que la donnée arrive je recupère je stocke dans product.
    //Subscribe = souscrire à l'attente de retour de donnée

      this.productService.getAllProducts().subscribe({
      next : (data) => {
        this.products = data;
      },
      error:(err)=>{
        this.errorMessage=err;
      }
      });
    }
  
  //Supprimer un element dans le tableau apres un click
  handleDeleteProduct(p: Product){
/*   let index = this.products.indexOf(p);
  this.products.splice(index,1); */
  let conf = confirm("Are you sure?");
  if( conf==false) return;
  this.productService.deleteProduct(p.id).subscribe({
  next: (data)=>{
    //this.handleGetAllProducts(); //ici on supprime dans le backend et on repart vers le backend pour listes tous
    // les produits de nouveau: procédure lourde

    let index = this.products.indexOf(p);
      this.products.splice(index,1); //on supprime l'element à partir de son index dans le tableau
   }
   })
  }

  public handleSetPromotion(p : Product){
    let  promo = p.promotion;
   this.productService.setPromotion(p.id).subscribe(
  {  next:(data)=>{
    //console.log("ok");
      p.promotion=!promo;
    },
    error : err=>{
      this.errorMessage=err;
    }}
   )
  }

  handleSearchProducts(){
    this.currentAction="search";
    this.currentPage=0;
      let keyword=this.searchFormGroup.value.keyword; //on recupère la valeur de keyword
      this.productService.searchProducts(keyword,this.currentPage,this.pageSize).subscribe({
        next: (data)=>{
          this.products= data.products;
          this.totalPages=data.totalPages;
        },
        error: err=>{
          this.errorMessage=err;
        }
      })
  }

  gotoPage(i:number){
    this.currentPage=i;
    if(this.currentAction==='all'){
      this.handleGetPageProducts();
      console.log('go 1')
    } 
    else{
      this.handleSearchProducts();
      console.log('go 2')
    }
      
  }

  handleNewProduct(){
     this.router.navigateByUrl("/admin/newProduct");
  }

  handleEditProduct(p: Product){
    this.router.navigateByUrl("/admin/editProduct/"+p.id);
  }
}



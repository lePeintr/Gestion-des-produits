import { Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';
import {PageProduct, Product} from "../model/product.model";
import { UUID } from 'angular2-uuid';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products! : Array<Product>; // le ! signifie que je ne veux pas initialiser la variable
  constructor() {
    this.products =  [
                      {id:"realmadrid", name : "Maillot", price : 6500, promotion:true},
                      {id:UUID.UUID(), name : "Computer", price : 6500, promotion:true},
                      {id:UUID.UUID(), name : "Printer", price : 1200, promotion:false},
                      {id:UUID.UUID(), name : "Smart phone", price : 16500, promotion:true}
                      ];
    for(let i=0;i<10;i++){
      this.products.push({id:UUID.UUID(), name : "Computer", price : 6500, promotion:true});
      this.products.push({id:UUID.UUID(), name : "Printer", price : 1200, promotion:false});
      this.products.push({id:UUID.UUID(), name : "Smart phone", price : 16500, promotion:true});
    } 
  }
 //Programation imperative ou synchrone. Car on risque bloqué l'application si la fonction prend du temps avant de retourner la reponse
 /*  public getAllProducts(){
       return this.products;
  } */

 //Programatiion reactive ou Asynchrone on retourne toujours un type observable
 //pour eviter de bloquer  l'application si la fonction prend du temps avant de retourner la reponse
  public getAllProducts() : Observable<Product[]>{
    console.log("taille"+this.products.length);
      let rnd=Math.random();
      if(rnd<0.1) return throwError(()=>new Error("Internet connexion error")) //on teste en creant une erreur
      //  else return of(this.products);
       else return of([...this.products]); // retourne la copie du tableau this.products
  }
  public getPageProducts(page: number, size: number) : Observable<PageProduct>{
    let index = page*size; //page= numero de la page, size=taille de la page (le nombre de produit affiché sur la page)
   let totalPages = ~~(this.products.length/size);// ~~ pour dire la division entière
   if(this.products.length%size != 0){
    totalPages ++;
   }
   let pageProducts =  this.products.slice(index,index+size);
   return of({page:page,size:size,totalPages:totalPages,products:pageProducts})
}


  public deleteProduct(id: string) : Observable<boolean>{
   this.products = this.products.filter(product=>product.id !=id);
    return of(true);
  }

  //chercher un produit dans la liste à partir de l'id
  public setPromotion (id: string) : Observable<boolean>{
    let product = this.products.find(p=>p.id == id);
    if(product!=undefined){
      product.promotion = !product.promotion;
      return of(true);
    }else  return throwError(()=>new Error("Product not found"))
   
  }
  


  public searchProducts(keyword: string, page: number, size: number) : Observable<PageProduct>{
       let result =  this.products.filter(p=>p.name.includes(keyword)); //on recupere uniquement les produits dont le nom contient la valeur de keyword
   let index = page*size; //page= numero de la page, size=taille de la page (le nombre de produit affiché sur la page)
   let totalPages = ~~(result.length/size);// ~~ pour dire la division entière
   if(this.products.length % size != 0)
    totalPages ++;
   let pageProducts =  result.slice(index,index+size);
    return of({page:page,size:size,totalPages:totalPages,products:pageProducts});
  }

  public addNewProduct(product: Product): Observable<Product>{
    product.id=UUID.UUID()
    this.products.push(product);
    console.log("push product");
    console.log(this.products);
    console.log("taille"+this.products.length);
    return of(product);
}

public getProduct(id : string): Observable<Product>{
  let product = this.products.find(p =>p.id == id);
    if(product == undefined){
      return throwError(()=>new Error("Product not found"));
     }  
     return of(product); 
  }

getErrorMessage(fieldName:string,error:any):string{
  if(error['required']){
    return fieldName + " is Required";
  }else if(error['minlength']){ 
    return fieldName+" should have at least "+error['minlength']['requiredLength']+" Characters";
  }else if(error['min']){ 
    return fieldName+" should have min value "+error['min']['min'];
  }else return "";
  
}

updateProduct(product : Product) : Observable<Product>{
  this.products=this.products.map(p=>(p.id==product.id)?product:p);
  return of(product);
}
}

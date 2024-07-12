import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule,CommonModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit {

  productFormGroup!: FormGroup;
  constructor(private fb:FormBuilder,public prodService:ProductService,private router: Router){}
  
  ngOnInit(): void {
  this.productFormGroup=this.fb.group({
    name : this.fb.control(null, [Validators.required,Validators.minLength(4)]),
    price : this.fb.control(null, [Validators.required,Validators.min(200)]),
    promotion : this.fb.control(false, [Validators.required]),
  });
  }

  handleAddProduct(){
   // console.log(this.productFormGroup.value);
    let product = this.productFormGroup.value; //on recupere toute les données du formulaire
    this.prodService.addNewProduct(product).subscribe({
      next:(data)=>{
          alert("Product added Successfully");
          this.productFormGroup.reset();//effacer le formulaire après l'ajout
          this.router.navigateByUrl("/admin/products")

      },error:err=>{
          console.log(err);
      }
    });
  }
 
}

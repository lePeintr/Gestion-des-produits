import { Routes } from '@angular/router';
import { ProductsComponent } from "./products/products.component";
import { CustomersComponent } from "./customers/customers.component";
import { LoginComponent } from "./login/login.component";
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { authenticationGuard } from './guards/authentication.guard';
import { NewProductComponent } from './new-product/new-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

export const routes: Routes = [

{path: "login", component: LoginComponent},
{path: "", component: LoginComponent}, //si on ne met pas de path par defaut on ouvre login component
{path: "admin", component: AdminTemplateComponent,canActivate : [authenticationGuard],
    children:[
        {path: "products", component: ProductsComponent},
        {path: "customers", component: CustomersComponent},
        {path: "newProduct", component: NewProductComponent},
        {path: "editProduct/:id", component: EditProductComponent}
    ]
}
];

import { Component, OnInit } from '@angular/core';
import { RouterOutlet,RouterModule, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-admin-template',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent implements OnInit{
//on declare public parceque je vais directement utiliser autService dans le html
  constructor(public authService: AuthentificationService,private router: Router){

  }
  ngOnInit(): void {
   
  }

  handleLogout(){
    this.authService.logout().subscribe({
      next:(data)=>{
          this.router.navigateByUrl("/login");
      }
    })
  }
}

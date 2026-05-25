import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  auth = inject(Auth);
  router = inject(Router);

  email = '';
  clave = '';
  mensaje = '';
  enviando = false;

  login() {
    if (this.enviando) return;
    
    this.enviando = true;
    this.mensaje = '';

    this.auth.login(this.email, this.clave).subscribe({
      next: (response) => {
        this.enviando = false;
        if (response.success) {
          // 🔥 AQUÍ ESTÁ EL CAMBIO: Forzamos la recarga completa en lugar del router
          window.location.href = '/'; 
        } else {
          this.mensaje = ' ' + response.message;
        }
      },
      error: (err) => {
        this.enviando = false;
        this.mensaje = ' Error al iniciar sesión';
        console.error('Error:', err);
      }
    });
  }
}
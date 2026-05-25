import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';     
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './comentarios.component.html',
  styleUrls: [] 
})
export class ComentariosComponent implements OnInit {
  comentarios: any[] = [];
  nuevoComentario: string = '';
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';

  // ⚠️ Asegúrate de que esta URL apunta a tu backend
  private apiUrl = 'http://localhost/backend/api';
  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.comprobarSesion();
    this.cargarComentarios();
  }

  comprobarSesion() {
    this.http.get<any>(`${this.apiUrl}/check-session.php`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if (res.authenticated) {
          this.isLoggedIn = true;
          this.nombreUsuario = res.user.nombre;
        }
      },
      error: () => {
        this.isLoggedIn = false;
      }
    });
  }

  cargarComentarios() {
    this.http.get<any>(`${this.apiUrl}/get_comentarios.php`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.comentarios = res.data;
        }
      }
    });
  }

  enviarComentario() {
    // Si la caja está vacía, no hacemos nada
    if (!this.nuevoComentario.trim()) return;

    const body = { comentario: this.nuevoComentario };

    // Enviamos el comentario a PHP
    this.http.post<any>(`${this.apiUrl}/guardar_comentario.php`, body, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if (res.success) {
          
          // 🔥 MODO PRO: Añadimos el comentario a la lista visual al instante (arriba del todo)
          this.comentarios.unshift({
            nombre_autor: this.nombreUsuario,
            comentario: this.nuevoComentario,
            fecha_creacion: new Date() // Le ponemos la fecha de este mismo segundo
          });

          // Vaciamos la caja de texto para que quede limpia
          this.nuevoComentario = ''; 
          
        } else {
          console.error("Fallo al guardar en base de datos:", res.message);
        }
      },
      error: (err: any) => {
        console.error("Error de conexión con el servidor:", err);
      }
    });
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}
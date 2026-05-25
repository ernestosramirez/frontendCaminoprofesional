import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { timeout, TimeoutError } from 'rxjs';
import { Auth, Usuario } from '../../services/auth';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Carrusel } from '../../components/carrusel/carrusel';
// 👇 Importamos tu nuevo componente de comentarios
import { ComentariosComponent } from '../../components/comentarios/comentarios.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Header,
    Footer,
    Carrusel,
    ComentariosComponent // 👇 Lo añadimos a la lista para que Angular sepa usar su HTML
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  auth = inject(Auth);

  usuariosMock = signal<Usuario[]>([]);
  mostrarExito = signal(false);
  mensaje = signal('');
  enviando = signal(false);

  formulario = {
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    grados: ''
  };

  constructor() {
    effect(() => {
      if (this.auth.esAdmin()) {
        this.cargarUsuarios();
      }
    });
  }

  hablar(texto: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  enviar() {
    if (this.enviando()) return;

    this.enviando.set(true);
    this.mensaje.set('');
    this.mostrarExito.set(false);

    this.auth.register(this.formulario).pipe(timeout(10000)).subscribe({
      next: (response) => {
        this.enviando.set(false);
        if (response.success) {
          this.formulario = { email: '', nombre: '', apellido: '', telefono: '', grados: '' };
          this.mostrarExito.set(true);
          setTimeout(() => this.mostrarExito.set(false), 5000);
        } else {
          this.mensaje.set('❌ ' + response.message);
        }
      },
      error: (err) => {
        this.enviando.set(false);
        this.mensaje.set(err instanceof TimeoutError
          ? '❌ La solicitud tardó demasiado. Inténtalo de nuevo.'
          : '❌ Error al enviar la solicitud');
      }
    });
  }

  cerrarExito() {
    this.mostrarExito.set(false);
  }

  cargarUsuarios() {
    this.auth.getUsuarios().subscribe({
      next: (response) => {
        if (response.success) {
          this.usuariosMock.set(response.data);
        }
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }
}
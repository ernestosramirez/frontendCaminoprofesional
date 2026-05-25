import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-dam',
  imports: [Header, Footer],
  templateUrl: './dam.html',
  styleUrl: './dam.css'
})
export class Dam {
  abiertos = signal<Set<string>>(new Set());

  toggle(id: string) {
    const s = new Set(this.abiertos());
    s.has(id) ? s.delete(id) : s.add(id);
    this.abiertos.set(s);
  }

  isOpen(id: string) {
    return this.abiertos().has(id);
  }
}
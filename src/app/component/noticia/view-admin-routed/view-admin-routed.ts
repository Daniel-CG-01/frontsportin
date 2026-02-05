import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NoticiaService } from '../../../service/noticia';
import { INoticia } from '../../../model/noticia';
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'app-view-admin-routed',
  standalone: true,
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './view-admin-routed.html',
  styleUrl: './view-admin-routed.css',
})
export class NoticiaViewAdminRouted {

  noticia = signal<INoticia | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');
  
  constructor(private noticiaService: NoticiaService, private route: ActivatedRoute) {

  }
  
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadNoticia(id);
    }
  }
  
  loadNoticia(id: number) {
    this.loading.set(true);
    this.error.set('');
    
    this.noticiaService.getById(id).subscribe({
      next: (data: INoticia) => {
        this.noticia.set(data);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.error.set('No se ha podido cargar la noticia.');
        this.loading.set(false);
      }
    });
  }
}

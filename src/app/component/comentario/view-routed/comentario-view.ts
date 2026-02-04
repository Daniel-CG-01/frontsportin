import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ComentarioService } from '../../../service/comentario';
import { IComentario } from '../../../model/comentario';

@Component({
	selector: 'app-comentario-view',
	imports: [CommonModule, RouterLink],
	templateUrl: './comentario-view.html',
	styleUrl: './comentario-view.css',
})
export class ComentarioViewRouted implements OnInit {
	private route = inject(ActivatedRoute);
	private oComentarioService = inject(ComentarioService);

	oComentario = signal<IComentario | null>(null);
	loading = signal(true);
	error = signal<string | null>(null);

	ngOnInit(): void {
		const idParam = this.route.snapshot.paramMap.get('id');
		const id = idParam ? Number(idParam) : NaN;
		if (isNaN(id)) {
			this.error.set('ID no válido');
			this.loading.set(false);
			return;
		}
		this.load(id);
	}

	load(id: number) {
		this.oComentarioService.get(id).subscribe({
			next: (data: IComentario) => {
				this.oComentario.set(data);
				this.loading.set(false);
			},
			error: (err: HttpErrorResponse) => {
				this.error.set('Error cargando el comentario');
				this.loading.set(false);
				console.error(err);
			},
		});
	}
}

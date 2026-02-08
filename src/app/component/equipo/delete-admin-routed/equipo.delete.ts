import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipoDetailAdminUnrouted } from '../detail-admin-unrouted/equipo-detail';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';


@Component({
    selector: 'app-equipo-view',
    imports: [CommonModule, EquipoDetailAdminUnrouted],
    templateUrl: './equipo-delete.html',
    styleUrl: './equipo-delete.css',
})

export class EquipoDeleteAdminRouted implements OnInit {

    private route = inject(ActivatedRoute);
    private oEquipoService = inject(EquipoService);
    private snackBar = inject(MatSnackBar);

    oEquipo = signal<IEquipo | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);
    id_equipo = signal<number>(0);

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id_equipo.set(idParam ? Number(idParam) : NaN);
        if (isNaN(this.id_equipo())) {
            this.error.set('ID no válido');
            this.loading.set(false);
            return;
        }
    }

    doDelete() {
        this.oEquipoService.delete(this.id_equipo()).subscribe({
            next: (data: any) => {
                this.snackBar.open('Equipo eliminado', 'Cerrar', { duration: 4000 });
                console.log('Equipo eliminado');
                window.history.back();
            },
            error: (err: HttpErrorResponse) => {
                this.error.set('Error eliminando el equipo');
                this.snackBar.open('Error eliminando el equipo', 'Cerrar', { duration: 4000 });
                console.error(err);
            },
        });
    }

    doCancel() {
        window.history.back();
    }




}

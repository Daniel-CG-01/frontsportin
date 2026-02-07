import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // IMPORTANTE
import { ClubService } from '../../../service/club';
import { IClub } from '../../../model/club';

@Component({
  selector: 'app-club-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './club-edit.html', 
  styleUrl: './club-edit.css',
})
export class ClubEditAdminRouted implements OnInit {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oClubService = inject(ClubService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  id: number = 0;
  oClubForm: FormGroup | null = null;
  loading = signal(true);
  
  constructor() {
    this.oClubForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required]],
      telefono: [''],
      imagen: [''],
      fechaAlta:['']

    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : NaN;

    if (isNaN(this.id)) {
      this.snackBar.open('ID no válido', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/club']);
      return;
    }

    this.getOne(); 
  }

  getOne() {
    this.oClubService.get(this.id).subscribe({
      next: (data: IClub) => {
        this.oClubForm?.patchValue(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando el club', 'Cerrar');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.oClubForm?.invalid) {
      this.snackBar.open('El formulario tiene errores', 'Cerrar');
      return;
    }
    const clubToUpdate: IClub = {
        ...this.oClubForm?.getRawValue(),
        id: this.id 
    };

    this.oClubService.update(clubToUpdate).subscribe({
      next: (data: number) => {
        this.snackBar.open('Club actualizado correctamente', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/club/view', this.id]); 
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error al actualizar el club', 'Cerrar');
        console.error(err);
      }
    });
  }

  doCancel() {
    window.history.back();
  }
}
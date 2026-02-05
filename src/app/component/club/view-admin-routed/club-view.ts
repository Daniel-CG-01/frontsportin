import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ClubService } from '../../../service/club';
import { IClub } from '../../../model/club';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'app-club-view',
  imports: [RouterLink, DatetimePipe],
  templateUrl: './club-view.html',
  styleUrl: './club-view.css',
})
export class ClubViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private clubService = inject(ClubService);

  oClub = signal<IClub | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (isNaN(id)) {
      this.error.set('ID no valido');
      this.loading.set(false);
      return;
    }

    this.load(id);
  }

  private load(id: number) {
    this.clubService.get(id).subscribe({
      next: (data: IClub) => {
        this.oClub.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al recuperar el club: ' + err.message);
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../shared/paginacion/paginacion';

@NgModule({
  imports: [CommonModule, BotoneraRpp, Paginacion],
  exports: [BotoneraRpp, Paginacion]
})
export class UsuarioSharedModule {}

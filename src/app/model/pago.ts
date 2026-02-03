export interface IPago {
  id: number;
  cuota: ICuota;
  jugador: IJugador;
  abonado: number;
  fecha: string;
}

export interface ICuota {
  id: number;
  descripcion: string;
  cantidad: number;
  fecha: string;
}

export interface IJugador {
  id: number;
  dorsal: number;
  posicion: string;
  usuario: IUsuario;
}

export interface IUsuario {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  username: string;
}

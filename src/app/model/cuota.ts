export interface ICuota {
  id: number
  descripcion: string
  cantidad: number
  fecha: string
  equipo: IEquipo
  pagos: number
}

export interface IEquipo {
  id: number
  nombre: string
  categoria: ICategoria
  entrenador: IEntrenador
  jugadores: number
  cuotas: number
  ligas: number
}

export interface ICategoria {
  id: number
  nombre: string
  temporada: ITemporada
  equipos: number
}

export interface ITemporada {
  id: number
  descripcion: string
  club: IClub
  categorias: number
}

export interface IClub {
  id: number
  nombre: string
  direccion: string
  telefono: string
  fechaAlta: string
  imagen: any
  temporadas: number
  noticias: number
  tipoarticulos: number
  usuarios: number
}

export interface IEntrenador {
  id: number
  nombre: string
  apellido1: string
  apellido2: string
  username: string
  password: string
  fechaAlta: string
  genero: number
  tipousuario: ITipousuario
  rolusuario: IRolusuario
  club: IClub
  comentarios: number
  puntuaciones: number
  comentarioarts: number
  carritos: number
  facturas: number
}

export interface ITipousuario {
  id: number
  descripcion: string
  usuarios: number
}

export interface IRolusuario {
  id: number
  descripcion: string
  usuarios: number
}

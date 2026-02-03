import { IClub } from './club';
import { IUsuario } from './usuario';

export interface IComentario {
    id: number,
    contenido: string,
    noticia: INoticia,
    usuario: IUsuario,
}

interface INoticia {
    id: number,
    titulo: string,
    contenido: string,
    fecha: Date,
    imagen: string | null,
    club: IClub,
    comentarios: number,
    puntuaciones: number,
}
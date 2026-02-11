import { IArticulo } from "./articulo"
import { IUsuario } from "./usuario"

export interface IComentarioart {
    id: number
    contenido: string
    idArticulo?: number
    idUsuario?: number
    id_articulo?: number
    id_usuario?: number
    articulo?: IArticulo
    usuario?: IUsuario
}

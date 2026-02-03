import { noticiaModel } from "./noticia"
import { IUsuario } from "./usuario"

export interface IPuntuacion {
  id: number
  puntuacion: number
  noticia: noticiaModel
  usuario: IUsuario
}
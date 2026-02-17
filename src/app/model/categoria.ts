import { ITemporada } from "./temporada"

export interface ICategoria {
  id: number
  nombre: string
  // temporada puede ser null/undefined en ciertos listados; marcarlo como opcional
  temporada?: ITemporada | null
  equipos: number
}


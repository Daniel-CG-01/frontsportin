
import { ICategoria } from "./categoria";
import { IUsuario } from "./usuario";

export interface IEquipo {
  id?: number;
  nombre?: string;
  categoria?: ICategoria;
  entrenador?: IUsuario;
  jugadores?: number;
  cuotas?: number;
  ligas?: number;
}

import { IArticulo } from './articulo';
import { IUsuario } from './usuario';

export interface ICarrito {
  id: number;
  cantidad: number;
  articulo: IArticulo;
  usuario: IUsuario;
}

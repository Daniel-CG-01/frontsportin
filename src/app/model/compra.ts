import { IArticulo } from './articulo';
import { IFactura } from './factura';

export interface ICompra {
  id: number;
  cantidad: number;
  precio: number;
  articulo: IArticulo;
  factura: IFactura;
}

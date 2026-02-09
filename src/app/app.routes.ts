
import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { UsuarioPlist } from './component/usuario/usuario-plist/usuario-plist';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { ArticuloViewAdminRouted } from './component/articulo/view-admin-routed/articulo-view';
import { ArticuloDeleteAdminRouted } from './component/articulo/delete-admin-routed/articulo-delete';
import { ArticuloEditAdminRouted } from './component/articulo/edit-admin-routed/articulo-edit';
import { UsuarioViewRouted } from './component/usuario/view-routed/usuario-view';
import { CategoriaPlistAdminRouted } from './component/categoria/plist-admin-routed/categoria-plist';
import { PartidoPlistAdminRouted } from './component/partido/plist-admin-routed/partido-plist';
import { PartidoViewAdminRouted } from './component/partido/view-admin-routed/partido-view';
import { FacturaPlistAdminRouted } from './component/factura/plist-admin-routed/factura-plist';
import { CompraPlistAdminRouted } from './component/compra/plist-admin-routed/compra-plist';
import { CompraViewRouted } from './component/compra/view-routed/compra-view';
import { CompraDeleteAdminRouted } from './component/compra/delete-admin-routed/compra-delete';
import { RolusuarioPlist } from './component/rolusuario/plist-admin-routed/rolusuario-plist';
import { TipoarticuloPlistAdminRouted } from './component/tipoarticulo/plist-admin-routed/tipoarticulo-plist';
import { TipoarticuloViewAdminRouted } from './component/tipoarticulo/view-admin-routed/tipoarticulo-view';
import { JugadorPlisComponent } from './component/jugador/jugadorPlist/jugador-plist';
import { JugadorViewRouted } from './component/jugador/view-routed/jugador-view';
import { LigaPlistAdminRouted } from './component/liga/plist-admin-routed/liga-plist';
import { NoticiaPlistAdminRouted } from './component/noticia/plist-admin-routed/noticia-plist';
import { ClubPlistAdminRouted } from './component/club/plist-admin-routed/club-plist';
import { CuotaPlistAdminRouted } from './component/cuota/plist-admin-routed/cuota-plist';
import { TipousuarioPlistAdminRouted } from './component/tipousario/plist-admin-routed/tipousuario-plist';
import { TemporadaPlist } from './component/temporada/plist-admin-routed/temporada-plist';
import { PlistEquipo } from './component/equipo/equipo-plist';
import { EquipoViewRouted } from './component/equipo/view-routed/equipo-view';
import { CarritoPlistAdminRouted } from './component/carrito/plist-admin-routed/carrito-plist';
import { ComentarioPlistAdminRouted } from './component/comentario/plist-admin-routed/comentario-plist';
import { ComentarioViewRouted } from './component/comentario/view-routed/comentario-view';
import { PagoPlistComponent } from './component/pago/plist-admin-routed/pago-plist';
import { PuntuacionPlistAdminRouted } from './component/puntuacion/plist-admin-routed/puntuacion-plist';
import { PuntuacionViewRouted } from './component/puntuacion/view-routed/puntuacion-view';
import { NoticiaViewAdminRouted } from './component/noticia/view-admin-routed/view-admin-routed';
import { FacturaViewAdminRouted } from './component/factura/view-admin-routed/factura-view';
import { ComentarioartPlistAdminRouted } from './component/comentarioart/comentarioart-plist';
import { TemporadaViewAdminRouted } from './component/temporada/view-admin-routed/temporada-view';
import { TemporadaDeleteAdminRouted } from './component/temporada/delete-admin-routed/temporada-delete';
import { PagoViewAdminRouted } from './component/pago/view-admin-routed/pago-view';
import { ClubViewAdminRouted } from './component/club/view-admin-routed/club-view';
import { CuotaViewAdminRouted } from './component/cuota/view-admin-routed/cuota-view';
import { TipousuarioViewAdminRouted } from './component/tipousario/view-admin-routed/tipousuario-view';
import { CarritoViewAdminRouted } from './component/carrito/view-admin-routed/view-admin-routed';
import { RolusuarioViewAdminRouted } from './component/rolusuario/view-routed/rolusuario-view';
import { CategoriaViewAdminRouted } from './component/categoria/view-admin-routed/categoria-view';
import { CategoriaEditAdminRouted } from './component/categoria/edit-admin-routed/categoria-edit';
import { LigaViewRouted } from './component/liga/view-routed/liga-view';
import { ComentarioartViewRouted } from './component/comentarioart/view-routed/comentarioart-view';
import { PagoDeleteAdminRouted } from './component/pago/delete-admin-routed/pago-delete';
import { PartidoDeleteAdminRouted } from './component/partido/delete-admin-routed/partido-delete';
import { ClubDeleteAdminRouted } from './component/club/delete-admin-routed/club-delete';
import { PuntuacionDeleteAdminRouted } from './component/puntuacion/delete-admin-routed/puntuacion-delete';
import { RolusuarioEditAdminRouted } from './component/rolusuario/edit-admin-routed/rolusuario-edit';
import { CategoriaDeleteAdminRouted } from './component/categoria/delete-admin-routed/categoria-delete';
import { ClubEditAdminRouted } from './component/club/edit-admin-routed/club-edit';
import { CarritoDeleteAdminRouted } from './component/carrito/delete-admin-routed/carrito-delete';
import { ComentarioartDeleteAdminRouted } from './component/comentarioart/delete-admin-routed/delete-admin-routed';
import { FacturaDeleteAdminRouted } from './component/factura/delete-admin-routed/factura-delete';
import { CarritoEditAdminRouted } from './component/carrito/edit-admin-routed/carrito-edit';


export const routes: Routes = [

    { path: '', component: Home },
    { path: 'usuario', component: UsuarioPlist },
    { path: 'usuario/tipousuario/:id_tipousuario', component: UsuarioPlist },
    { path: 'usuario/rol/:id_rol', component: UsuarioPlist },
    { path: 'usuario/club/:id_club', component: UsuarioPlist },
    { path: 'usuario/view/:id', component: UsuarioViewRouted},
    { path: 'temporada', component: TemporadaPlist },
    { path: 'temporada/club/:id_club', component: TemporadaPlist },
    { path: 'temporada/view/:id', component: TemporadaViewAdminRouted },
    { path: 'temporada/delete/:id', component: TemporadaDeleteAdminRouted },
    { path: 'liga', component: LigaPlistAdminRouted },
    { path: 'liga/view/:id', component: LigaViewRouted },
    { path: 'liga/equipo/:id_equipo', component: LigaPlistAdminRouted },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/tipoarticulo/:id_tipoarticulo', component: ArticuloPlistAdminRouted},
    { path: 'usuario/:id', component: UsuarioViewRouted},
    { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/view/:id', component: ArticuloViewAdminRouted},
    { path: 'articulo/delete/:id', component: ArticuloDeleteAdminRouted},
    { path: 'articulo/edit/:id', component: ArticuloEditAdminRouted },
    { path: 'categoria', component: CategoriaPlistAdminRouted},
    { path: 'categoria/temporada/:id_temporada', component: CategoriaPlistAdminRouted},
    { path: 'categoria/view/:id', component: CategoriaViewAdminRouted },
    { path: 'categoria/edit/:id', component: CategoriaEditAdminRouted },
    { path: 'partido', component: PartidoPlistAdminRouted},
    { path: 'partido/liga/:id_liga', component: PartidoPlistAdminRouted},
    { path: 'partido/view/:id', component: PartidoViewAdminRouted},
    { path: 'partido/delete/:id', component: PartidoDeleteAdminRouted },
    { path: 'factura', component: FacturaPlistAdminRouted },
    { path: 'factura/:usuario', component: FacturaPlistAdminRouted },
    { path: 'factura/view/:id', component: FacturaViewAdminRouted },
    { path: 'factura/usuario/:id_usuario', component: FacturaPlistAdminRouted },
    { path: 'factura/delete/:id', component: FacturaDeleteAdminRouted},
    { path: 'compra', component: CompraPlistAdminRouted },
    { path: 'compra/articulo/:id_articulo', component: CompraPlistAdminRouted },
    { path: 'compra/factura/:id_factura', component: CompraPlistAdminRouted },
    { path: 'compra/view/:id', component: CompraViewRouted },
    { path: 'compra/delete/:id', component: CompraDeleteAdminRouted },
    { path: 'rolusuario', component: RolusuarioPlist },
    { path: 'rolusuario/view/:id', component: RolusuarioViewAdminRouted},
    { path: 'rolusuario/edit/:id', component: RolusuarioEditAdminRouted},
    { path: 'tipoarticulo', component : TipoarticuloPlistAdminRouted},
    { path: 'tipoarticulo/club/:id_club', component : TipoarticuloPlistAdminRouted},
    { path: 'tipoarticulo/view/:id', component : TipoarticuloViewAdminRouted},
    { path: 'jugador', component: JugadorPlisComponent},
    { path: 'jugador/usuario/:id_usuario', component: JugadorPlisComponent},
    { path: 'jugador/equipo/:id_equipo', component: JugadorPlisComponent},
    { path: 'jugador/view/:id', component: JugadorViewRouted },
    { path: 'noticia', component: NoticiaPlistAdminRouted},
    { path: 'noticia/club/:id_club', component: NoticiaPlistAdminRouted},
    { path: 'noticia/view/:id', component: NoticiaViewAdminRouted },
    { path: 'club/plist', component: ClubPlistAdminRouted},
    { path: 'club', component: ClubPlistAdminRouted},
    { path: 'club/view/:id', component: ClubViewAdminRouted},
    { path: 'club/delete/:id', component: ClubDeleteAdminRouted},
    { path: 'club/edit/:id', component: ClubEditAdminRouted},
    { path: 'cuota', component: CuotaPlistAdminRouted},
    { path: 'cuota/equipo/:id_equipo', component: CuotaPlistAdminRouted},
    { path: 'cuota/view/:id', component: CuotaViewAdminRouted},
    { path: 'tipousuario', component: TipousuarioPlistAdminRouted},
    { path: 'tipousuario/view/:id', component: TipousuarioViewAdminRouted },
    { path: 'equipo', component: PlistEquipo },
    { path: 'equipo/categoria/:id_categoria', component: PlistEquipo },
    { path: 'equipo/view/:id', component: EquipoViewRouted },
    { path: 'equipo/usuario/:id_usuario', component: PlistEquipo },
    { path: 'carrito', component: CarritoPlistAdminRouted },
    { path: 'carrito/usuario/:id_usuario', component: CarritoPlistAdminRouted },
    { path: 'carrito/articulo/:id_articulo', component: CarritoPlistAdminRouted },
    { path: 'carrito/view/:id', component: CarritoViewAdminRouted },
    { path: 'carrito/delete/:id', component: CarritoDeleteAdminRouted },
    { path: 'carrito/edit/:id', component: CarritoEditAdminRouted },
    { path: 'comentario', component: ComentarioPlistAdminRouted },
    { path: 'comentario/usuario/:id_usuario', component: ComentarioPlistAdminRouted},
    { path: 'comentario/noticia/:id_noticia', component: ComentarioPlistAdminRouted},
    { path: 'comentario/view/:id', component: ComentarioViewRouted},
    { path: 'pago', component: PagoPlistComponent},
    { path: 'pago/cuota/:id_cuota', component: PagoPlistComponent},
    { path: 'pago/jugador/:id_jugador', component: PagoPlistComponent},
    { path: 'pago/view/:id', component: PagoViewAdminRouted},
    { path: 'pago/delete/:id', component: PagoDeleteAdminRouted},
    { path: 'categoria/delete/:id', component: CategoriaDeleteAdminRouted},
    { path: 'puntuacion', component: PuntuacionPlistAdminRouted},
    { path: 'puntuacion/noticia/:id_noticia', component: PuntuacionPlistAdminRouted},
    { path: 'puntuacion/usuario/:id_usuario', component: PuntuacionPlistAdminRouted},
    { path: 'puntuacion/view/:id', component: PuntuacionViewRouted},
    { path: 'puntuacion/delete/:id', component: PuntuacionDeleteAdminRouted},
    { path: 'comentarioart', component: ComentarioartPlistAdminRouted},
    { path: 'comentarioart/articulo/:id_articulo', component: ComentarioartPlistAdminRouted},
    { path: 'comentarioart/usuario/:id_usuario', component: ComentarioartPlistAdminRouted},
    { path: 'comentarioart/view/:id', component: ComentarioartViewRouted},
    { path: 'carrito/delete/:id', component: CarritoDeleteAdminRouted},
    { path: 'comentarioart/delete/:id', component: ComentarioartDeleteAdminRouted },

];

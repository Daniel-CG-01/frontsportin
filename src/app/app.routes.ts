
import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { UsuarioPlist } from './component/usuario/usuario-plist/usuario-plist';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { UsuarioViewRouted } from './component/usuario/view-routed/usuario-view';
import { CategoriaPlistAdminRouted } from './component/categoria/plist-admin-routed/categoria-plist';
import { PartidoPlistAdminRouted } from './component/partido/plist-admin-routed/partido-plist';
import { FacturaPlistAdminRouted } from './component/factura/plist-admin-routed/factura-plist';
import { CompraPlistAdminRouted } from './component/compra/plist-admin-routed/compra-plist';
import { RolusuarioPlist } from './component/rolusuario/plist-admin-routed/rolusuario-plist';
import { TipoarticuloPlistAdminRouted } from './component/tipoarticulo/plist-admin-routed/tipoarticulo-plist';
import { JugadorPlisComponent } from './component/jugador/jugadorPlist/jugador-plist';
import { LigaPlistAdminRouted } from './component/liga/plist-admin-routed/liga-plist';
import { NoticiaPlistAdminRouted } from './component/noticia/plist-admin-routed/noticia-plist';
import { ClubPlistAdminRouted } from './component/club/plist-admin-routed/club-plist';
import { CuotaPlistAdminRouted } from './component/cuota/plist-admin-routed/cuota-plist';
import { TipousuarioPlistAdminRouted } from './component/tipousario/plist-admin-routed/tipousuario-plist';
import { TemporadaPlist } from './component/temporada/temporada-plist/temporada-plist';
import { PlistEquipo } from './component/equipo/equipo-plist';
import { EquipoViewRouted } from './component/equipo/view-routed/equipo-view';
import { CarritoPlistAdminRouted } from './component/carrito/plist-admin-routed/carrito-plist';
import { ComentarioPlistAdminRouted } from './component/comentario/plist-admin-routed/comentario-plist';
import { ComentarioViewRouted } from './component/comentario/view-routed/comentario-view';
import { PagoPlistComponent } from './component/pago/plist-admin-routed/pago-plist';
import { PuntuacionPlistAdminRouted } from './component/puntuacion/plist-admin-routed/puntuacion-plist';
import { ViewAdminRouted } from './component/noticia/view-admin-routed/view-admin-routed';
import { ComentarioartPlistAdminRouted } from './component/comentarioart/comentarioart-plist';


export const routes: Routes = [
    
    { path: '', component: Home },
    { path: 'usuario', component: UsuarioPlist },
    { path: 'usuario/tipousuario/:id_tipousuario', component: UsuarioPlist },
    { path: 'usuario/rol/:id_rol', component: UsuarioPlist },
    { path: 'usuario/club/:id_club', component: UsuarioPlist },
    { path: 'usuario/view/:id', component: UsuarioViewRouted},
    { path: 'temporada', component: TemporadaPlist },
    { path: 'temporada/club/:id_club', component: TemporadaPlist },
    { path: 'liga', component: LigaPlistAdminRouted },
    { path: 'liga/equipo/:id_equipo', component: LigaPlistAdminRouted },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/tipoarticulo/:id_tipoarticulo', component: ArticuloPlistAdminRouted},
    { path: 'usuario/:id', component: UsuarioViewRouted},
    { path: 'categoria', component: CategoriaPlistAdminRouted},
    { path: 'categoria/temporada/:id_temporada', component: CategoriaPlistAdminRouted},
    { path: 'partido', component: PartidoPlistAdminRouted},
    { path: 'partido/liga/:id_liga', component: PartidoPlistAdminRouted},
    { path: 'factura', component: FacturaPlistAdminRouted },
    { path: 'factura/usuario/:id_usuario', component: FacturaPlistAdminRouted },
    { path: 'compra', component: CompraPlistAdminRouted },
    { path: 'compra/articulo/:id_articulo', component: CompraPlistAdminRouted },
    { path: 'compra/factura/:id_factura', component: CompraPlistAdminRouted },
    { path: 'rolusuario', component: RolusuarioPlist },  
    { path: 'tipoarticulo', component : TipoarticuloPlistAdminRouted}, 
    { path: 'tipoarticulo/club/:id_club', component : TipoarticuloPlistAdminRouted},
    { path: 'jugador', component: JugadorPlisComponent},
    { path: 'jugador/usuario/:id_usuario', component: JugadorPlisComponent},
    { path: 'jugador/equipo/:id_equipo', component: JugadorPlisComponent},
    { path: 'noticia', component: NoticiaPlistAdminRouted},
    { path: 'noticia/club/:id_club', component: NoticiaPlistAdminRouted},
    { path: 'noticia/view/:id', component: ViewAdminRouted },
    { path: 'club/plist', component: ClubPlistAdminRouted},
    { path: 'club', component: ClubPlistAdminRouted},
    { path: 'cuota', component: CuotaPlistAdminRouted},
    { path: 'cuota/equipo/:id_equipo', component: CuotaPlistAdminRouted},
    { path: 'tipousuario', component: TipousuarioPlistAdminRouted},
    { path: 'equipo', component: PlistEquipo },
    { path: 'equipo/categoria/:id_categoria', component: PlistEquipo },
    { path: 'equipo/view/:id', component: EquipoViewRouted },
    { path: 'equipo/usuario/:id_usuario', component: PlistEquipo },
    { path: 'carrito', component: CarritoPlistAdminRouted },
    { path: 'carrito/usuario/:id_usuario', component: CarritoPlistAdminRouted },
    { path: 'carrito/articulo/:id_articulo', component: CarritoPlistAdminRouted },
    { path: 'comentario', component: ComentarioPlistAdminRouted },
    { path: 'comentario/usuario/:id_usuario', component: ComentarioPlistAdminRouted},
    { path: 'comentario/noticia/:id_noticia', component: ComentarioPlistAdminRouted},
    { path: 'comentario/view/:id', component: ComentarioViewRouted},
    { path: 'pago', component: PagoPlistComponent},
    { path: 'pago/cuota/:id_cuota', component: PagoPlistComponent},
    { path: 'pago/jugador/:id_jugador', component: PagoPlistComponent},
    { path: 'puntuacion', component: PuntuacionPlistAdminRouted},
    { path: 'puntuacion/noticia/:id_noticia', component: PuntuacionPlistAdminRouted},
    { path: 'puntuacion/usuario/:id_usuario', component: PuntuacionPlistAdminRouted},
    { path: 'comentarioart', component: ComentarioartPlistAdminRouted},
    { path: 'comentarioart/articulo/:id_articulo', component: ComentarioartPlistAdminRouted},
    { path: 'comentarioart/usuario/:id_usuario', component: ComentarioartPlistAdminRouted},

];

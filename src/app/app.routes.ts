
import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { UsuarioPlist } from './component/usuario/usuario-plist/usuario-plist';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { UsuarioViewRouted } from './component/usuario/view-routed/usuario-view';
import { CategoriaPlistAdminRouted } from './component/categoria/plist-admin-routed/categoria-plist';
import { PartidoPlistAdminRouted } from './component/partido/plist-admin-routed/partido-plist';
import { FacturaPlistAdminRouted } from './component/factura/plist-admin-routed/factura-plist';
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
import { ViewAdminRouted } from './component/noticia/view-admin-routed/view-admin-routed';


export const routes: Routes = [
    
    { path: '', component: Home },
    { path: 'usuario', component: UsuarioPlist },
    { path: 'usuario/tipousuario/:tipousuario', component: UsuarioPlist },
    { path: 'usuario/rol/:rol', component: UsuarioPlist },
    { path: 'usuario/club/:club', component: UsuarioPlist },
    { path: 'usuario/view/:id', component: UsuarioViewRouted},
    { path: 'temporada', component: TemporadaPlist },
    { path: 'temporada/:club', component: TemporadaPlist },
    { path: 'liga', component: LigaPlistAdminRouted },
    { path: 'liga/:equipo', component: LigaPlistAdminRouted },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted},
    { path: 'usuario/:id', component: UsuarioViewRouted},
    { path: 'categoria', component: CategoriaPlistAdminRouted},
    { path: 'categoria/:temporada', component: CategoriaPlistAdminRouted},
    { path: 'partido', component: PartidoPlistAdminRouted},
    { path: 'partido/:id_liga', component: PartidoPlistAdminRouted},
    { path: 'factura', component: FacturaPlistAdminRouted },
    { path: 'factura/:usuario', component: FacturaPlistAdminRouted },
    { path: 'rolusuario', component: RolusuarioPlist },  
    { path: 'tipoarticulo', component : TipoarticuloPlistAdminRouted}, 
    { path: 'tipoarticulo/:club', component : TipoarticuloPlistAdminRouted},
    { path: 'jugador', component: JugadorPlisComponent},
    { path: 'jugador/usuario/:id', component: JugadorPlisComponent},
    { path: 'jugador/equipo/:id', component: JugadorPlisComponent},
    { path: 'noticia', component: NoticiaPlistAdminRouted},
    { path: 'noticia/:club', component: NoticiaPlistAdminRouted},
    { path: 'noticia/view/:id', component: ViewAdminRouted },
    { path: 'club/plist', component: ClubPlistAdminRouted},
    { path: 'club', component: ClubPlistAdminRouted},
    { path: 'cuota', component: CuotaPlistAdminRouted},
    { path: 'cuota/:equipo', component: CuotaPlistAdminRouted},
    { path: 'tipousuario', component: TipousuarioPlistAdminRouted},
    { path: 'equipo', component: PlistEquipo },
    { path: 'equipo/:categoria', component: PlistEquipo },

];

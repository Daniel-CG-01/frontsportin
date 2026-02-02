import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
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

export const routes: Routes = [
    
    { path: '', component: Home },
    { path: 'temporada', component: TemporadaPlist },
    { path: 'temporada/:club', component: TemporadaPlist },
    { path: 'liga', component: LigaPlistAdminRouted },
    { path: 'liga/:equipo', component: LigaPlistAdminRouted },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted},    
    { path: 'partido', component: PartidoPlistAdminRouted},
    { path: 'partido/:id_liga', component: PartidoPlistAdminRouted}
    { path: 'factura', component: FacturaPlistAdminRouted },
    { path: 'factura/:usuario', component: FacturaPlistAdminRouted }    
    { path: 'rolusuario', component: RolusuarioPlist },  
    { path: 'tipoarticulo', component : TipoarticuloPlistAdminRouted}, 
    { path: 'tipoarticulo/:club', component : TipoarticuloPlistAdminRouted}
    { path: 'jugador', component: JugadorPlisComponent},
    { path: 'jugador/usuario/:id', component: JugadorPlisComponent},
    { path: 'jugador/equipo/:id', component: JugadorPlisComponent}
    { path: 'noticia', component: NoticiaPlistAdminRouted},
    { path: 'noticia/:club', component: NoticiaPlistAdminRouted}
    { path: 'club/plist', component: ClubPlistAdminRouted}    
    { path: 'cuota', component: CuotaPlistAdminRouted},
    { path: 'cuota/:equipo', component: CuotaPlistAdminRouted}
    { path: 'tipousuario', component: TipousuarioPlistAdminRouted},

];

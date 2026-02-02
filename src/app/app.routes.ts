import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { UsuarioViewRouted } from './component/usuario/view-routed/usuario-view';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted}
    { path: 'usuario/:id', component: UsuarioViewRouted}
];

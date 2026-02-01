import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { CategoriaPlistAdminRouted } from './component/categoria/plist-admin-routed/categoria-plist';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted},
    { path: 'categoria', component: CategoriaPlistAdminRouted},
    { path: 'categoria/:tipocategoria', component: CategoriaPlistAdminRouted}
];

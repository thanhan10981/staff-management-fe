import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[] | undefined;
    const userRoles = this.auth.getRoles();

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // route không yêu cầu quyền
    }

    const hasPermission = userRoles.some(r => requiredRoles.includes(r));

    if (!hasPermission) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}

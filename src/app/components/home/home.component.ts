import { Component, EventEmitter, Input, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { AuthService } from '../../services/auth.service';
import { PlatformLocation } from '@angular/common';

interface sideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userEmail: string = '';
  idu: string | null;
  constructor(private authservice: AuthService, private platformLocation: PlatformLocation) {
    history.pushState(null, '', location.href);
    this.platformLocation.onPopState(() => {
      history.pushState(null, '', location.href)
    })
  }

  ngOnInit(): void {
    this.userEmail = this.authservice.getEmailFromSession();
    this.screenWidth = window.innerWidth;
  }

  @Output() onToggleSidenav: EventEmitter<sideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }

  closesidenav(): void {
    this.collapsed = false;
    this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }

  logout() {
    this.authservice.logout()
  }

  isAdmin(): boolean {
    const currentUserID = this.authservice.getCurrentUserId();
    const adminID = 'w5YLbZibd6e4FzLfJgikSJDVVrJ3';
    return currentUserID === adminID;
  }

  chechLogin() {
    return this.authservice.isAuthenticated()
  }



}

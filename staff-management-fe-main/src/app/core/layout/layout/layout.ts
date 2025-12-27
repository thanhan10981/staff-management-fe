import { Component } from '@angular/core';
import { Header } from "../header/header";
import { RouterModule, RouterOutlet } from "@angular/router";
import { Footer } from "../footer/footer";
import { Sidebar } from "../sidebar/sidebar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header,RouterModule, RouterOutlet, Footer, Sidebar,CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}

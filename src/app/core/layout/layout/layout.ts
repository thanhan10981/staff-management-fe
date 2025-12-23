import { Component } from '@angular/core';
import { Header } from "../header/header";
import { RouterOutlet } from "@angular/router";
import { Footer } from "../footer/footer";
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, RouterOutlet, Footer, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}

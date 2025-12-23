import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-common-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-tabs.html',
  styleUrls: ['./common-tabs.scss']
})
export class CommonTabs {
  @Input() tabs: { label: string, id: string }[] = [];
  @Input() activeTab: string = '';
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(tab: any) {
    this.tabChange.emit(tab.id);
  }
}

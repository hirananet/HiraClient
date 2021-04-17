import { Component, OnInit, Input } from '@angular/core';
import { VcardGetterService } from './vcard-getter.service';

@Component({
  selector: 'app-link-vcard',
  templateUrl: './link-vcard.component.html',
  styleUrls: ['./link-vcard.component.scss']
})
export class LinkVcardComponent implements OnInit {

  @Input() link: string;
  title: string;
  favicon: string;
  loaded: boolean;

  constructor(private vcg: VcardGetterService) { }

  ngOnInit(): void {
    this.vcg.detailOf(this.link).subscribe(r => {
      this.loaded = true;
      if (!r.error) {
        this.title = r.title;
        this.favicon = r.favicon;
      }
    }, err => {
      this.loaded = true;
    });
  }

}

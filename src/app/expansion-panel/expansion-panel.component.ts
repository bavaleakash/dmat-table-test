import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {

  @Input() content: any;
  showImage: boolean;
  movie: any;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    if (this.content) {
      this.movie = this.appService.getMovieById(this.content);
      console.log(this.movie);
      this.showImage = true;
    }
  }

}

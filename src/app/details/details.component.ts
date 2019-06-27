import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  
  labels: any = []
  image:any = null
  constructor(
    private param:ActivatedRoute,
  )
  {
    this.param.queryParams.subscribe(params => {
      // yeah, has to be this way
      setTimeout(() => {
        const json_tags = JSON.parse(params['analisis'])
        console.log(json_tags)
        this.labels = json_tags.labels
        const _url = JSON.parse(params['image'])
        console.log(
          _url
        )
      }, 1000);
    })
  }

  ngOnInit() {
  }

}

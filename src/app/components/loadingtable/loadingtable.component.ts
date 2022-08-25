import { Component, Input, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
@Component({
  selector: 'app-loadingtable',
  templateUrl: './loadingtable.component.html',
  styleUrls: ['./loadingtable.component.css']
})
export class LoadingtableComponent implements OnInit {

  constructor(public g:Globals) { }

  ngOnInit(): void {


  }


}

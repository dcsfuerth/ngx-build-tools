import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dcs-foo',
  styleUrls: ['./foo.component.css'],
  templateUrl: './foo.component.html'
})
export class FooComponent implements OnInit {
  private bar: number = 42;

  ngOnInit() {
    console.log(this.argh);
  }

  get argh(): number {
    return this.bar + 5;
  }
}

export const ARGH: string = '41';

export function fail() {
  throw new Error('PANIC!!!');
}

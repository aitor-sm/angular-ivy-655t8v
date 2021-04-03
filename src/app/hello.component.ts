import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: '<br><div>TaskList version 0.0.1 in {{name}}</div>',
  styles: [`p { font-family: Lato; font-size: small }`]
})

export class HelloComponent  {
  @Input() name: string;
}

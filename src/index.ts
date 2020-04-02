import {
  FastElement,
  customElement,
  attr,
  html,
} from "@microsoft/fast-element";



const template = html`
  <nikola-fast2 :someproperty="${x => x.mainproperty}"></nikola-fast2>
`;

@customElement({
  name: "nikola-test",
  template: template
})
export class Fast1 extends FastElement {
  @attr mainproperty: string = "Set";
}






const template2 = html<Fast2>`
<span>${x => x.someproperty}</span>
`;

@customElement({
  name: "nikola-fast2",
  template: template2
})
export class Fast2 extends FastElement {
  @attr() someproperty: string = "Not Set";

  somepropertyChanged() {
    console.log('someproperty changed');
  }
}

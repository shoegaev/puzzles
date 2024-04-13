export interface Atributes {
  name: string;
  value: string;
}
export interface ElementParametrs {
  tag: string;
  cssClasses: string[];
  textContent?: string;
  atributes?: Atributes[];
  quantity?: number;
  target?: string;
}

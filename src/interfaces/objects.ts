export interface ObjectLiteral extends Object {
  [p: string]: never | string | any
}

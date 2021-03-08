import { ObjectLiteral } from '@/interfaces'

export function flattenObject(obj: ObjectLiteral): ObjectLiteral {
  const flattened: ObjectLiteral = {}

  function recurse(current: ObjectLiteral, property: string) {
    if (!property && Object.getOwnPropertyNames(current).length === 0) {
      return
    }
    if (Object(current) !== current || Array.isArray(current)) {
      flattened[property] = current
    } else {
      let isEmpty = true
      for (const p in current) {
        isEmpty = false
        recurse(current[p], property ? property + '.' + p : p)
      }
      if (isEmpty) {
        flattened[property] = {}
      }
    }
  }

  if (obj) {
    recurse(obj, '')
  }
  return flattened
}

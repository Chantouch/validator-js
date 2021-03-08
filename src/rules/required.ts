export const required = (val: string): boolean => {
  if (val === undefined || val === null) {
    return false
  }

  const str = String(val).replace(/\s/g, '')
  return str.length > 0
}

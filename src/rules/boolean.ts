export const boolean = (val: string | number | boolean): boolean => {
  return (
    val === true ||
    val === false ||
    val === 0 ||
    val === 1 ||
    val === '0' ||
    val === '1' ||
    val === 'true' ||
    val === 'false'
  )
}

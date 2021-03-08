export default function formatter(attribute: string): string {
  return attribute.replace(/[_[]/g, ' ').replace(/]/g, '')
}

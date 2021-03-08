import { ipv6 } from '~/rules/ipv6'
import { ipv4 } from '~/rules/ipv4'

export const ip = (val: string): boolean => {
  return ipv4(val) || ipv6(val)
}

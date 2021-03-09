import { Functions, ObjectLiteral } from '../interfaces'
import Rule from '~/rule'

export default class AsyncResolvers {
  private readonly onResolvedAll: Functions
  private readonly onFailedOne: Functions
  private readonly resolvers: ObjectLiteral
  private resolversCount: number
  private passed: any[]
  private failed: any[]
  private firing: boolean

  constructor(onFailedOne: Functions, onResolvedAll: Functions) {
    this.onResolvedAll = onResolvedAll
    this.onFailedOne = onFailedOne
    this.resolvers = {}
    this.resolversCount = 0
    this.passed = []
    this.failed = []
    this.firing = false
  }

  add(rule: Rule): number {
    const index = this.resolversCount
    this.resolvers[index] = rule
    this.resolversCount++
    return index
  }

  resolve(index: number): void {
    const rule = this.resolvers[index]
    if (rule.passes === true) {
      this.passed.push(rule)
    } else if (rule.passes === false) {
      this.failed.push(rule)
      this.onFailedOne(rule)
    }

    this.fire()
  }

  public fire(): void {
    if (!this.firing) {
      return
    }

    if (this.isAllResolved()) {
      this.onResolvedAll(this.failed.length === 0)
    }
  }

  isAllResolved(): boolean {
    return this.passed.length + this.failed.length === this.resolversCount
  }

  public enableFiring(): void {
    this.firing = true
  }
}

export interface NavItem {
  text: string
  link: string
}

export interface NavGroup {
  text: string
  items: NavItem[]
}

export type UnitNavbarMap = Record<string, NavGroup[]>

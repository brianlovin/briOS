export type Resource = {
  name: string
  url: string
}

export type AppSource = {
  windows?: string
  ios?: string
  macos?: string
  anrdroid?: string
  website?: string
}

export type Offer = {
  label: string
  url: string
}

export type App = {
  name: string
  image: string
  sources: AppSource
  url: string
  offer: Offer
}

export type ChecklistResource = {
  id: string
  title: string
  description: string
  apps?: Array<App> | undefined
  resources?: Array<Resource> | undefined
}

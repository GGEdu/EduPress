declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare module 'markdown-it-container' {
  import type MarkdownIt from 'markdown-it'

  type ContainerPlugin = (
    md: MarkdownIt,
    name: string,
    options?: {
      validate?: (params: string) => boolean
      render?: (tokens: any[], idx: number) => string
      marker?: string
    },
  ) => void

  const container: ContainerPlugin
  export default container
}

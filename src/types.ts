export interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  fontWeight: string | number
  fill: string
  textAnchor: 'start' | 'middle' | 'end'
  letterSpacing?: string
  rotation?: number // rotation in degrees
}

export interface ImageElement {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number // rotation in degrees
  scale?: number // scale percentage (100 = original size)
  alt?: string
}

export interface TreeFlyerConfig {
  backgroundImage: string
  textElements: TextElement[]
  imageElements: ImageElement[]
  width: number
  height: number
}

export interface TreeFlyerEditorProps {
  config?: Partial<TreeFlyerConfig>
  onConfigChange?: (config: TreeFlyerConfig) => void
  onDownload?: (dataUrl: string) => void
  className?: string
  style?: React.CSSProperties
}
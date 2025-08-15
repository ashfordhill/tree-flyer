import { TreeFlyerConfig } from '../types'

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

export const downloadFlyer = async (svgElement: SVGSVGElement, config: TreeFlyerConfig): Promise<string> => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Set canvas size with high resolution
    const scale = 2
    canvas.width = config.width * scale
    canvas.height = config.height * scale
    ctx.scale(scale, scale)

    // Set white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, config.width, config.height)

    // Load and draw background image if it exists
    if (config.backgroundImage) {
      try {
        const bgImg = await loadImage(config.backgroundImage)
        ctx.drawImage(bgImg, 0, 0, config.width, config.height)
      } catch (error) {
        console.warn('Failed to load background image:', error)
      }
    }

    // Load and draw all image elements
    for (const imageElement of config.imageElements) {
      try {
        const img = await loadImage(imageElement.src)
        
        ctx.save()
        
        // Apply rotation if specified
        if (imageElement.rotation && imageElement.rotation !== 0) {
          const centerX = imageElement.x + imageElement.width / 2
          const centerY = imageElement.y + imageElement.height / 2
          ctx.translate(centerX, centerY)
          ctx.rotate((imageElement.rotation * Math.PI) / 180)
          ctx.translate(-centerX, -centerY)
        }
        
        ctx.drawImage(
          img,
          imageElement.x,
          imageElement.y,
          imageElement.width,
          imageElement.height
        )
        
        ctx.restore()
      } catch (error) {
        console.warn('Failed to load image element:', error)
      }
    }

    // Draw all text elements
    for (const textElement of config.textElements) {
      ctx.save()
      
      // Apply rotation if specified
      if (textElement.rotation && textElement.rotation !== 0) {
        ctx.translate(textElement.x, textElement.y)
        ctx.rotate((textElement.rotation * Math.PI) / 180)
        ctx.translate(-textElement.x, -textElement.y)
      }
      
      ctx.font = `${textElement.fontWeight} ${textElement.fontSize}px ${textElement.fontFamily}`
      ctx.fillStyle = textElement.fill
      
      // Handle text alignment manually to match SVG behavior
      let drawX = textElement.x
      
      if (textElement.letterSpacing) {
        // Handle letter spacing by drawing each character individually
        const chars = textElement.text.split('')
        const spacing = parseFloat(textElement.letterSpacing) || 0
        
        if (textElement.textAnchor === 'middle') {
          const totalWidth = chars.reduce((width, char, index) => {
            return width + ctx.measureText(char).width + (index < chars.length - 1 ? spacing : 0)
          }, 0)
          drawX = textElement.x - totalWidth / 2
        } else if (textElement.textAnchor === 'end') {
          const totalWidth = chars.reduce((width, char, index) => {
            return width + ctx.measureText(char).width + (index < chars.length - 1 ? spacing : 0)
          }, 0)
          drawX = textElement.x - totalWidth
        }
        
        let currentX = drawX
        for (let i = 0; i < chars.length; i++) {
          ctx.fillText(chars[i], currentX, textElement.y)
          currentX += ctx.measureText(chars[i]).width + spacing
        }
      } else {
        // Handle alignment for regular text
        if (textElement.textAnchor === 'middle') {
          const textWidth = ctx.measureText(textElement.text).width
          drawX = textElement.x - textWidth / 2
        } else if (textElement.textAnchor === 'end') {
          const textWidth = ctx.measureText(textElement.text).width
          drawX = textElement.x - textWidth
        }
        // For 'start' alignment, drawX remains textElement.x
        
        ctx.fillText(textElement.text, drawX, textElement.y)
      }
      
      ctx.restore()
    }

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png', 1.0)
    
    // Create download link
    const link = document.createElement('a')
    link.download = 'tree-flyer.png'
    link.href = dataUrl
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return dataUrl
  } catch (error) {
    console.error('Error downloading flyer:', error)
    throw new Error('Failed to download flyer')
  }
}

export const downloadSVG = (svgElement: SVGSVGElement): void => {
  try {
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    const link = document.createElement('a')
    link.download = 'tree-flyer.svg'
    link.href = svgUrl
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(svgUrl)
  } catch (error) {
    console.error('Error downloading SVG:', error)
    throw new Error('Failed to download SVG')
  }
}
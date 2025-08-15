import JSZip from 'jszip'
import { TreeFlyerConfig, ImageElement } from '../types'

export interface ExportData {
  config: TreeFlyerConfig
  images: { [key: string]: string } // base64 data URLs
}

export const exportConfig = async (config: TreeFlyerConfig): Promise<void> => {
  try {
    const zip = new JSZip()
    const exportData: ExportData = {
      config: { ...config },
      images: {}
    }

    // Extract image data and replace with references
    const processedImageElements: ImageElement[] = []
    
    for (const imageElement of config.imageElements) {
      if (imageElement.src.startsWith('data:')) {
        // It's a base64 image, extract it
        const imageId = `image_${imageElement.id}`
        exportData.images[imageId] = imageElement.src
        
        // Replace src with reference
        processedImageElements.push({
          ...imageElement,
          src: `ref:${imageId}`
        })
      } else {
        // It's a URL, keep as is
        processedImageElements.push(imageElement)
      }
    }

    exportData.config.imageElements = processedImageElements

    // Add config JSON to zip
    zip.file('config.json', JSON.stringify(exportData, null, 2))

    // Add images to zip
    for (const [imageId, dataUrl] of Object.entries(exportData.images)) {
      const base64Data = dataUrl.split(',')[1]
      const mimeType = dataUrl.split(';')[0].split(':')[1]
      const extension = mimeType.split('/')[1]
      zip.file(`images/${imageId}.${extension}`, base64Data, { base64: true })
    }

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = 'tree-flyer-config.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting config:', error)
    throw new Error('Failed to export configuration')
  }
}

export const importConfig = async (file: File): Promise<TreeFlyerConfig> => {
  try {
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(file)
    
    // Read config.json
    const configFile = zipContent.file('config.json')
    if (!configFile) {
      throw new Error('Invalid config file: missing config.json')
    }
    
    const configText = await configFile.async('text')
    const exportData: ExportData = JSON.parse(configText)
    
    // Restore image data
    const restoredImageElements: ImageElement[] = []
    
    for (const imageElement of exportData.config.imageElements) {
      if (imageElement.src.startsWith('ref:')) {
        // It's a reference, restore from zip
        const imageId = imageElement.src.replace('ref:', '')
        const imageData = exportData.images[imageId]
        
        if (imageData) {
          restoredImageElements.push({
            ...imageElement,
            src: imageData
          })
        } else {
          // Try to find the image file in the zip
          const imageFiles = Object.keys(zipContent.files).filter(name => 
            name.startsWith('images/') && name.includes(imageId)
          )
          
          if (imageFiles.length > 0) {
            const imageFile = zipContent.file(imageFiles[0])
            if (imageFile) {
              const imageBlob = await imageFile.async('blob')
              const dataUrl = await blobToDataUrl(imageBlob)
              restoredImageElements.push({
                ...imageElement,
                src: dataUrl
              })
            }
          }
        }
      } else {
        // It's a regular URL, keep as is
        restoredImageElements.push(imageElement)
      }
    }
    
    return {
      ...exportData.config,
      imageElements: restoredImageElements
    }
  } catch (error) {
    console.error('Error importing config:', error)
    throw new Error('Failed to import configuration')
  }
}

const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
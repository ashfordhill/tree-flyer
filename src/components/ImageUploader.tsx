import React, { useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Slider,
  IconButton,
  Tooltip,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material'
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material'
import { ImageElement } from '../types'

interface ImageUploaderProps {
  imageElements: ImageElement[]
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onAddImage: (image: Omit<ImageElement, 'id'>) => void
  onUpdateImage: (id: string, updates: Partial<ImageElement>) => void
  onRemoveImage: (id: string) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageElements,
  selectedElement,
  onSelectElement,
  onAddImage,
  onUpdateImage,
  onRemoveImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedImageElement = imageElements.find(el => el.id === selectedElement)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      if (src) {
        // Create a temporary image to get dimensions
        const img = new Image()
        img.onload = () => {
          // Calculate size to fit within reasonable bounds
          const maxWidth = 300
          const maxHeight = 300
          let { width, height } = img
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          onAddImage({
            src,
            x: 100, // Default position
            y: 500,
            width: Math.round(width),
            height: Math.round(height),
            rotation: 0,
            scale: 100, // 100% scale by default
            alt: file.name
          })
        }
        img.src = src
      }
    }
    reader.readAsDataURL(file)
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageChange = (field: keyof ImageElement, value: any) => {
    if (!selectedElement) return
    onUpdateImage(selectedElement, { [field]: value })
  }

  const handleScaleChange = (scale: number) => {
    if (!selectedImageElement) return
    
    // Update both scale and dimensions for immediate visual feedback
    const img = new Image()
    img.onload = () => {
      const newWidth = Math.round(img.naturalWidth * scale / 100)
      const newHeight = Math.round(img.naturalHeight * scale / 100)
      
      onUpdateImage(selectedImageElement.id, {
        width: newWidth,
        height: newHeight,
        scale: scale
      })
    }
    img.src = selectedImageElement.src
  }

  const truncateFilename = (filename: string, maxLength: number = 20) => {
    if (filename.length <= maxLength) return filename
    
    const extension = filename.split('.').pop()
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'))
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 4)
    
    return `${truncatedName}...${extension}`
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Images
      </Typography>
      
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 2, 
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'primary.light',
          bgcolor: 'primary.50'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Add images to enhance your flyer
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Image
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          Birds, trees, logos, or other nature images
        </Typography>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          {imageElements.map(element => (
            <Grid item xs={12} key={element.id}>
              <Card 
                variant={selectedElement === element.id ? "elevation" : "outlined"}
                sx={{ 
                  cursor: 'pointer',
                  border: selectedElement === element.id ? 2 : 1,
                  borderColor: selectedElement === element.id ? 'primary.main' : 'divider'
                }}
                onClick={() => onSelectElement(element.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 80, height: 80, objectFit: 'cover' }}
                    image={element.src}
                    alt={element.alt || 'Uploaded image'}
                  />
                  <CardContent sx={{ flex: 1, py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {truncateFilename(element.alt || 'Image')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {element.width} × {element.height}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Delete image">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveImage(element.id)
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedImageElement && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Edit Image
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography gutterBottom variant="body2">
                X Position: {selectedImageElement.x}
              </Typography>
              <Slider
                value={selectedImageElement.x}
                onChange={(_, value) => handleImageChange('x', value)}
                min={0}
                max={1024}
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={6}>
              <Typography gutterBottom variant="body2">
                Y Position: {selectedImageElement.y}
              </Typography>
              <Slider
                value={selectedImageElement.y}
                onChange={(_, value) => handleImageChange('y', value)}
                min={0}
                max={1536}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography gutterBottom variant="body2">
                Size: {selectedImageElement.scale ?? 100}%
              </Typography>
              <Slider
                value={selectedImageElement.scale ?? 100}
                onChange={(_, value) => handleScaleChange(value as number)}
                min={10}
                max={200}
                valueLabelDisplay="auto"
                marks={[
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                  { value: 150, label: '150%' }
                ]}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Typography gutterBottom variant="body2">
                Rotation: {selectedImageElement.rotation ?? 0}°
              </Typography>
              <Slider
                value={selectedImageElement.rotation ?? 0}
                onChange={(_, value) => handleImageChange('rotation', value)}
                min={0}
                max={360}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: '0°' },
                  { value: 90, label: '90°' },
                  { value: 180, label: '180°' },
                  { value: 270, label: '270°' }
                ]}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper elevation={1} sx={{ p: 2, bgcolor: 'info.50' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          💡 Suggestions
        </Typography>
        <Typography variant="body2" component="ul" sx={{ m: 0, pl: 2 }}>
          <li>Add bird photos to highlight wildlife benefits</li>
          <li>Include before/after tree planting photos</li>
          <li>Show different tree species for small yards</li>
          <li>Add your neighborhood association logo</li>
        </Typography>
      </Paper>
    </Box>
  )
}
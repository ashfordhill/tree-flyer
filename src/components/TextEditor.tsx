import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Grid,
  Slider,
  Collapse,
  IconButton,
  Button
} from '@mui/material'
import { ExpandMore, ExpandLess, Edit, Add, Delete } from '@mui/icons-material'
import { TextElement } from '../types'

interface TextEditorProps {
  textElements: TextElement[]
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<TextElement>) => void
  onAddText: () => void
  onRemoveText: (id: string) => void
}

export const TextEditor: React.FC<TextEditorProps> = ({
  textElements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onAddText,
  onRemoveText
}) => {
  const [editorExpanded, setEditorExpanded] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const selectedTextElement = textElements.find(el => el.id === selectedElement)

  // Auto-expand editor when element is selected
  useEffect(() => {
    if (selectedElement && selectedTextElement) {
      setEditorExpanded(true)
      // Scroll to editor after a brief delay to allow for expansion animation
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        })
      }, 150)
    }
  }, [selectedElement, selectedTextElement])

  const handleTextChange = (field: keyof TextElement, value: any) => {
    if (!selectedElement) return
    onUpdateElement(selectedElement, { [field]: value })
  }

  const handleElementSelect = (id: string) => {
    if (selectedElement === id) {
      // If clicking the same element, toggle editor
      setEditorExpanded(!editorExpanded)
    } else {
      // Select new element and expand editor
      onSelectElement(id)
      setEditorExpanded(true)
    }
  }

  const getElementLabel = (element: TextElement) => {
    switch (element.id) {
      case 'kicker': return 'Header Text'
      case 'titleText': return 'Main Title'
      case 'subheadline': return 'Subheading'
      case 'bodyLine1': return 'Body Line 1'
      case 'bodyLine2': return 'Body Line 2'
      case 'bodyLine3': return 'Body Line 3'
      case 'website': return 'Website/Email'
      case 'phone': return 'Phone Number'
      default: return element.id
    }
  }

  const truncateText = (text: string, maxLength: number = 25) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const commonFonts = [
    'Arial, Helvetica, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Trebuchet MS, sans-serif',
    'Impact, sans-serif',
    'Comic Sans MS, cursive',
    'Palatino, serif',
    'Garamond, serif'
  ]

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Text Elements
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={onAddText}
          sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
        >
          Add Text
        </Button>
      </Box>
      
      <List sx={{ mb: 2 }}>
        {textElements.map(element => (
          <ListItem key={element.id} disablePadding>
            <ListItemButton
              selected={selectedElement === element.id}
              onClick={() => handleElementSelect(element.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemText
                primary={getElementLabel(element)}
                secondary={truncateText(element.text)}
                secondaryTypographyProps={{
                  sx: { 
                    color: selectedElement === element.id ? 'inherit' : 'text.secondary',
                    opacity: selectedElement === element.id ? 0.8 : 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  sx={{ 
                    color: selectedElement === element.id ? 'inherit' : 'action.active'
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ 
                    color: selectedElement === element.id ? 'inherit' : 'error.main'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveText(element.id)
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Collapsible Editor */}
      {selectedTextElement && (
        <Paper 
          elevation={2} 
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            border: editorExpanded ? 2 : 1,
            borderColor: editorExpanded ? 'primary.main' : 'divider'
          }}
          ref={editorRef}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => setEditorExpanded(!editorExpanded)}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Edit {getElementLabel(selectedTextElement)}
            </Typography>
            <IconButton size="small" color="primary">
              {editorExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={editorExpanded}>
            <Box sx={{ p: 2 }}>
              <TextField
                label="Text"
                multiline
                rows={3}
                fullWidth
                value={selectedTextElement.text}
                onChange={(e) => handleTextChange('text', e.target.value)}
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Font Family</InputLabel>
                  <Select
                    value={selectedTextElement.fontFamily}
                    label="Font Family"
                    onChange={(e) => handleTextChange('fontFamily', e.target.value)}
                  >
                    {commonFonts.map(font => (
                      <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                        {font.split(',')[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
                    Font Size: {selectedTextElement.fontSize}px
                  </Typography>
                  <Slider
                    value={selectedTextElement.fontSize}
                    onChange={(_, value) => handleTextChange('fontSize', value)}
                    min={10}
                    max={200}
                    valueLabelDisplay="auto"
                    color="primary"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Font Weight</InputLabel>
                    <Select
                      value={selectedTextElement.fontWeight}
                      label="Font Weight"
                      onChange={(e) => handleTextChange('fontWeight', e.target.value)}
                    >
                      <MenuItem value="400">Normal</MenuItem>
                      <MenuItem value="600">Semi Bold</MenuItem>
                      <MenuItem value="700">Bold</MenuItem>
                      <MenuItem value="800">Extra Bold</MenuItem>
                      <MenuItem value="900">Black</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
                  Text Color
                </Typography>
                <TextField
                  type="color"
                  fullWidth
                  value={selectedTextElement.fill}
                  onChange={(e) => handleTextChange('fill', e.target.value)}
                  sx={{ 
                    '& input': { 
                      height: 40,
                      cursor: 'pointer'
                    }
                  }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
                    X Position: {selectedTextElement.x}
                  </Typography>
                  <Slider
                    value={selectedTextElement.x}
                    onChange={(_, value) => handleTextChange('x', value)}
                    min={0}
                    max={1024}
                    valueLabelDisplay="auto"
                    color="primary"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
                    Y Position: {selectedTextElement.y}
                  </Typography>
                  <Slider
                    value={selectedTextElement.y}
                    onChange={(_, value) => handleTextChange('y', value)}
                    min={0}
                    max={1536}
                    valueLabelDisplay="auto"
                    color="primary"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
                  Rotation: {selectedTextElement.rotation ?? 0}°
                </Typography>
                <Slider
                  value={selectedTextElement.rotation ?? 0}
                  onChange={(_, value) => handleTextChange('rotation', value)}
                  min={0}
                  max={360}
                  valueLabelDisplay="auto"
                  color="primary"
                  marks={[
                    { value: 0, label: '0°' },
                    { value: 90, label: '90°' },
                    { value: 180, label: '180°' },
                    { value: 270, label: '270°' }
                  ]}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Text Alignment</InputLabel>
                <Select
                  value={selectedTextElement.textAnchor}
                  label="Text Alignment"
                  onChange={(e) => handleTextChange('textAnchor', e.target.value)}
                >
                  <MenuItem value="start">Left</MenuItem>
                  <MenuItem value="middle">Center</MenuItem>
                  <MenuItem value="end">Right</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Collapse>
        </Paper>
      )}


    </Box>
  )
}
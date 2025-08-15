import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  Alert
} from '@mui/material'
import {
  Download,
  ZoomIn,
  ZoomOut,
  ZoomOutMap,
  OpenWith,
  Save,
  Folder
} from '@mui/icons-material'
import { TreeFlyerConfig, TreeFlyerEditorProps, TextElement, ImageElement } from '../types'
import { generateQRCode } from '../utils/qrcode'
import { downloadFlyer } from '../utils/download'
import { exportConfig, importConfig } from '../utils/importExport'
import { TextEditor } from './TextEditor'
import { ImageUploader } from './ImageUploader'
import { FlyerPreview } from './FlyerPreview'
import { QRGenerator } from './QRGenerator'

const DEFAULT_CONFIG: TreeFlyerConfig = {
  backgroundImage: '',
  width: 1024,
  height: 1536,
  textElements: [
    {
      id: 'kicker',
      text: 'kicker',
      x: 512,
      y: 120,
      fontSize: 48,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 700,
      fill: '#2d5016',
      textAnchor: 'middle',
      letterSpacing: '1px',
      rotation: 0
    },
    {
      id: 'titleText',
      text: 'title',
      x: 512,
      y: 220,
      fontSize: 120,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 900,
      fill: '#1a4009',
      textAnchor: 'middle',
      letterSpacing: '3px',
      rotation: 0
    },
    {
      id: 'subheadline',
      text: 'subheadline',
      x: 512,
      y: 1031,
      fontSize: 52,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 800,
      fill: '#2d5016',
      textAnchor: 'middle',
      letterSpacing: '1px',
      rotation: 0
    },
    {
      id: 'bodyLine1',
      text: 'body line 1',
      x: 512,
      y: 1086,
      fontSize: 32,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 600,
      fill: '#2d5016',
      textAnchor: 'middle',
      rotation: 0
    },
    {
      id: 'bodyLine2',
      text: 'body line 2',
      x: 512,
      y: 1141,
      fontSize: 32,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 600,
      fill: '#2d5016',
      textAnchor: 'middle',
      rotation: 0
    },
    {
      id: 'bodyLine3',
      text: 'body line 3',
      x: 512,
      y: 1208,
      fontSize: 28,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 400,
      fill: '#2d5016',
      textAnchor: 'middle',
      rotation: 0
    },
    {
      id: 'website',
      text: 'website',
      x: 512,
      y: 1363,
      fontSize: 42,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 800,
      fill: '#ffffff',
      textAnchor: 'middle',
      rotation: 0
    },
    {
      id: 'phone',
      text: 'phone',
      x: 512,
      y: 1429,
      fontSize: 48,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 800,
      fill: '#ffffff',
      textAnchor: 'middle',
      rotation: 0
    }
  ],
  imageElements: []
}

export const TreeFlyerEditor: React.FC<TreeFlyerEditorProps> = ({
  config: initialConfig,
  onConfigChange,
  onDownload
}) => {
  const [config, setConfig] = useState<TreeFlyerConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...initialConfig
  }))
  
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'images' | 'qr'>('text')
  const [zoom, setZoom] = useState(0.5) // Start at 50% to fit better
  const [dragMode, setDragMode] = useState(true)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  const svgRef = useRef<SVGSVGElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onConfigChange?.(config)
  }, [config, onConfigChange])

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
  }

  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setConfig(prev => ({
      ...prev,
      textElements: prev.textElements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }))
  }, [])

  const addImageElement = useCallback((imageElement: Omit<ImageElement, 'id'>) => {
    const id = `image-${Date.now()}`
    setConfig(prev => ({
      ...prev,
      imageElements: [...prev.imageElements, { ...imageElement, id }]
    }))
  }, [])

  const updateImageElement = useCallback((id: string, updates: Partial<ImageElement>) => {
    setConfig(prev => ({
      ...prev,
      imageElements: prev.imageElements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }))
  }, [])

  const removeImageElement = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      imageElements: prev.imageElements.filter(el => el.id !== id)
    }))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }, [selectedElement])

  const addTextElement = useCallback(() => {
    const id = `text-${Date.now()}`
    const newTextElement: TextElement = {
      id,
      text: 'New Text',
      x: 512,
      y: 300,
      fontSize: 32,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 600,
      fill: '#2d5016',
      textAnchor: 'middle',
      rotation: 0
    }
    setConfig(prev => ({
      ...prev,
      textElements: [...prev.textElements, newTextElement]
    }))
    setSelectedElement(id)
  }, [])

  const removeTextElement = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      textElements: prev.textElements.filter(el => el.id !== id)
    }))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }, [selectedElement])

  const deleteElement = useCallback((id: string) => {
    const isTextElement = config.textElements.find(el => el.id === id)
    if (isTextElement) {
      removeTextElement(id)
    } else {
      removeImageElement(id)
    }
  }, [config.textElements, removeTextElement, removeImageElement])

  const handleDownload = useCallback(async () => {
    if (!svgRef.current) return
    
    try {
      const dataUrl = await downloadFlyer(svgRef.current, config)
      onDownload?.(dataUrl)
      showAlert('success', 'Flyer downloaded successfully!')
    } catch (error) {
      console.error('Failed to download flyer:', error)
      showAlert('error', 'Failed to download flyer')
    }
  }, [config, onDownload])

  const handleExport = useCallback(async () => {
    try {
      await exportConfig(config)
      showAlert('success', 'Configuration exported successfully!')
    } catch (error) {
      console.error('Failed to export config:', error)
      showAlert('error', 'Failed to export configuration')
    }
  }, [config])

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const importedConfig = await importConfig(file)
      setConfig(importedConfig)
      setSelectedElement(null)
      showAlert('success', 'Configuration imported successfully!')
    } catch (error) {
      console.error('Failed to import config:', error)
      showAlert('error', 'Failed to import configuration')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const generateQR = useCallback(async (url: string) => {
    try {
      const qrDataUrl = await generateQRCode(url)
      addImageElement({
        src: qrDataUrl,
        x: 750,
        y: 1250,
        width: 150,
        height: 150,
        rotation: 0,
        scale: 100,
        alt: 'QR Code'
      })
      showAlert('success', 'QR code added successfully!')
    } catch (error) {
      console.error('Failed to generate QR code:', error)
      showAlert('error', 'Failed to generate QR code')
    }
  }, [addImageElement])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2))
  const handleZoomFit = () => setZoom(0.6)

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Paper 
        elevation={2} 
        sx={{ 
          width: 380, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 0
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
            Tree Flyer Editor
          </Typography>
        </Box>

        {/* Import/Export Actions */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<Folder />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ flex: 1 }}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Save />}
              onClick={handleExport}
              sx={{ flex: 1 }}
            >
              Export
            </Button>
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={dragMode}
                onChange={(e) => setDragMode(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <OpenWith fontSize="small" />
                  <Typography variant="body2">Drag Element Mode</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
                  Drag text and images to reposition
                </Typography>
              </Box>
            }
          />
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Text" value="text" />
          <Tab label="Images" value="images" />
          <Tab label="QR" value="qr" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'text' && (
            <TextEditor
              textElements={config.textElements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onUpdateElement={updateTextElement}
              onAddText={addTextElement}
              onRemoveText={removeTextElement}
            />
          )}

          {activeTab === 'images' && (
            <ImageUploader
              imageElements={config.imageElements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onAddImage={addImageElement}
              onUpdateImage={updateImageElement}
              onRemoveImage={removeImageElement}
            />
          )}

          {activeTab === 'qr' && (
            <QRGenerator
              onGenerateQR={generateQR}
            />
          )}
        </Box>

        {/* Download Button */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Download />}
            onClick={handleDownload}
            sx={{ 
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            Download Flyer
          </Button>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 1.5, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            borderRadius: 0,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} disabled={zoom <= 0.2}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            
            <Box sx={{ width: 120 }}>
              <Slider
                value={zoom}
                onChange={(_, value) => setZoom(value as number)}
                min={0.2}
                max={2}
                step={0.1}
                size="small"
              />
            </Box>
            
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} disabled={zoom >= 2}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Fit to Screen">
              <IconButton onClick={handleZoomFit}>
                <ZoomOutMap />
              </IconButton>
            </Tooltip>
            
            <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }}>
              {Math.round(zoom * 100)}%
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Typography variant="body2" color="text.secondary">
            {dragMode 
              ? 'Drag mode enabled - Click and drag elements' 
              : selectedElement 
                ? `Editing: ${selectedElement}` 
                : 'Click on text or images to edit them'
            }
          </Typography>
        </Paper>

        {/* Preview Area */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'hidden', 
            display: 'flex', 
            bgcolor: '#fafafa'
          }}
        >
          <FlyerPreview
            config={config}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateElement={(id, updates) => {
              if (config.textElements.find(el => el.id === id)) {
                updateTextElement(id, updates)
              } else {
                updateImageElement(id, updates)
              }
            }}
            onDeleteElement={deleteElement}
            svgRef={svgRef}
            zoom={zoom}
            dragMode={dragMode}
          />
        </Box>

        {/* Alert */}
        {alert && (
          <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
            <Alert severity={alert.type} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  )
}
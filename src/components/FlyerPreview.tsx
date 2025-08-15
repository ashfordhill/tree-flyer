import React, { useState, useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { TreeFlyerConfig } from '../types'

interface FlyerPreviewProps {
  config: TreeFlyerConfig
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: any) => void
  onDeleteElement: (id: string) => void
  svgRef: React.RefObject<SVGSVGElement>
  zoom: number
  dragMode: boolean
}

export const FlyerPreview: React.FC<FlyerPreviewProps> = ({
  config,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  svgRef,
  zoom,
  dragMode
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  // Reset pan when zoom changes significantly
  useEffect(() => {
    setPanOffset({ x: 0, y: 0 })
  }, [zoom])

  const handleElementClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (!dragMode) {
      onSelectElement(selectedElement === id ? null : id)
    }
  }

  const handleMouseDown = useCallback((id: string, event: React.MouseEvent) => {
    if (!dragMode) return
    
    event.preventDefault()
    event.stopPropagation()
    
    setIsDragging(true)
    onSelectElement(id)
    
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      setDragStart({
        x: (event.clientX - rect.left) / zoom,
        y: (event.clientY - rect.top) / zoom
      })
    }
  }, [dragMode, zoom, onSelectElement, svgRef])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Handle element dragging
    if (isDragging && selectedElement && dragMode) {
      const currentX = (event.clientX - rect.left) / zoom
      const currentY = (event.clientY - rect.top) / zoom
      
      const deltaX = currentX - dragStart.x
      const deltaY = currentY - dragStart.y
      
      // Find the element being dragged
      const textElement = config.textElements.find(el => el.id === selectedElement)
      const imageElement = config.imageElements.find(el => el.id === selectedElement)
      
      if (textElement) {
        const newX = Math.max(0, Math.min(config.width, textElement.x + deltaX))
        const newY = Math.max(textElement.fontSize, Math.min(config.height, textElement.y + deltaY))
        onUpdateElement(selectedElement, { x: newX, y: newY })
      } else if (imageElement) {
        const newX = Math.max(0, Math.min(config.width - imageElement.width, imageElement.x + deltaX))
        const newY = Math.max(0, Math.min(config.height - imageElement.height, imageElement.y + deltaY))
        onUpdateElement(selectedElement, { x: newX, y: newY })
      }
      
      setDragStart({ x: currentX, y: currentY })
    }
    
    // Handle panning (when not dragging an element)
    if (isPanning && !isDragging) {
      const deltaX = event.clientX - panStart.x
      const deltaY = event.clientY - panStart.y
      
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY
      })
      
      setPanStart({ x: event.clientX, y: event.clientY })
    }
  }, [isDragging, selectedElement, dragMode, zoom, config, onUpdateElement, dragStart, svgRef, isPanning, panStart, panOffset])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsPanning(false)
  }, [])

  const handleBackgroundClick = () => {
    if (!dragMode) {
      onSelectElement(null)
    }
  }

  const handleDeleteClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onDeleteElement(id)
  }

  const handleContainerMouseDown = useCallback((event: React.MouseEvent) => {
    // Start panning when clicking anywhere in the container, but not on text/image elements
    const target = event.target as Element
    const isTextOrImageElement = target.tagName === 'text' || (target.tagName === 'image' && target.getAttribute('href') !== config.backgroundImage)
    
    if (!isTextOrImageElement) {
      setIsPanning(true)
      setPanStart({ x: event.clientX, y: event.clientY })
      event.preventDefault()
    }
  }, [config.backgroundImage])

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100%' 
    }}>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 3,
          bgcolor: 'white',
          cursor: dragMode && isDragging ? 'grabbing' : 
                  isPanning ? 'grabbing' : 
                  dragMode ? 'default' : 'grab',
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          margin: 2
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleContainerMouseDown}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <svg
            ref={svgRef}
            width={config.width * zoom}
            height={config.height * zoom}
            viewBox={`0 0 ${config.width} ${config.height}`}
            style={{ display: 'block' }}
            onClick={handleBackgroundClick}
          >
          {/* Background Image */}
          {config.backgroundImage && (
            <image
              href={config.backgroundImage}
              x="0"
              y="0"
              width={config.width}
              height={config.height}
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          {/* Image Elements - Rendered first so they appear behind text */}
          {config.imageElements.map(element => {
            const rotation = element.rotation ?? 0
            const centerX = element.x + element.width / 2
            const centerY = element.y + element.height / 2
            
            return (
              <g key={element.id}>
                {selectedElement === element.id && (
                  <>
                    <rect
                      x={element.x - 3}
                      y={element.y - 3}
                      width={element.width + 6}
                      height={element.height + 6}
                      fill="rgba(33, 150, 243, 0.1)"
                      stroke="#2196f3"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      rx="4"
                      style={{ pointerEvents: 'none' }}
                      transform={`rotate(${rotation} ${centerX} ${centerY})`}
                    />
                    {/* Delete button */}
                    <g
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleDeleteClick(element.id, e)}
                    >
                      <circle
                        cx={element.x + element.width + 10}
                        cy={element.y - 10}
                        r="12"
                        fill="#f44336"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <text
                        x={element.x + element.width + 10}
                        y={element.y - 5}
                        fontSize="14"
                        fontFamily="Arial, sans-serif"
                        fontWeight="bold"
                        fill="white"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                      >
                        ×
                      </text>
                    </g>
                  </>
                )}
                <image
                  href={element.src}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  transform={`rotate(${rotation} ${centerX} ${centerY})`}
                  style={{ 
                    cursor: dragMode ? (selectedElement === element.id ? 'grab' : 'pointer') : 'pointer'
                  }}
                  onClick={(e) => handleElementClick(element.id, e)}
                  onMouseDown={(e) => handleMouseDown(element.id, e)}
                />
              </g>
            )
          })}

          {/* Text Elements - Rendered last so they appear on top of images */}
          {config.textElements.map(element => {
            const rotation = element.rotation ?? 0
            const textWidth = element.text.length * (element.fontSize * 0.6)
            const textX = element.textAnchor === 'middle' ? element.x - (textWidth / 2) : 
                         element.textAnchor === 'end' ? element.x - textWidth : element.x - 5
            
            return (
              <g key={element.id}>
                {selectedElement === element.id && (
                  <>
                    <rect
                      x={textX}
                      y={element.y - element.fontSize}
                      width={textWidth}
                      height={element.fontSize + 20}
                      fill="rgba(33, 150, 243, 0.1)"
                      stroke="#2196f3"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      rx="4"
                      style={{ pointerEvents: 'none' }}
                      transform={`rotate(${rotation} ${element.x} ${element.y})`}
                    />
                    {/* Delete button */}
                    <g
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleDeleteClick(element.id, e)}
                    >
                      <circle
                        cx={textX + textWidth + 10}
                        cy={element.y - element.fontSize + 10}
                        r="12"
                        fill="#f44336"
                        stroke="#fff"
                        strokeWidth="2"
                        transform={`rotate(${rotation} ${element.x} ${element.y})`}
                      />
                      <text
                        x={textX + textWidth + 10}
                        y={element.y - element.fontSize + 15}
                        fontSize="14"
                        fontFamily="Arial, sans-serif"
                        fontWeight="bold"
                        fill="white"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                        transform={`rotate(${rotation} ${element.x} ${element.y})`}
                      >
                        ×
                      </text>
                    </g>
                  </>
                )}
                <text
                  x={element.x}
                  y={element.y}
                  fontSize={element.fontSize}
                  fontFamily={element.fontFamily}
                  fontWeight={element.fontWeight}
                  fill={element.fill}
                  textAnchor={element.textAnchor}
                  letterSpacing={element.letterSpacing}
                  transform={`rotate(${rotation} ${element.x} ${element.y})`}
                  style={{ 
                    cursor: dragMode ? (selectedElement === element.id ? 'grab' : 'pointer') : 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={(e) => handleElementClick(element.id, e)}
                  onMouseDown={(e) => handleMouseDown(element.id, e)}
                >
                  {element.text}
                </text>
              </g>
            )
          })}
          </svg>
        </div>
      </Box>
      
      <Box sx={{ 
        textAlign: 'center', 
        p: 2, 
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="body2" color="text.secondary">
          {dragMode 
            ? selectedElement 
              ? `Dragging: ${selectedElement}` 
              : 'Click and drag elements to reposition them'
            : isPanning
              ? 'Panning view...'
              : 'Click on text/images to edit • Drag background to pan'
          }
        </Typography>
        {selectedElement && !dragMode && (
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
            Selected: {selectedElement}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
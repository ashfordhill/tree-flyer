import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material'
import { QrCode } from '@mui/icons-material'

interface QRGeneratorProps {
  onGenerateQR: (url: string) => void
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ onGenerateQR }) => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      setError('')
      onGenerateQR(url)
    } catch {
      setError('Please enter a valid URL')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        QR Code Generator
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Generate a QR code that links to any website or URL
        </Typography>
        
        <TextField
          fullWidth
          label="Website URL"
          placeholder="https://example.com or example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error || 'Enter the URL you want the QR code to link to'}
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="contained"
          fullWidth
          startIcon={<QrCode />}
          onClick={handleGenerate}
          disabled={!url.trim()}
          sx={{ 
            bgcolor: '#2e7d32',
            '&:hover': { bgcolor: '#1b5e20' }
          }}
        >
          Generate QR Code
        </Button>
      </Paper>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> The QR code will be added to your poster as an image. 
          You can then resize and reposition it using the Images tab or drag mode.
        </Typography>
      </Alert>
    </Box>
  )
}
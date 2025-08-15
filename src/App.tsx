import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { TreeFlyerEditor } from './components/TreeFlyerEditor'
import { TreeFlyerConfig } from './types'

// Create a nature-themed Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Forest green
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#8bc34a', // Light green
      light: '#bef67a',
      dark: '#5a9216',
    },
    background: {
      default: '#f1f8e9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

// Import the background image - in a real app, this would be imported properly
const backgroundImageUrl = './tree-flyer-clean-textless.png'

function App() {
  const handleConfigChange = (newConfig: TreeFlyerConfig) => {
    console.log('Config updated:', newConfig)
  }

  const handleDownload = (dataUrl: string) => {
    console.log('Flyer downloaded:', dataUrl)
    // You could also save to localStorage, send to server, etc.
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TreeFlyerEditor
        config={{
          backgroundImage: backgroundImageUrl,
          // Default configuration will be used from the component
        }}
        onConfigChange={handleConfigChange}
        onDownload={handleDownload}
      />
    </ThemeProvider>
  )
}

export default App
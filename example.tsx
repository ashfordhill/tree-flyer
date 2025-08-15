import React from 'react'
import { TreeFlyerEditor } from './src/components/TreeFlyerEditor'

// Example usage of the Tree Flyer Editor component
const ExampleUsage: React.FC = () => {
  const handleConfigChange = (config: any) => {
    console.log('Flyer configuration updated:', config)
    // You could save this to localStorage, send to a server, etc.
  }

  const handleDownload = (dataUrl: string) => {
    console.log('Flyer downloaded successfully!')
    // The component automatically triggers the download
    // You could also save the dataUrl for other purposes
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <TreeFlyerEditor
        config={{
          // Use your background image
          backgroundImage: './tree-flyer-clean-textless.png',
          
          // Customize the default text for your neighborhood
          textElements: [
            {
              id: 'kicker',
              text: 'CONNECT WITH',
              x: 512,
              y: 180,
              fontSize: 70,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 700,
              fill: '#204b24',
              textAnchor: 'middle',
              letterSpacing: '2px'
            },
            {
              id: 'titleText',
              text: 'NATURE',
              x: 512,
              y: 330,
              fontSize: 185,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 900,
              fill: '#144d27',
              textAnchor: 'middle',
              letterSpacing: '2px'
            },
            {
              id: 'subheadline',
              text: 'SAVE THE TREES',
              x: 512,
              y: 1030,
              fontSize: 95,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 800,
              fill: '#1a5a2d',
              textAnchor: 'middle',
              letterSpacing: '1px'
            },
            {
              id: 'bodyLine1',
              text: '1 in 6 tree removals in our neighborhood',
              x: 512,
              y: 1105,
              fontSize: 46,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 400,
              fill: '#1f3d23',
              textAnchor: 'middle'
            },
            {
              id: 'bodyLine2',
              text: 'are not replaced! Perfect dwarf species',
              x: 512,
              y: 1150,
              fontSize: 46,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 400,
              fill: '#1f3d23',
              textAnchor: 'middle'
            },
            {
              id: 'bodyLine3',
              text: 'available at mrmaple.com',
              x: 512,
              y: 1195,
              fontSize: 46,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 400,
              fill: '#1f3d23',
              textAnchor: 'middle'
            },
            {
              id: 'website',
              text: 'www.yourneighborhood.com/trees',
              x: 512,
              y: 1328,
              fontSize: 62,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 800,
              fill: '#ffffff',
              textAnchor: 'middle'
            },
            {
              id: 'phone',
              text: 'Request tree planting today!',
              x: 512,
              y: 1385,
              fontSize: 62,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 800,
              fill: '#ffffff',
              textAnchor: 'middle'
            }
          ]
        }}
        onConfigChange={handleConfigChange}
        onDownload={handleDownload}
        className="my-custom-editor"
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  )
}

export default ExampleUsage
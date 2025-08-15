import QRCode from 'qrcode'

export const generateQRCode = async (url: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}
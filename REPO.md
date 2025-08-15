# Repository Maintenance Guide

This document provides guidance for maintaining the Tree Flyer Editor repository.

## Project Overview

**Tree Flyer Editor** is a React component library for creating customizable neighborhood tree planting flyers. It allows users to:

- Edit text elements (headers, body text, contact info)
- Upload and position custom images
- Generate QR codes for websites
- Export flyers as PNG or SVG files

## Architecture

### Core Components

1. **TreeFlyerEditor.tsx** - Main container component that orchestrates the editing experience
2. **TextEditor.tsx** - Handles text element editing with form controls
3. **ImageUploader.tsx** - Manages image upload, positioning, and removal
4. **FlyerPreview.tsx** - SVG-based preview with click-to-edit functionality

### Key Dependencies

- **React 18+** - Core framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **html2canvas** - PNG export functionality
- **qrcode** - QR code generation
- **vite-plugin-dts** - TypeScript declaration generation

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Building

```bash
# Build library for npm publishing
npm run build:lib

# Build demo application
npm run build
```

### Testing

```bash
# Run tests (when implemented)
npm test
```

## File Organization

```
├── src/
│   ├── components/          # React components
│   ├── utils/              # Utility functions
│   ├── types.ts            # TypeScript definitions
│   └── index.ts            # Library exports
├── public/                 # Static assets
├── dist/                   # Built library output
└── docs/                   # Documentation
```

## Release Process

1. **Version Bump**: Update version in `package.json`
2. **Build**: Run `npm run build:lib`
3. **Test**: Verify build works in demo app
4. **Publish**: Run `npm publish`
5. **Tag**: Create git tag for release

## Common Maintenance Tasks

### Adding New Text Elements

1. Update `DEFAULT_CONFIG` in `TreeFlyerEditor.tsx`
2. Add label mapping in `TextEditor.tsx` `getElementLabel()` function
3. Update TypeScript types if needed

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes with tests
3. Update documentation
4. Submit pull request

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Test thoroughly after updates
npm run dev
npm run build:lib
```

### Performance Optimization

- Monitor bundle size with `npm run build:lib`
- Use React.memo() for expensive components
- Optimize image handling for large uploads
- Consider lazy loading for heavy features

## Troubleshooting

### Common Issues

1. **SVG Export Problems**
   - Check CORS settings for external images
   - Verify all fonts are web-safe
   - Test with different image formats

2. **Build Failures**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all imports are correct

3. **Performance Issues**
   - Profile with React DevTools
   - Check for unnecessary re-renders
   - Optimize large image handling

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('tree-flyer-debug', 'true')
```

## Code Quality

### TypeScript

- Maintain strict type checking
- Use proper interfaces for all props
- Avoid `any` types

### CSS

- Use CSS modules or styled-components for component isolation
- Follow BEM naming convention
- Ensure responsive design

### React Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Follow React performance guidelines

## Security Considerations

### Image Uploads

- Validate file types and sizes
- Sanitize file names
- Consider implementing virus scanning for production

### XSS Prevention

- Sanitize user text input
- Use proper React patterns (avoid dangerouslySetInnerHTML)
- Validate all external URLs

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No IE support required

## Deployment

### NPM Package

- Ensure proper `.npmignore` configuration
- Include only necessary files in package
- Test installation in separate project

### Demo Site

- Deploy to Vercel/Netlify for easy sharing
- Include example configurations
- Provide clear usage instructions

## Future Enhancements

### Planned Features

1. **Template System** - Pre-built flyer templates
2. **Font Management** - Custom font uploads
3. **Collaboration** - Multi-user editing
4. **Print Optimization** - PDF export with print settings
5. **Accessibility** - Screen reader support, keyboard navigation

### Technical Debt

- Implement comprehensive test suite
- Add Storybook for component documentation
- Improve error handling and user feedback
- Add internationalization support

## Monitoring

### Analytics (if implemented)

- Track feature usage
- Monitor error rates
- Measure performance metrics

### User Feedback

- GitHub Issues for bug reports
- Discussions for feature requests
- Regular user surveys

## Documentation

### Keep Updated

- README.md - Installation and basic usage
- API documentation - Component props and methods
- Examples - Common use cases
- Changelog - Version history

### Generate Automatically

- TypeScript definitions from source
- API docs from JSDoc comments
- Component props from PropTypes/interfaces

## Contact Information

**Maintainer**: [Your Name]
**Email**: [your-email@example.com]
**GitHub**: [@yourusername]

## Emergency Procedures

### Critical Bug Fix

1. Create hotfix branch from main
2. Implement minimal fix
3. Test thoroughly
4. Release patch version immediately
5. Communicate to users via GitHub releases

### Security Vulnerability

1. Do not discuss publicly initially
2. Fix in private branch
3. Coordinate disclosure timeline
4. Release security patch
5. Publish security advisory

---

Last Updated: [Current Date]
Next Review: [3 months from now]
# Publishing Guide

## Prerequisites

1. Create an npm account at https://www.npmjs.com/signup
2. Create an npm organization (if publishing under `@enduroshieldhub` scope)
3. Login to npm: `npm login`

## First Time Publishing

1. **Verify package structure:**
   ```bash
   cd packages/enduroshieldhub-sdk
   npm install
   ```

2. **Verify source files:**
   ```bash
   ls src/
   # Should see: index.ts
   ```

3. **Test locally (optional):**
   ```bash
   npm pack
   # Creates a .tgz file you can test locally
   ```

4. **Publish to npm:**
   ```bash
   npm publish --access public
   ```

## Updating the Package

1. **Update version in package.json:**
   ```bash
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   ```

2. **Publish:**
   ```bash
   npm publish --access public
   ```

## Version Management

- **Patch** (1.0.0 -> 1.0.1): Bug fixes, no breaking changes
- **Minor** (1.0.0 -> 1.1.0): New features, backward compatible
- **Major** (1.0.0 -> 2.0.0): Breaking changes

## Troubleshooting

### Error: "You must verify your email"
- Check your email and verify your npm account

### Error: "Package name already exists"
- The package name might be taken, consider a different name
- Or use a scoped package: `@your-org/enduroshieldhub-sdk`

### Error: "You do not have permission"
- Make sure you're logged in: `npm whoami`
- For scoped packages, ensure you have access to the organization

## Publishing Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md (if you have one)
- [ ] Run tests (if you have them)
- [ ] Verify src/ folder contains all TypeScript files
- [ ] Test locally with `npm pack`
- [ ] Publish: `npm publish --access public`
- [ ] Verify on npmjs.com


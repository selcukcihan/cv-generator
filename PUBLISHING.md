# Publishing

This file is for repository and release maintenance.

## Package

- npm package: `@scihan/cv-generator`
- repository: `https://github.com/selcukcihan/cv-generator`
- docs site source: `docs/index.html`

## Local Release Checks

```bash
npm run build
npm pack --dry-run
npm run generate -- --profile candidate-profile.yaml --out output/cv.pdf --score-report-out output/cv-report.json
```

## First Publish

```bash
npm login
npm publish --access public
```

The `scihan` npm scope must be owned by the publishing account or organization.

Workflow file:

- [.github/workflows/release.yml](.github/workflows/release.yml)
- [.github/workflows/pages.yml](.github/workflows/pages.yml)

## Release Flow

1. Update the package version.
2. Commit the version change.
3. Push a Git tag like `v1.1.0`.
4. GitHub Actions validates the package and creates the matching GitHub Release.
5. Publish to npm manually from your machine:

```bash
npm publish --access public
```

## Notes

- `npm pack --dry-run` should stay clean and only include intended files.
- The build script clears `dist/` before compiling to avoid publishing stale files.
- npm publishing is manual by design.

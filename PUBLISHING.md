# Publishing

This file is for repository and release maintenance.

## Package

- npm package: `@scihan/cv-generator`
- repository: `https://github.com/selcukcihan/cv-generator`

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

## Trusted Publishing

Configure npm Trusted Publishing for:

- provider: `GitHub Actions`
- owner: `selcukcihan`
- repository: `cv-generator`
- workflow file: `release.yml`

Workflow file:

- [.github/workflows/release.yml](.github/workflows/release.yml)

## Release Flow

1. Update the package version.
2. Commit the version change.
3. Push a Git tag like `v1.1.0`.
4. GitHub Actions publishes to npm.
5. The same workflow creates the matching GitHub Release.

## Notes

- `npm pack --dry-run` should stay clean and only include intended files.
- The build script clears `dist/` before compiling to avoid publishing stale files.

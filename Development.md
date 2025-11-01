## Development Overview

1. Develop on a feature branch (based off `master`) and raise a PR to the appropriate `release-` branch:
   - `release-patch` for bug fixes
   - `release-minor` for new features
   - `release-major` for breaking changes
2. Once merged and tested, raise a PR from the `release-` branch to `master` to create an official release.

### Features

- ✅ Full TypeScript support with type definitions
- ✅ Universal compatibility (ESM, CommonJS, TypeScript)
- ✅ Automated semantic versioning via CI/CD
- ✅ Built with modern tooling (tsdown, Node test runner)

### Recommended Development Experience (DX) Flow

1. Run `npm run dev` to watch and rebuild `dist` on changes.
2. Run `npm run test:watch` to watch and run tests as changes are made to `src`.
3. Raise a PR to the appropriate `release-` branch to allow CI/CD to manage versioning automatically.

For additional developer commands, see the `scripts` section in `package.json`.

### CI/CD Workflow

See `.github/` for all ready-made GitHub workflows. Here's how it works:

#### Branch Strategy

```
feature/my-feature → release-{patch|minor|major} →  master
                     (RC version)                   (Official release)
```

#### Workflow Steps

1. **PR Testing**: All PRs trigger automated unit tests.
2. **Release Candidate**: When a feature branch merges to a `release-` branch, CI builds an RC version (e.g., `1.2.3-rc.1`).
3. **Official Release**: When a `release-` branch merges to `master`, CI:
   - Removes the `-rc.` suffix to create the official version
   - Publishes the release
   - Resets the release branch to match `master` for the next cycle

#### Version Control Branches

Three branches control versioning:

- `release-patch`: Bug fixes (1.0.0 → 1.0.1)
- `release-minor`: New features (1.0.0 → 1.1.0)
- `release-major`: Breaking changes (1.0.0 → 2.0.0)

#### ⚠️ Important: Sequential Releases Only

**Never merge multiple release branches to `master` simultaneously.** Releases must be done sequentially to avoid version conflicts.

✅ Correct: Merge `release-patch` → wait for completion → merge `release-minor`

❌ Incorrect: Merge `release-patch` and `release-minor` at the same time

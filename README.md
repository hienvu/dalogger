*** TEMPLATE - REMOVE ME ***
## Motivation

At best, the ritual of starting a new module is just a chore that turns into the same old boilerplate. I built this so I don't have to think about it - though I still tip my hat to the giants whose work made this possible.

This is mainly for personal use, but feel free to fork and adapt to your needs.

### Get Started

1. Create a repo using this as a template then create three branches from master: `release-patch`, `release-minor`, and `release-major`.
2. Update `package.json` with your project's description, keywords, name, etc.
3. Run `npm i && npm run update-deps` to install and update all dependencies.

Replace with the real Get Started. For example:

#### Installation

```bash
npm i git+ssh://git@github.com:hienvu/node-module-template-private.git
```

#### Usage

TypeScript - test.ts:
```typescript
import helloWorld, {cheerio} from '@hvu/my-package';

const hello: string = helloWorld();
const goodbye: string = cheerio();

console.log(`Say ${hello} ... and wave ${goodbye}`);
```

ESM - test.mjs:
```javascript
import helloWorld, {cheerio} from '@hvu/my-package';

console.log(helloWorld());
console.log(cheerio());

```

CommonJS - test.cjs
```javascript
const {helloWorld, cheerio} = require('@hvu/my-package');

console.log(helloWorld());
console.log(cheerio());
```
*** END OF TEMPLATE - REMOVE ME ***


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
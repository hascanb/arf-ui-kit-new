# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Additional form field types
- Enhanced i18n support
- E2E test coverage expansion
- CI/CD release automation improvements

---

## [1.0.1] - 2026-03-10

### Changed
- Package scope migrated from `@arftech/arf-ui-kit` to `@hascanb/arf-ui-kit` for publish ownership alignment.
- Release pipeline standardized to run validation first (`workflow_dispatch` with `publish=false`) and publish only on explicit release or `publish=true`.

### Verified
- GitHub Actions publish workflow passes with Playwright browser installation and green test/build/package checks.
- npm distribution confirmed under the new scope.

---

## [1.0.0] - 2026-03-10

### Added - First Stable Public Release

#### Phase 5 Quality & Documentation
- Storybook setup with 40+ stories across all kits
- Dark mode and responsive preview support in Storybook
- Comprehensive project documentation (`README.md`, `SECURITY.md`, `PERFORMANCE.md`, `ACCESSIBILITY.md`)
- MIT license file and maintained changelog workflow

#### Release Infrastructure
- npm publish workflow (`.github/workflows/publish.yml`)
- Provenance-enabled npm publish configuration
- Release preflight script (`npm run release:check`)

### Verified
- Library build output with type declarations for all kits
- Test suite passes for Storybook and kit scenarios
- Package publish contents validated via `npm pack --dry-run`

### Notes
- This version marks the production-ready baseline for public npm distribution.

---

## [0.2.0] - 2026-03-09

### Added - DataTable-Kit Production Release

#### Core Features
- **DataTable Component**: Full TanStack Table v8 integration
- **9 Core Components**:
  - DataTable (main component)
  - DataTablePagination (full control)
  - DataTableColumnHeader (sortable)
  - DataTableToolbar (search, filters, actions)
  - DataTableViewOptions (column visibility)
  - DataTableBulkActions (mass operations)
  - DataTableFacetedFilter (multi-select filters)
  - DataTableExcelActions (import/export)
  - SelectionColumn (checkbox helper)

#### Advanced Features
- URL state synchronization (bookmarkable tables)
- Excel import/export functionality
- Faceted filtering with counts
- Multi-column sorting
- Row selection (single + bulk)
- Server-side pagination support
- Responsive design

#### Hooks & Utils
- `useTableUrlState` - URL query synchronization
- `excel.ts` - 4 functions (export, import, template, validate)
- `get-page-numbers.ts` - 3 pagination helpers

#### Test Infrastructure
- 3 test pages (basic, advanced, server-side)
- Interactive demos
- Props documentation

### Changed
- Improved type safety across datatable components
- Enhanced filtering performance
- Optimized re-render behavior

---

## [0.1.0] - 2026-03-10

### Added - Initial Release

#### Form-Kit (Production Ready)
- **3 Core Components**:
  - SchemaForm (main component)
  - FieldRenderer (auto field type mapping)
  - FormKitProvider (global config - optional)
  
- **10 Field Types**:
  - text, email, password, number
  - textarea, select, combobox (NEW)
  - checkbox, radio, date
  - file, custom
  
- **Advanced Features**:
  - Schema-driven form generation
  - Zod validation integration
  - Type-safe field configurations
  - Cross-field validation (6 refinement functions)
  - Layout system (columns: 1-12, gap, spacing)
  - Calendar date picker (upgraded from native input)
  
- **Cross-Field Validations**:
  - `createPasswordStrengthRefine`
  - `createPasswordConfirmRefine`
  - `createDateRangeRefine`
  - `createConditionalRequiredRefine`
  - `createFieldComparisonRefine`
  - `createMinMaxRefine`

#### Errors-Kit (Production Ready)
- **2 Core Components**:
  - ErrorRenderer (dynamic error page rendering)
  - ErrorsKitProvider (context provider)
  
- **Advanced Features**:
  - 4 error levels (low, medium, high, critical)
  - Level-based actions (toast, redirect, reload, modal)
  - Error normalization (Axios, Fetch, Custom)
  - Status to level mapping (400, 401, 403, 404, 500, etc.)
  - Status to slug mapping for routing
  - Special 401 handling for auth flows
  - Custom error message extraction
  
- **Hooks & Utils**:
  - `useErrorHandler` (React hook)
  - `createErrorHandler` (factory function)

#### Auth-Kit (Complete)
- 4 form components (SignIn, ForgotPassword, ResetPassword, OTP)
- 5 page layouts (single/split column)
- OAuth integration (Google, Apple)
- i18n support (en/tr)
- Zod validation
- Brand icons (GoogleIcon, AppleIcon)

#### Layout-Kit (Complete)
- DashboardLayout (main wrapper)
- AppHeader (sticky, breadcrumb support)
- AppSidebar (navigation, collapsible)
- AppFooter (links, social media)
- Navigation utils (7 presets)
- Responsive design

#### Infrastructure
- TypeScript build configuration
- ESM build with tree-shaking
- Type declarations (.d.ts)
- Sub-path exports for all kits
- Source maps
- 12 test pages with interactive demos
- 40+ unit tests
- CI/CD with GitHub Actions

### Fixed
- **Form-Kit**:
  - Zod validation order (`.optional()` must be last)
  - DateField upgraded from native input to Calendar component
  - Combobox field type added
  
- **Errors-Kit**:
  - Import paths corrected in test files
  - TypeScript type annotations for callbacks

### Changed
- ESLint v9 → v10 migration (flat config)
- Improved Turkish localization
- Enhanced type safety across all kits

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| [1.0.0] | 2026-03-10 | First stable public release with Phase 5 completion |
| [0.2.0] | 2026-03-09 | DataTable-Kit production release |
| [0.1.0] | 2026-03-10 | Initial release with 5 kits |

---

## Migration Guides

### Upgrading to v1.0.0 from v0.2.0

No breaking changes. Simply update the package:

```bash
npm install @hascanb/arf-ui-kit@latest
```

New features are additive and don't affect existing code.

---

## Breaking Changes

None yet! This is the initial public release.

---

## Deprecations

None.

---

## Security Updates

All dependencies are up to date as of March 10, 2026. Run `npm audit` for the latest security status.

---

For detailed commit history, see [GitHub Commits](https://github.com/arftech/arf-ui-kit/commits/main).

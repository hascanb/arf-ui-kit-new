├── CHANGELOG.md
├── KURAL.md
├── LICENSE
├── README.md
├── SECURITY.md
├── app
│   ├── _shared
│   │   ├── entry-policy.ts
│   │   └── states.tsx
│   ├── arf
│   │   ├── (workspaces)
│   │   │   ├── cargo
│   │   │   │   ├── _components
│   │   │   │   │   ├── cargo-layout-shell.tsx
│   │   │   │   │   └── support-modal.tsx
│   │   │   │   ├── _data
│   │   │   │   │   └── nav.tsx
│   │   │   │   ├── branches
│   │   │   │   │   ├── _components
│   │   │   │   │   │   └── branches-table-section.tsx
│   │   │   │   │   ├── _mock
│   │   │   │   │   │   └── branches-mock-data.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── customers
│   │   │   │   │   ├── [customerId]
│   │   │   │   │   │   ├── _components
│   │   │   │   │   │   │   ├── address-bulk-import-modal.tsx
│   │   │   │   │   │   │   ├── customer-addresses-section.tsx
│   │   │   │   │   │   │   ├── customer-contracts-section.tsx
│   │   │   │   │   │   │   ├── customer-financial-movements-section.tsx
│   │   │   │   │   │   │   ├── customer-header-actions.tsx
│   │   │   │   │   │   │   ├── customer-info-editor-card.tsx
│   │   │   │   │   │   │   └── customer-shipments-section.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── _components
│   │   │   │   │   │   └── customers-table-section.tsx
│   │   │   │   │   ├── _data
│   │   │   │   │   │   └── customers.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── finance
│   │   │   │   │   ├── _components
│   │   │   │   │   │   └── finance-invoices-section.tsx
│   │   │   │   │   ├── _mock
│   │   │   │   │   │   └── finance-mock-data.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── gallery
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page-content.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── reports
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings
│   │   │   │   │   └── page.tsx
│   │   │   │   └── shipments
│   │   │   │       ├── [id]
│   │   │   │       │   ├── page-content.tsx
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── _api
│   │   │   │       │   └── shipment-actions-api.ts
│   │   │   │       ├── _components
│   │   │   │       │   ├── customer-address-modal.tsx
│   │   │   │       │   ├── delivery-info-modal.tsx
│   │   │   │       │   ├── drafts-sheet.tsx
│   │   │   │       │   ├── piece-cancel-info-modal.tsx
│   │   │   │       │   ├── piece-cancel-modal.tsx
│   │   │   │       │   ├── piece-delivery-entry-modal.tsx
│   │   │   │       │   ├── piece-report-info-modal.tsx
│   │   │   │       │   ├── piece-report-modal.tsx
│   │   │   │       │   ├── shipment-cancel-info-modal.tsx
│   │   │   │       │   ├── shipment-cancel-modal.tsx
│   │   │   │       │   ├── shipment-handover-info-modal.tsx
│   │   │   │       │   └── shipment-handover-modal.tsx
│   │   │   │       ├── _hooks
│   │   │   │       │   ├── use-piece-actions.ts
│   │   │   │       │   └── use-shipment-modal-manager.ts
│   │   │   │       ├── _mock
│   │   │   │       │   └── shipments-mock-data.ts
│   │   │   │       ├── canceled
│   │   │   │       │   ├── page-content.tsx
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── new
│   │   │   │       │   ├── page-content.tsx
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── page-content.tsx
│   │   │   │       ├── page.tsx
│   │   │   │       ├── pieces
│   │   │   │       │   ├── [pieceId]
│   │   │   │       │   │   ├── page-content.tsx
│   │   │   │       │   │   └── page.tsx
│   │   │   │       │   ├── page-content.tsx
│   │   │   │       │   └── page.tsx
│   │   │   │       └── track
│   │   │   │           ├── page-content.tsx
│   │   │   │           └── page.tsx
│   │   │   └── page.tsx
│   │   ├── _shared
│   │   │   └── routes.ts
│   │   └── auth
│   │       ├── config.ts
│   │       ├── forgot-password
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── otp
│   │       │   └── page.tsx
│   │       ├── reset-password
│   │       │   ├── page-content.tsx
│   │       │   └── page.tsx
│   │       ├── signin
│   │       │   └── page.tsx
│   │       ├── signin2
│   │       │   └── page.tsx
│   │       └── signup
│   │           ├── page-content.tsx
│   │           └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── test
│       ├── _components
│       │   └── kit-page-template.tsx
│       ├── a11y
│       │   └── page.tsx
│       ├── auth
│       │   ├── components
│       │   │   ├── forgot-password-form
│       │   │   │   └── page.tsx
│       │   │   ├── otp-form
│       │   │   │   └── page.tsx
│       │   │   ├── reset-password-form
│       │   │   │   └── page.tsx
│       │   │   └── signin-form
│       │   │       └── page.tsx
│       │   ├── config.ts
│       │   ├── demo
│       │   │   └── page.tsx
│       │   ├── kit-landing-template.tsx
│       │   ├── page.tsx
│       │   └── pages
│       │       ├── forgot-password
│       │       │   └── page.tsx
│       │       ├── otp
│       │       │   └── page.tsx
│       │       ├── reset-password
│       │       │   └── page.tsx
│       │       ├── signin
│       │       │   └── page.tsx
│       │       └── signin2
│       │           └── page.tsx
│       ├── benchmarks
│       │   └── page.tsx
│       ├── datatable
│       │   ├── advanced
│       │   │   └── page.tsx
│       │   ├── basic
│       │   │   └── page.tsx
│       │   ├── data.ts
│       │   ├── page.tsx
│       │   └── server-side
│       │       └── page.tsx
│       ├── errors
│       │   ├── demo
│       │   │   ├── example-pages.tsx
│       │   │   └── page.tsx
│       │   ├── example-pages.tsx
│       │   └── page.tsx
│       ├── feedback
│       │   ├── demo
│       │   │   └── page.tsx
│       │   └── page.tsx
│       ├── file-uploader
│       │   ├── demo
│       │   │   └── page.tsx
│       │   └── page.tsx
│       ├── form
│       │   ├── advanced
│       │   │   └── page.tsx
│       │   ├── demo
│       │   │   └── page.tsx
│       │   └── page.tsx
│       ├── gallery
│       │   └── page.tsx
│       ├── icons
│       │   └── auth
│       │       └── page.tsx
│       ├── layout
│       │   ├── dashboard
│       │   │   └── page.tsx
│       │   ├── footer
│       │   │   └── page.tsx
│       │   ├── header
│       │   │   └── page.tsx
│       │   └── sidebar
│       │       └── page.tsx
│       ├── layout-kit
│       │   └── page.tsx
│       ├── layout.tsx
│       ├── page.tsx
│       └── utils
│           ├── token
│           │   └── page.tsx
│           └── validation
│               └── page.tsx
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── playground
│   ├── components
│   │   └── ui
│   │       ├── IconComponent.tsx
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.d.ts
│   │       ├── alert.d.ts.map
│   │       ├── alert.js
│   │       ├── alert.js.map
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.d.ts
│   │       ├── avatar.d.ts.map
│   │       ├── avatar.js
│   │       ├── avatar.js.map
│   │       ├── avatar.tsx
│   │       ├── badge.d.ts
│   │       ├── badge.d.ts.map
│   │       ├── badge.js
│   │       ├── badge.js.map
│   │       ├── badge.tsx
│   │       ├── breadcrumb.d.ts
│   │       ├── breadcrumb.d.ts.map
│   │       ├── breadcrumb.js
│   │       ├── breadcrumb.js.map
│   │       ├── breadcrumb.tsx
│   │       ├── button-group.tsx
│   │       ├── button.d.ts
│   │       ├── button.d.ts.map
│   │       ├── button.js
│   │       ├── button.js.map
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.d.ts
│   │       ├── card.d.ts.map
│   │       ├── card.js
│   │       ├── card.js.map
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.d.ts
│   │       ├── checkbox.d.ts.map
│   │       ├── checkbox.js
│   │       ├── checkbox.js.map
│   │       ├── checkbox.tsx
│   │       ├── collapsible.d.ts
│   │       ├── collapsible.d.ts.map
│   │       ├── collapsible.js
│   │       ├── collapsible.js.map
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.d.ts
│   │       ├── dropdown-menu.d.ts.map
│   │       ├── dropdown-menu.js
│   │       ├── dropdown-menu.js.map
│   │       ├── dropdown-menu.tsx
│   │       ├── empty.tsx
│   │       ├── field.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── index.ts
│   │       ├── input-group.tsx
│   │       ├── input-otp.d.ts
│   │       ├── input-otp.d.ts.map
│   │       ├── input-otp.js
│   │       ├── input-otp.js.map
│   │       ├── input-otp.tsx
│   │       ├── input.d.ts
│   │       ├── input.d.ts.map
│   │       ├── input.js
│   │       ├── input.js.map
│   │       ├── input.tsx
│   │       ├── item.tsx
│   │       ├── kbd.tsx
│   │       ├── label.d.ts
│   │       ├── label.d.ts.map
│   │       ├── label.js
│   │       ├── label.js.map
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.d.ts
│   │       ├── scroll-area.d.ts.map
│   │       ├── scroll-area.js
│   │       ├── scroll-area.js.map
│   │       ├── scroll-area.tsx
│   │       ├── select.d.ts
│   │       ├── select.d.ts.map
│   │       ├── select.js
│   │       ├── select.js.map
│   │       ├── select.tsx
│   │       ├── separator.d.ts
│   │       ├── separator.d.ts.map
│   │       ├── separator.js
│   │       ├── separator.js.map
│   │       ├── separator.tsx
│   │       ├── sheet.d.ts
│   │       ├── sheet.d.ts.map
│   │       ├── sheet.js
│   │       ├── sheet.js.map
│   │       ├── sheet.tsx
│   │       ├── sidebar.d.ts
│   │       ├── sidebar.d.ts.map
│   │       ├── sidebar.js
│   │       ├── sidebar.js.map
│   │       ├── sidebar.tsx
│   │       ├── skeleton.d.ts
│   │       ├── skeleton.d.ts.map
│   │       ├── skeleton.js
│   │       ├── skeleton.js.map
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── spinner.tsx
│   │       ├── switch.tsx
│   │       ├── table.d.ts
│   │       ├── table.d.ts.map
│   │       ├── table.js
│   │       ├── table.js.map
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.d.ts
│   │       ├── tooltip.d.ts.map
│   │       ├── tooltip.js
│   │       ├── tooltip.js.map
│   │       └── tooltip.tsx
│   ├── hooks
│   │   ├── use-mobile.d.ts
│   │   ├── use-mobile.d.ts.map
│   │   ├── use-mobile.js
│   │   ├── use-mobile.js.map
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   ├── lib
│   │   ├── utils.d.ts
│   │   ├── utils.d.ts.map
│   │   ├── utils.js
│   │   ├── utils.js.map
│   │   └── utils.ts
│   ├── styles
│   │   └── globals.css
│   └── types
│       └── index.ts
├── postcss.config.mjs
├── public
│   └── mock
│       ├── piece-proof-1.svg
│       └── piece-proof-2.svg
├── src
│   ├── auth-kit
│   │   ├── components
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── OtpForm.tsx
│   │   │   ├── ResetPasswordForm.tsx
│   │   │   ├── SignIn2LoginForm.tsx
│   │   │   └── SignInForm.tsx
│   │   ├── context
│   │   │   ├── AuthKitProvider.tsx
│   │   │   ├── types.ts
│   │   │   └── useAuthKit.ts
│   │   ├── i18n
│   │   │   ├── defaults.ts
│   │   │   └── use-translation.ts
│   │   ├── icons
│   │   │   ├── BrandIcons.tsx
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   ├── pages
│   │   │   ├── ForgotPasswordPageContent.tsx
│   │   │   ├── OtpPageContent.tsx
│   │   │   ├── ResetPasswordPageContent.tsx
│   │   │   ├── SignIn2PageContent.tsx
│   │   │   └── SignInPageContent.tsx
│   │   └── utils
│   │       ├── index.ts
│   │       ├── sanitize-error.ts
│   │       ├── token.ts
│   │       └── validation.ts
│   ├── datatable-kit
│   │   ├── components
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTableBulkActions.tsx
│   │   │   ├── DataTableColumnHeader.tsx
│   │   │   ├── DataTableExcelActions.tsx
│   │   │   ├── DataTableFacetedFilter.tsx
│   │   │   ├── DataTablePagination.tsx
│   │   │   ├── DataTableToolbar.tsx
│   │   │   ├── DataTableViewOptions.tsx
│   │   │   └── SelectionColumn.tsx
│   │   ├── context
│   │   │   └── types.ts
│   │   ├── hooks
│   │   │   ├── useDataTableSync.ts
│   │   │   └── useTableUrlState.ts
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── utils
│   │       ├── excel.ts
│   │       └── get-page-numbers.ts
│   ├── errors-kit
│   │   ├── components
│   │   │   ├── ErrorRenderer.tsx
│   │   │   └── GlobalErrorBoundary.tsx
│   │   ├── context
│   │   │   ├── ErrorsKitProvider.tsx
│   │   │   ├── types.ts
│   │   │   └── useErrorHandler.ts
│   │   ├── handler
│   │   │   └── createErrorHandler.ts
│   │   └── index.ts
│   ├── externals.d.ts
│   ├── feedback-kit
│   │   ├── context
│   │   │   ├── FeedbackProvider.tsx
│   │   │   └── types.ts
│   │   └── index.ts
│   ├── file-kit
│   │   ├── components
│   │   │   ├── FileUploader.tsx
│   │   │   └── RHFFileUploader.tsx
│   │   ├── context
│   │   │   └── types.ts
│   │   ├── index.ts
│   │   └── utils
│   │       └── form-data.ts
│   ├── form-kit
│   │   ├── components
│   │   │   ├── FieldRenderer.tsx
│   │   │   ├── SchemaForm.tsx
│   │   │   └── WizardForm.tsx
│   │   ├── context
│   │   │   ├── FormKitProvider.tsx
│   │   │   └── types.ts
│   │   ├── hooks
│   │   │   ├── useAutoSave.ts
│   │   │   └── useSchemaForm.ts
│   │   ├── index.ts
│   │   └── utils
│   │       ├── buildSchema.ts
│   │       └── create-refine.ts
│   ├── index.ts
│   └── layout-kit
│       ├── components
│       │   ├── AppFooter.tsx
│       │   ├── AppHeader.tsx
│       │   ├── AppSidebar.tsx
│       │   ├── DashboardLayout.tsx
│       │   └── ThemeProvider.tsx
│       ├── context
│       │   ├── app-header-defaults-context.tsx
│       │   └── types.ts
│       ├── hooks
│       ├── index.ts
│       └── utils
│           ├── index.ts
│           └── navigation-examples.ts
├── tsconfig.build.json
├── tsconfig.build.tsbuildinfo
├── tsconfig.json
└── tsconfig.tsbuildinfo

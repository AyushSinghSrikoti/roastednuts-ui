<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Roasted Almonds form conventions

Apply these rules whenever creating or modifying forms in this frontend.

### Reuse and consistency

- Prefer a shared UI component when a control or behavior appears more than
  once. Do not duplicate select, loader, numeric-boundary, error-message, or
  required-marker implementations inside individual forms.
- Reuse the existing themed controls in `components/ui/` before creating a new
  form-specific control.
- Keep all controls consistent with the Roasted Almonds palette, border radius,
  spacing, focus ring, error state, and typography.
- A visible control must use `cursor-pointer` when it is clickable.

### Labels and required fields

- Mark required fields with a red `*` next to the label.
- Do not add `(optional)` to optional field labels. A field without the red
  required marker is optional.
- The visual required state and validation schema must agree.
- Use clear, domain-specific names. For example, use `Project environment
  label` when users may enter an arbitrary environment tag; do not call it a
  default environment selector.

### Selects and comboboxes

- Do not use native HTML `<select>` controls for themed product forms. Native
  option popups use operating-system colors and cannot be styled reliably.
- Use the shared `ThemedSelect` component for predefined choices.
- A required select must start with no value and display the placeholder
  `Select`; do not silently preselect the first or recommended option.
- The selected checkmark belongs after the option label, on the right.
- Dropdown options must display their complete labels without ellipsis.
- The dropdown panel must attach directly to its trigger without a visual gap.
- Use a creatable combobox when a user can either choose a suggestion or type a
  custom value.
- Remote option lists should expose loading, success, and failure states. Use
  the shared `InlineLoader` beside the field label during loading.
- When a safe fallback is specified, initialize and retain that fallback if the
  remote options request fails.
- If an option includes an icon URL, show a small icon in both the selected
  value and the dropdown row. Decorative option icons must have empty alt text.

### Validation and errors

- Define form validation in a Yup schema. UI constraints are not a substitute
  for schema validation.
- Validate the complete form on submission with `abortEarly: false` so every
  missing or invalid field receives an error.
- Show errors directly below their fields and apply the themed red error border
  to invalid controls.
- Validate interacted fields immediately or on blur as appropriate. Do not make
  users submit repeatedly to discover basic range or length errors.
- Do not disable the submit button solely because required fields are empty;
  users must be able to submit and reveal all validation errors.
- Use `noValidate` on forms that provide themed Yup errors, preventing native
  browser validation popups from replacing the product UI.
- Add `aria-invalid` to invalid controls and preserve accessible names,
  keyboard navigation, focus states, and combobox relationships.

### Numeric fields

- The HTML `min` and `max` attributes do not prevent out-of-range input. Use the
  shared `BoundedNumberInput` when a value must never leave a permitted range.
- Bounded integer inputs must reject negative syntax, decimal points, exponent
  notation, and plus signs, while still allowing an initially empty value.
- Keep Yup minimum and maximum values synchronized with the UI component's
  bounds.
- Do not prefill a numeric limit unless the product requirement explicitly asks
  for a default. For an initially empty field, communicate the limit through a
  placeholder such as `Maximum 1,000`.

### Async fields and backend data

- Fetch canonical option lists from the backend when the backend owns that
  vocabulary; do not maintain a competing hardcoded frontend list.
- API option types should include a stable value/slug and a display label.
  Include an icon URL only when the UI needs one.
- Async effects must ignore results after unmount and must always end their
  loading state.
- Failure states must be safe and usable. Do not leave a required control with
  a stale or misleading selection.

### Layout and actions

- Keep form-section navigation outside the main white form card when using the
  configuration-page layout.
- Avoid unnecessary nested bordered cards. Use one primary surface, spacing,
  and dividers unless a control is meaningfully independent.
- Do not place footer actions inside an extra bordered container unless the
  design explicitly calls for it.
- Place `Cancel` on the left with a visible border and the primary submit action
  on the right.
- Use direct action labels such as `Launch project`; avoid adding a review step
  to the label unless a distinct review screen actually exists.

### Project configuration specifics

- Platform options come from `GET /projects/platforms` and contain the platform
  name/slug and optional SVG icon URL.
- While platforms load, show `InlineLoader` immediately after the Platform
  label.
- If platform loading fails, keep `Other` available, but do not preselect it in
  a required select.
- `Project environment label` is optional and creatable: users can select a
  suggestion or enter their own value.
- Do not add a data-region field until data-region support exists in the
  product and backend.
- Current ingestion ranges are: events per minute `1..1000`, error events per
  minute `1..250`, and events per batch `1..100`.
- Project names are required and must contain between 3 and 64 characters.

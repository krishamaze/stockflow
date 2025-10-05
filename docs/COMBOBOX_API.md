# Cascading Autocomplete Combobox - API Reference

## Component: `CascadingCombobox`

A production-ready autocomplete combobox component with support for independent and cascading fields, fuzzy search, caching, and full accessibility.

### Import

```typescript
import { CascadingCombobox } from '@/components/ui/cascading-combobox';
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Accessible label for the combobox |
| `placeholder` | `string` | No | `"Select or type..."` | Placeholder text shown when no value is selected |
| `endpoint` | `string` | Yes | - | API endpoint URL for fetching options |
| `value` | `string` | Yes | - | Current selected value (controlled component) |
| `onChange` | `(value: string) => void` | Yes | - | Callback when value changes |
| `required` | `boolean` | No | `false` | Whether the field is required |
| `disabled` | `boolean` | No | `false` | Whether the field is disabled |
| `parentFilters` | `ParentFilters` | No | `{}` | Parent field values for cascading queries |
| `debounceMs` | `number` | No | `300` | Debounce delay in milliseconds |
| `minChars` | `number` | No | `2` | Minimum characters before triggering search |
| `validationRules` | `ValidationFunction` | No | - | Validation function or schema |
| `onError` | `ErrorCallback` | No | - | Error callback |
| `allowCustom` | `boolean` | No | `true` | Whether to allow custom values not in the list |
| `className` | `string` | No | - | Optional CSS class name |
| `id` | `string` | No | - | Optional ID for the input element |
| `name` | `string` | No | - | Optional name for the input element |
| `prefetch` | `boolean` | No | `false` | Whether to prefetch data on mount |

### Type Definitions

#### `ParentFilters`

```typescript
interface ParentFilters {
  [key: string]: string | number | boolean | null | undefined;
}
```

Object containing parent field values for cascading queries. Keys are filter names, values are filter values.

**Example:**
```typescript
parentFilters={{ brandId: '1', categoryId: '5' }}
```

#### `ValidationFunction`

```typescript
type ValidationFunction = (value: string) => boolean | string;
```

Function that validates the input value. Returns:
- `true` if valid
- `false` if invalid (shows generic error message)
- `string` if invalid (shows custom error message)

**Example:**
```typescript
validationRules={(value) => {
  if (value.length < 3) return 'Must be at least 3 characters';
  if (!/^[a-zA-Z]+$/.test(value)) return 'Only letters allowed';
  return true;
}}
```

#### `ErrorCallback`

```typescript
type ErrorCallback = (error: Error) => void;
```

Callback function called when an error occurs during data fetching.

**Example:**
```typescript
onError={(error) => {
  console.error('Failed to fetch data:', error);
  // Send to error tracking service
}}
```

### API Response Format

The component expects API endpoints to return data in the following format:

```typescript
interface ComboboxApiResponse {
  data: ComboboxOption[];
  etag?: string;
  total?: number;
}

interface ComboboxOption {
  value: string;
  label: string;
  metadata?: Record<string, unknown>;
}
```

**Example Response:**
```json
{
  "data": [
    { "value": "1", "label": "Nike" },
    { "value": "2", "label": "Adidas" },
    { "value": "3", "label": "Puma" }
  ],
  "etag": "\"abc123\"",
  "total": 3
}
```

### API Request Format

The component sends requests with the following query parameters:

- `q`: Search query (if user has typed)
- Any keys from `parentFilters` object

**Example Request:**
```
GET /api/models?q=air&brandId=1
```

### ETag Support

For optimal caching, API endpoints should:

1. Return an `ETag` header with each response
2. Support `If-None-Match` header in requests
3. Return `304 Not Modified` when content hasn't changed

**Example:**
```typescript
// In your API route
const etag = generateETag(data);
const ifNoneMatch = request.headers.get('If-None-Match');

if (ifNoneMatch === etag) {
  return new NextResponse(null, { status: 304 });
}

return NextResponse.json(response, {
  headers: { 'ETag': etag }
});
```

## Usage Examples

### Independent Field

```typescript
import { useState } from 'react';
import { CascadingCombobox } from '@/components/ui/cascading-combobox';

function ColorPicker() {
  const [color, setColor] = useState('');

  return (
    <CascadingCombobox
      label="Color"
      placeholder="Select or type a color..."
      endpoint="/api/colors"
      value={color}
      onChange={setColor}
      prefetch={true}
      required
    />
  );
}
```

### Cascading Fields (2-level)

```typescript
import { useState } from 'react';
import { CascadingCombobox } from '@/components/ui/cascading-combobox';

function ProductSelector() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  return (
    <>
      <CascadingCombobox
        label="Brand"
        endpoint="/api/brands"
        value={brand}
        onChange={setBrand}
        prefetch={true}
      />

      <CascadingCombobox
        label="Model"
        endpoint="/api/models"
        value={model}
        onChange={setModel}
        parentFilters={{ brandId: brand }}
      />
    </>
  );
}
```

### Cascading Fields (3-level)

```typescript
import { useState } from 'react';
import { CascadingCombobox } from '@/components/ui/cascading-combobox';

function DetailedProductSelector() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [modelNumber, setModelNumber] = useState('');

  return (
    <>
      <CascadingCombobox
        label="Brand"
        endpoint="/api/brands"
        value={brand}
        onChange={setBrand}
        prefetch={true}
      />

      <CascadingCombobox
        label="Model Name"
        endpoint="/api/models"
        value={model}
        onChange={setModel}
        parentFilters={{ brandId: brand }}
      />

      <CascadingCombobox
        label="Model Number"
        endpoint="/api/model-numbers"
        value={modelNumber}
        onChange={setModelNumber}
        parentFilters={{ brandId: brand, modelId: model }}
      />
    </>
  );
}
```

### With Validation

```typescript
<CascadingCombobox
  label="Username"
  endpoint="/api/users"
  value={username}
  onChange={setUsername}
  validationRules={(value) => {
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed';
    return true;
  }}
  required
/>
```

### With Error Handling

```typescript
<CascadingCombobox
  label="Category"
  endpoint="/api/categories"
  value={category}
  onChange={setCategory}
  onError={(error) => {
    console.error('Failed to load categories:', error);
    toast.error('Failed to load categories. Please try again.');
  }}
/>
```

### Custom Styling

```typescript
<CascadingCombobox
  label="Product"
  endpoint="/api/products"
  value={product}
  onChange={setProduct}
  className="max-w-md"
/>
```

## Keyboard Navigation

The component supports full keyboard navigation:

| Key | Action |
|-----|--------|
| `↓` (Arrow Down) | Move to next option or open dropdown |
| `↑` (Arrow Up) | Move to previous option |
| `Enter` | Select highlighted option or create custom value |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move to next field |

## Accessibility

The component is WCAG 2.1 AA compliant and includes:

- Proper ARIA labels and roles (`combobox`, `listbox`, `option`)
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Error state announcements
- Required field indicators

## Performance Considerations

### Prefetch vs. Lazy Loading

- **Prefetch** (`prefetch={true}`): Best for small datasets (<100 items) or frequently accessed data
- **Lazy Loading** (`prefetch={false}`): Best for large datasets or data that depends on parent selections

### Caching Strategy

The component uses aggressive caching with ETag validation:

- Cache TTL: 24 hours (configurable)
- Storage: sessionStorage (persists across page navigations)
- Revalidation: Background ETag checks
- Eviction: LRU (Least Recently Used)

### Debouncing

Default debounce is 300ms. Adjust based on your needs:

- **Lower** (100-200ms): More responsive, more API calls
- **Higher** (500-1000ms): Fewer API calls, less responsive

## Troubleshooting

### Options not loading

1. Check that the API endpoint is correct
2. Verify the API returns data in the correct format
3. Check browser console for errors
4. Ensure parent filters are satisfied (for cascading fields)

### Validation not working

1. Ensure `validationRules` function returns `boolean` or `string`
2. Check that validation triggers on blur
3. Verify `required` prop is set if field is required

### Cache not working

1. Check that API returns `ETag` header
2. Verify sessionStorage is available
3. Check browser console for cache errors
4. Try clearing cache manually

### Cascading not working

1. Ensure `parentFilters` object is correctly formatted
2. Verify parent field has a value before child field is enabled
3. Check that API endpoint accepts filter parameters
4. Confirm child field resets when parent changes


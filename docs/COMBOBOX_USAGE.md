# Cascading Autocomplete Combobox - Usage Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Common Patterns](#common-patterns)
3. [Integration with Forms](#integration-with-forms)
4. [Advanced Scenarios](#advanced-scenarios)
5. [Best Practices](#best-practices)
6. [Migration Guide](#migration-guide)

## Quick Start

### 1. Install Dependencies

The component requires the following dependencies (already included in the project):

```bash
npm install @radix-ui/react-popover @radix-ui/react-label fuse.js clsx tailwind-merge
```

### 2. Import the Component

```typescript
import { CascadingCombobox } from '@/components/ui/cascading-combobox';
```

### 3. Basic Usage

```typescript
import { useState } from 'react';

function MyForm() {
  const [value, setValue] = useState('');

  return (
    <CascadingCombobox
      label="Select Item"
      endpoint="/api/items"
      value={value}
      onChange={setValue}
    />
  );
}
```

## Common Patterns

### Pattern 1: Simple Dropdown (Prefetch)

Use this for small, static datasets that don't change often.

```typescript
function ColorSelector() {
  const [color, setColor] = useState('');

  return (
    <CascadingCombobox
      label="Color"
      placeholder="Choose a color..."
      endpoint="/api/colors"
      value={color}
      onChange={setColor}
      prefetch={true}  // Load all options on mount
      required
    />
  );
}
```

**When to use:**
- Dataset has <100 items
- Data doesn't change frequently
- Want instant search results

### Pattern 2: Search-as-you-type (Lazy Loading)

Use this for large datasets or dynamic data.

```typescript
function ProductSearch() {
  const [product, setProduct] = useState('');

  return (
    <CascadingCombobox
      label="Product"
      placeholder="Search products..."
      endpoint="/api/products"
      value={product}
      onChange={setProduct}
      prefetch={false}  // Only fetch when user types
      minChars={3}      // Require 3 characters before searching
      debounceMs={500}  // Wait 500ms after user stops typing
    />
  );
}
```

**When to use:**
- Dataset has >100 items
- Data changes frequently
- Want to reduce initial load time

### Pattern 3: Two-Level Cascade

Use this for parent-child relationships.

```typescript
function CategoryProductSelector() {
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');

  return (
    <div className="space-y-4">
      {/* Parent field */}
      <CascadingCombobox
        label="Category"
        endpoint="/api/categories"
        value={category}
        onChange={setCategory}
        prefetch={true}
      />

      {/* Child field - disabled until parent has value */}
      <CascadingCombobox
        label="Product"
        endpoint="/api/products"
        value={product}
        onChange={setProduct}
        parentFilters={{ categoryId: category }}
        // Will show "Select parent field first" when category is empty
      />
    </div>
  );
}
```

**When to use:**
- Child options depend on parent selection
- Want to guide user through a logical flow
- Need to filter options based on previous selections

### Pattern 4: Three-Level Cascade

Use this for complex hierarchies.

```typescript
function LocationSelector() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  return (
    <div className="space-y-4">
      <CascadingCombobox
        label="Country"
        endpoint="/api/countries"
        value={country}
        onChange={setCountry}
        prefetch={true}
      />

      <CascadingCombobox
        label="State/Province"
        endpoint="/api/states"
        value={state}
        onChange={setState}
        parentFilters={{ countryId: country }}
      />

      <CascadingCombobox
        label="City"
        endpoint="/api/cities"
        value={city}
        onChange={setCity}
        parentFilters={{ countryId: country, stateId: state }}
      />
    </div>
  );
}
```

## Integration with Forms

### React Hook Form

```typescript
import { useForm, Controller } from 'react-hook-form';

interface FormData {
  brand: string;
  model: string;
}

function ProductForm() {
  const { control, handleSubmit, watch } = useForm<FormData>();
  const brand = watch('brand');

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="brand"
        control={control}
        rules={{ required: 'Brand is required' }}
        render={({ field, fieldState }) => (
          <div>
            <CascadingCombobox
              label="Brand"
              endpoint="/api/brands"
              value={field.value}
              onChange={field.onChange}
              prefetch={true}
              required
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="model"
        control={control}
        rules={{ required: 'Model is required' }}
        render={({ field, fieldState }) => (
          <div>
            <CascadingCombobox
              label="Model"
              endpoint="/api/models"
              value={field.value}
              onChange={field.onChange}
              parentFilters={{ brandId: brand }}
              required
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Formik

```typescript
import { Formik, Form, Field } from 'formik';

function ProductForm() {
  return (
    <Formik
      initialValues={{ brand: '', model: '' }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Field name="brand">
            {({ field, meta }) => (
              <div>
                <CascadingCombobox
                  label="Brand"
                  endpoint="/api/brands"
                  value={field.value}
                  onChange={(value) => setFieldValue('brand', value)}
                  prefetch={true}
                />
                {meta.touched && meta.error && (
                  <p className="text-sm text-red-500">{meta.error}</p>
                )}
              </div>
            )}
          </Field>

          <Field name="model">
            {({ field, meta }) => (
              <div>
                <CascadingCombobox
                  label="Model"
                  endpoint="/api/models"
                  value={field.value}
                  onChange={(value) => setFieldValue('model', value)}
                  parentFilters={{ brandId: values.brand }}
                />
                {meta.touched && meta.error && (
                  <p className="text-sm text-red-500">{meta.error}</p>
                )}
              </div>
            )}
          </Field>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
```

## Advanced Scenarios

### Custom Validation

```typescript
function EmailDomainSelector() {
  const [domain, setDomain] = useState('');

  return (
    <CascadingCombobox
      label="Email Domain"
      endpoint="/api/domains"
      value={domain}
      onChange={setDomain}
      validationRules={(value) => {
        // Must be a valid domain format
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(value)) {
          return 'Please enter a valid domain (e.g., example.com)';
        }
        return true;
      }}
      allowCustom={true}
    />
  );
}
```

### Error Handling with Toast Notifications

```typescript
import { toast } from 'sonner'; // or your preferred toast library

function RobustSelector() {
  const [value, setValue] = useState('');

  return (
    <CascadingCombobox
      label="Item"
      endpoint="/api/items"
      value={value}
      onChange={setValue}
      onError={(error) => {
        console.error('API Error:', error);
        toast.error('Failed to load items. Please try again.');
      }}
    />
  );
}
```

### Conditional Cascading

```typescript
function ConditionalCascade() {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');

  // Different endpoints based on type
  const categoryEndpoint = type === 'product' 
    ? '/api/product-categories' 
    : '/api/service-categories';

  return (
    <>
      <CascadingCombobox
        label="Type"
        endpoint="/api/types"
        value={type}
        onChange={setType}
        prefetch={true}
      />

      <CascadingCombobox
        label="Category"
        endpoint={categoryEndpoint}
        value={category}
        onChange={setCategory}
        parentFilters={{ type }}
      />

      <CascadingCombobox
        label="Item"
        endpoint="/api/items"
        value={item}
        onChange={setItem}
        parentFilters={{ type, categoryId: category }}
      />
    </>
  );
}
```

## Best Practices

### 1. Choose the Right Fetch Strategy

```typescript
// ✅ Good: Prefetch for small, static data
<CascadingCombobox endpoint="/api/colors" prefetch={true} />

// ✅ Good: Lazy load for large, dynamic data
<CascadingCombobox endpoint="/api/products" prefetch={false} minChars={3} />

// ❌ Bad: Prefetching large datasets
<CascadingCombobox endpoint="/api/all-products" prefetch={true} /> // 10,000+ items
```

### 2. Set Appropriate Debounce Times

```typescript
// ✅ Good: Fast local API
<CascadingCombobox debounceMs={200} />

// ✅ Good: Slow external API
<CascadingCombobox debounceMs={500} />

// ❌ Bad: Too fast (hammers the API)
<CascadingCombobox debounceMs={50} />

// ❌ Bad: Too slow (feels unresponsive)
<CascadingCombobox debounceMs={2000} />
```

### 3. Handle Parent Changes Properly

```typescript
// ✅ Good: Component automatically resets child fields
function GoodExample() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  return (
    <>
      <CascadingCombobox value={brand} onChange={setBrand} />
      <CascadingCombobox 
        value={model} 
        onChange={setModel}
        parentFilters={{ brandId: brand }}
        // Automatically resets when brand changes
      />
    </>
  );
}
```

### 4. Provide Clear Labels and Placeholders

```typescript
// ✅ Good: Clear, descriptive labels
<CascadingCombobox 
  label="Product Brand" 
  placeholder="Select or search for a brand..."
/>

// ❌ Bad: Vague labels
<CascadingCombobox 
  label="Item" 
  placeholder="Select..."
/>
```

### 5. Use Validation Appropriately

```typescript
// ✅ Good: Validate format and business rules
<CascadingCombobox
  validationRules={(value) => {
    if (value.length < 2) return 'Too short';
    if (bannedWords.includes(value)) return 'Invalid value';
    return true;
  }}
/>

// ❌ Bad: Overly complex validation
<CascadingCombobox
  validationRules={(value) => {
    // Don't do async validation here
    // Don't make API calls here
    // Keep it simple and synchronous
  }}
/>
```

## Migration Guide

### From Native Select

```typescript
// Before
<select value={value} onChange={(e) => setValue(e.target.value)}>
  <option value="">Select...</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>

// After
<CascadingCombobox
  label="Select Option"
  endpoint="/api/options"
  value={value}
  onChange={setValue}
  prefetch={true}
/>
```

### From React Select

```typescript
// Before
<Select
  options={options}
  value={options.find(o => o.value === value)}
  onChange={(option) => setValue(option?.value || '')}
/>

// After
<CascadingCombobox
  label="Select Option"
  endpoint="/api/options"
  value={value}
  onChange={setValue}
  prefetch={true}
/>
```

## Troubleshooting

See [API Reference](./COMBOBOX_API.md#troubleshooting) for detailed troubleshooting steps.


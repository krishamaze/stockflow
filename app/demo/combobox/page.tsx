"use client";

/**
 * Demo page for the Cascading Autocomplete Combobox component
 * Showcases independent fields, cascading fields, and custom value creation
 */

import React, { useState } from 'react';
import { CascadingCombobox } from '@/components/ui/cascading-combobox';
import { DebugPanel } from '@/components/debug/debug-panel';

export default function ComboboxDemoPage() {
  // Independent field example
  const [color, setColor] = useState('');

  // Cascading fields example (Brand → Model → Model Number)
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [modelNumber, setModelNumber] = useState('');

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      color,
      brand,
      model,
      modelNumber,
    });
    alert('Form submitted! Check console for values.');
  };

  // Reset form
  const handleReset = () => {
    setColor('');
    setBrand('');
    setModel('');
    setModelNumber('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cascading Autocomplete Combobox</h1>
          <p className="text-muted-foreground">
            Production-ready autocomplete component with fuzzy search, caching, and accessibility
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Form */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Demo Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Independent Field Example */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-primary">
                    Independent Field Example
                  </h3>
                  <CascadingCombobox
                    label="Color"
                    placeholder="Select or type a color..."
                    endpoint="/api/colors"
                    value={color}
                    onChange={setColor}
                    prefetch={true}
                    required
                    id="color-field"
                    name="color"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    This field has no dependencies and prefetches all options on mount.
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-medium mb-3 text-primary">
                    Cascading Fields Example
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    These fields demonstrate parent-child dependencies. Child fields are disabled
                    until their parent has a value.
                  </p>

                  <div className="space-y-4">
                    {/* Brand (Parent) */}
                    <CascadingCombobox
                      label="Brand"
                      placeholder="Select or type a brand..."
                      endpoint="/api/brands"
                      value={brand}
                      onChange={setBrand}
                      prefetch={true}
                      required
                      id="brand-field"
                      name="brand"
                    />

                    {/* Model (Child of Brand) */}
                    <CascadingCombobox
                      label="Model Name"
                      placeholder="Select or type a model..."
                      endpoint="/api/models"
                      value={model}
                      onChange={setModel}
                      parentFilters={{ brandId: brand }}
                      required
                      id="model-field"
                      name="model"
                    />

                    {/* Model Number (Child of Brand and Model) */}
                    <CascadingCombobox
                      label="Model Number"
                      placeholder="Select or type a model number..."
                      endpoint="/api/model-numbers"
                      value={modelNumber}
                      onChange={setModelNumber}
                      parentFilters={{ brandId: brand, modelId: model }}
                      required
                      id="model-number-field"
                      name="modelNumber"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Features List */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Fuzzy search with match highlighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>ETag-based caching with sessionStorage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Debounced API calls (300ms default)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Full keyboard navigation (Arrow keys, Enter, Escape, Tab)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>WCAG 2.1 AA accessibility compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Cascading dependencies with automatic reset</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Custom value creation (when no matches found)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Loading states and error handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Validation with on-blur timing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Request cancellation with AbortController</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Debug Panel */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <DebugPanel
              values={{
                color,
                brand,
                model,
                modelNumber,
              }}
            />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Independent Field</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`<CascadingCombobox
  label="Color"
  placeholder="Select or type a color..."
  endpoint="/api/colors"
  value={color}
  onChange={setColor}
  prefetch={true}
  required
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Cascading Fields</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`// Parent field
<CascadingCombobox
  label="Brand"
  endpoint="/api/brands"
  value={brand}
  onChange={setBrand}
  prefetch={true}
/>

// Child field (depends on brand)
<CascadingCombobox
  label="Model"
  endpoint="/api/models"
  value={model}
  onChange={setModel}
  parentFilters={{ brandId: brand }}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


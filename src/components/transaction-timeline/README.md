# Transaction Timeline Component

A modern, responsive transaction timeline component that displays user transactions in chronological order with a clean, card-based design.

## Features

- **Timeline Layout**: Vertical timeline with connecting lines and circular icons
- **Transaction Types**: Support for Rent, Buy, and Sell transactions with appropriate icons
- **Context Information**: Shows related Unit or Project information
- **Time Filtering**: Day, Week, and Month view toggles
- **Anomaly Detection**: Visual indicator for transactions with anomalies
- **Responsive Design**: Adapts to different screen sizes
- **Material-UI Integration**: Built with Material-UI components and theming

## Design Elements

### Layout Structure
- **Container**: Card-like Paper component with padding and rounded corners
- **Header**: Title and view switcher (Day/Week/Month)
- **Timeline**: Vertical line connecting transaction icons
- **Transaction Items**: Alternating background colors for readability

### Visual Style
- **Clean & Minimal**: Light gray and white alternating backgrounds
- **Consistent Spacing**: Generous padding and spacing between entries
- **Iconography**: Intuitive icons (home, cart, business) for transaction types
- **Typography**: Clear hierarchy with bold titles and muted secondary text

## Usage

```tsx
import TransactionTimeline from 'src/components/transaction-timeline';

const transactions = [
  {
    id: 1,
    type: 'Rent',
    title: 'Monthly Rent Payment',
    relatedToType: 'Unit',
    relatedTo: 'EF1 - Izki Project',
    relatedToId: 1,
    date: '2025-09-11T10:05:00Z',
    hasAnomaly: false
  }
];

<TransactionTimeline
  transactions={transactions}
  filter="day"
  onFilterChange={(filter) => setFilter(filter)}
  loading={false}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `transactions` | `Transaction[]` | Array of transaction objects to display |
| `filter` | `'day' \| 'week' \| 'month'` | Current time filter selection |
| `onFilterChange` | `(filter: 'day' \| 'week' \| 'month') => void` | Callback when filter changes |
| `loading` | `boolean` | Whether the component is in loading state |

## Transaction Interface

```tsx
interface Transaction {
  id: number;
  type: 'Rent' | 'Buy' | 'Sell';
  title: string;
  relatedToType: 'Unit' | 'Project';
  relatedTo: string;
  relatedToId: number;
  date: string;
  hasAnomaly?: boolean;
}
```

## Styling

The component uses Material-UI's theming system and can be customized through:
- Theme overrides
- Custom CSS classes
- Component prop styling

## Accessibility

- Proper ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly structure
- High contrast color scheme

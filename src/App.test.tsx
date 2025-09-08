import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders disaster prediction dashboard', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
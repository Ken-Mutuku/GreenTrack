import { render, screen } from '@testing-library/react';
import App from '../src/App'; // path 

describe('App Component', () => {
  it('renders the App component successfully', () => {
    render(<App />);

    // Look for the main hero heading
    const heading = screen.getByRole('heading', {
      name: /transparent fresh produce supply chains/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

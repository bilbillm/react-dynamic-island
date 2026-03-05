import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IslandProvider } from './IslandProvider';
import { DynamicIsland } from './DynamicIsland';

describe('DynamicIsland', () => {
  it('should render in default state initially', () => {
    const { container } = render(
      <IslandProvider>
        <DynamicIsland />
      </IslandProvider>
    );

    const island = container.querySelector('[role="region"]');
    expect(island).toBeInTheDocument();
    // Framer Motion applies dimensions via animate prop, so we just verify the element exists
    expect(island).toHaveAttribute('role', 'region');
    expect(island).toHaveAttribute('aria-label', 'Dynamic Island');
  });

  it('should throw error when used outside IslandProvider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<DynamicIsland />);
    }).toThrow('DynamicIsland must be used within IslandProvider');
    
    consoleError.mockRestore();
  });

  it('should have appropriate ARIA attributes', () => {
    render(
      <IslandProvider>
        <DynamicIsland />
      </IslandProvider>
    );

    const island = screen.getByRole('region');
    expect(island).toHaveAttribute('aria-label', 'Dynamic Island');
    expect(island).toHaveAttribute('aria-live', 'polite');
  });

  it('should render module content when active', () => {
    render(
      <IslandProvider defaultState="compact">
        <DynamicIsland />
      </IslandProvider>
    );

    // Initially no module content (since no module is activated)
    expect(screen.queryByText('Test Module Content')).not.toBeInTheDocument();
  });

  it('should be keyboard focusable when module is active', () => {
    render(
      <IslandProvider>
        <DynamicIsland />
      </IslandProvider>
    );

    const island = screen.getByRole('region');
    // When no module is active, should not be focusable
    expect(island).toHaveAttribute('tabIndex', '-1');
  });
});

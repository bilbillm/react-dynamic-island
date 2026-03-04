import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastModule } from './ToastModule';

describe('ToastModule', () => {
  it('should render message in compact state', () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Test message"
        variant="info"
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should truncate message to 30 characters', () => {
    const onDismiss = vi.fn();
    const longMessage = 'This is a very long message that exceeds thirty characters';
    
    render(
      <ToastModule
        state="compact"
        message={longMessage}
        variant="info"
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText(/This is a very long message th\.\.\./)).toBeInTheDocument();
  });

  it('should display correct icon for success variant', () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Success"
        variant="success"
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should display correct icon for error variant', () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Error"
        variant="error"
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('should display correct icon for warning variant', () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Warning"
        variant="warning"
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('should display correct icon for info variant', () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Info"
        variant="info"
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('should auto-dismiss after default duration (3000ms)', async () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Auto dismiss"
        variant="info"
        onDismiss={onDismiss}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    }, { timeout: 3500 });
  });

  it('should auto-dismiss after custom duration', async () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Custom duration"
        variant="info"
        duration={1000}
        onDismiss={onDismiss}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });

  it('should support custom icon', () => {
    const onDismiss = vi.fn();
    const customIcon = <span data-testid="custom-icon">🎉</span>;
    
    render(
      <ToastModule
        state="compact"
        message="Custom icon"
        variant="info"
        icon={customIcon}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should have appropriate ARIA attributes', () => {
    const onDismiss = vi.fn();
    
    render(
      <ToastModule
        state="compact"
        message="Accessible toast"
        variant="success"
        onDismiss={onDismiss}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-label', 'success notification: Accessible toast');
  });

  it('should return null for non-compact states', () => {
    const onDismiss = vi.fn();
    
    const { container } = render(
      <ToastModule
        state="default"
        message="Should not render"
        variant="info"
        onDismiss={onDismiss}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MagicRings } from './MagicRings';

describe('MagicRings Component from React Bits', () => {
  it('renders canvas element safely even when WebGL2 context is unavailable in JSDOM', () => {
    const { container } = render(
      <MagicRings
        color="#A855F7"
        colorTwo="#6366F1"
        motion="pulse"
        ringCount={6}
        speed={1}
        className="test-magic-rings"
      />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('magic-rings__canvas');
  });

  it('applies custom className and style props to the outer container', () => {
    const { container } = render(
      <MagicRings
        className="custom-ring-wrapper"
        style={{ width: '100%', height: '300px' }}
      />
    );
    const wrapper = container.querySelector('.magic-rings');
    expect(wrapper).toHaveClass('custom-ring-wrapper');
    expect(wrapper).toHaveStyle({ height: '300px' });
  });
});

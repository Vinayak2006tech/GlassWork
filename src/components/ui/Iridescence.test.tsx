import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Iridescence } from './Iridescence';

describe('Iridescence Component', () => {
  it('renders canvas element safely even when WebGL2 context is mocked/unavailable in JSDOM', () => {
    const { container } = render(
      <Iridescence
        color="#8099cc"
        speed={1.5}
        scale={1}
        className="test-iridescence"
      />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('iridescence-canvas');
  });
});

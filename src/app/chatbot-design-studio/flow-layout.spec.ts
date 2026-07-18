import { calculateFlowLayout, FlowLayoutNode } from './flow-layout';

const node = (id: string, x = 20, y = 30): FlowLayoutNode => ({
  id,
  width: 240,
  height: 120,
  position: { x, y }
});

describe('calculateFlowLayout', () => {
  it('organizes a branching flow from left to right without overlaps', () => {
    const nodes = [node('start'), node('menu'), node('sales'), node('support')];
    const result = calculateFlowLayout(
      nodes,
      [
        { from: 'start', to: 'menu' },
        { from: 'menu', to: 'sales' },
        { from: 'menu', to: 'support' }
      ],
      'start'
    );

    expect(result.positions.start.x).toBeLessThan(result.positions.menu.x);
    expect(result.positions.menu.x).toBeLessThan(result.positions.sales.x);
    expect(result.positions.sales.y).not.toBe(result.positions.support.y);
    expect(result.disconnectedCount).toBe(0);
    expect(result.unlinkedCount).toBe(0);
  });

  it('places blocks outside the main flow in a separate area', () => {
    const nodes = [node('start'), node('main'), node('detached-a'), node('detached-b'), node('isolated')];
    const result = calculateFlowLayout(
      nodes,
      [
        { from: 'start', to: 'main' },
        { from: 'detached-a', to: 'detached-b' }
      ],
      'start'
    );

    const mainBottom = Math.max(result.positions.start.y + 120, result.positions.main.y + 120);
    expect(result.positions['detached-a'].y).toBeGreaterThan(mainBottom);
    expect(result.positions.isolated.y).toBeGreaterThan(mainBottom);
    expect(result.disconnectedCount).toBe(3);
    expect(result.unlinkedCount).toBe(1);
  });

  it('ignores duplicate, missing and self-referencing edges', () => {
    const nodes = [node('start'), node('next')];
    const result = calculateFlowLayout(
      nodes,
      [
        { from: 'start', to: 'next' },
        { from: 'start', to: 'next' },
        { from: 'start', to: 'missing' },
        { from: 'next', to: 'next' }
      ],
      'start'
    );

    expect(Object.keys(result.positions)).toEqual(['start', 'next']);
    expect(result.disconnectedCount).toBe(0);
    expect(result.unlinkedCount).toBe(0);
  });
});

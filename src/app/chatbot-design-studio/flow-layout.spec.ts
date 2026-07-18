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

  it('places blocks outside the main flow in a grid to its right', () => {
    const nodes = [
      node('start'),
      node('main'),
      node('detached-a'),
      node('detached-b'),
      node('isolated')
    ];
    const result = calculateFlowLayout(
      nodes,
      [
        { from: 'start', to: 'main' },
        { from: 'detached-a', to: 'detached-b' }
      ],
      'start'
    );

    const mainRight = Math.max(result.positions.start.x + 240, result.positions.main.x + 240);
    expect(result.positions['detached-a'].x).toBeGreaterThan(mainRight);
    expect(result.positions.isolated.x).toBeGreaterThan(mainRight);
    expect(new Set([
      result.positions['detached-a'].y,
      result.positions['detached-b'].y,
      result.positions.isolated.y
    ]).size).toBe(2);
    expect(result.disconnectedCount).toBe(3);
    expect(result.unlinkedCount).toBe(1);
  });

  it('caps a large disconnected grid at six rows', () => {
    const detachedNodes = Array.from({ length: 37 }, (_, index) => node(`detached-${index}`));
    const result = calculateFlowLayout(
      [node('start'), ...detachedNodes],
      [],
      'start'
    );
    const detachedPositions = detachedNodes.map(({ id }) => result.positions[id]);

    expect(new Set(detachedPositions.map(({ y }) => y)).size).toBe(6);
    expect(new Set(detachedPositions.map(({ x }) => x)).size).toBe(7);
    expect(
      detachedPositions.every(({ x }) => x > result.positions.start.x + 240)
    ).toBeTrue();
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

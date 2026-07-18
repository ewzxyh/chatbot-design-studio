import * as dagre from '@dagrejs/dagre';

export interface FlowLayoutPosition {
  x: number;
  y: number;
}

export interface FlowLayoutNode {
  id: string;
  width: number;
  height: number;
  position: FlowLayoutPosition;
}

export interface FlowLayoutEdge {
  from: string;
  to: string;
}

export interface FlowLayoutResult {
  positions: Record<string, FlowLayoutPosition>;
  disconnectedCount: number;
  unlinkedCount: number;
}

interface GroupLayoutResult {
  positions: Record<string, FlowLayoutPosition>;
  width: number;
  height: number;
}

const HORIZONTAL_GAP = 96;
const VERTICAL_GAP = 48;
const DISCONNECTED_AREA_GAP = 180;

export const calculateFlowLayout = (
  nodes: FlowLayoutNode[],
  edges: FlowLayoutEdge[],
  rootId?: string
): FlowLayoutResult => {
  if (nodes.length === 0) {
    return { positions: {}, disconnectedCount: 0, unlinkedCount: 0 };
  }

  const uniqueNodes = Array.from(new Map(nodes.map((node) => [node.id, node])).values());
  const nodeIds = new Set(uniqueNodes.map((node) => node.id));
  const validEdges = uniqueEdges(edges, nodeIds);
  const adjacency = buildAdjacency(nodeIds, validEdges);
  const resolvedRootId = rootId && nodeIds.has(rootId) ? rootId : uniqueNodes[0].id;
  const mainNodeIds = findConnectedNodeIds(resolvedRootId, adjacency);
  const mainNodes = uniqueNodes.filter((node) => mainNodeIds.has(node.id));
  const disconnectedNodes = uniqueNodes.filter((node) => !mainNodeIds.has(node.id));
  const origin = getOrigin(uniqueNodes);
  const mainLayout = layoutGroup(mainNodes, validEdges, origin);
  const positions = { ...mainLayout.positions };

  if (disconnectedNodes.length > 0) {
    const disconnectedOrigin = {
      x: origin.x + mainLayout.width + DISCONNECTED_AREA_GAP,
      y: origin.y
    };
    const disconnectedLayout = layoutGrid(disconnectedNodes, disconnectedOrigin);
    Object.assign(positions, disconnectedLayout.positions);
  }

  const unlinkedCount = uniqueNodes.filter((node) => adjacency.get(node.id).size === 0).length;

  return {
    positions,
    disconnectedCount: disconnectedNodes.length,
    unlinkedCount
  };
};

const uniqueEdges = (edges: FlowLayoutEdge[], nodeIds: Set<string>): FlowLayoutEdge[] => {
  const seen = new Set<string>();

  return edges.filter((edge) => {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to) || edge.from === edge.to) {
      return false;
    }
    const key = `${edge.from}/${edge.to}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const buildAdjacency = (
  nodeIds: Set<string>,
  edges: FlowLayoutEdge[]
): Map<string, Set<string>> => {
  const adjacency = new Map<string, Set<string>>();
  for (const nodeId of nodeIds) {
    adjacency.set(nodeId, new Set<string>());
  }
  for (const edge of edges) {
    adjacency.get(edge.from).add(edge.to);
    adjacency.get(edge.to).add(edge.from);
  }
  return adjacency;
};

const findConnectedNodeIds = (
  rootId: string,
  adjacency: Map<string, Set<string>>
): Set<string> => {
  const connectedNodeIds = new Set<string>([rootId]);
  const pendingNodeIds = [rootId];

  while (pendingNodeIds.length > 0) {
    const nodeId = pendingNodeIds.shift();
    for (const neighborId of adjacency.get(nodeId) ?? []) {
      if (!connectedNodeIds.has(neighborId)) {
        connectedNodeIds.add(neighborId);
        pendingNodeIds.push(neighborId);
      }
    }
  }

  return connectedNodeIds;
};

const getOrigin = (nodes: FlowLayoutNode[]): FlowLayoutPosition => ({
  x: Math.min(...nodes.map((node) => node.position?.x ?? 0)),
  y: Math.min(...nodes.map((node) => node.position?.y ?? 0))
});

const layoutGrid = (
  nodes: FlowLayoutNode[],
  origin: FlowLayoutPosition
): GroupLayoutResult => {
  const rowCount = Math.min(6, Math.ceil(Math.sqrt(nodes.length)));
  const columnCount = Math.ceil(nodes.length / rowCount);
  const maxWidth = Math.max(...nodes.map((node) => node.width));
  const maxHeight = Math.max(...nodes.map((node) => node.height));
  const positions: Record<string, FlowLayoutPosition> = {};

  for (const [index, node] of nodes.entries()) {
    const column = Math.floor(index / rowCount);
    const row = index % rowCount;
    positions[node.id] = {
      x: origin.x + column * (maxWidth + HORIZONTAL_GAP),
      y: origin.y + row * (maxHeight + VERTICAL_GAP)
    };
  }

  return {
    positions,
    width: columnCount * maxWidth + Math.max(0, columnCount - 1) * HORIZONTAL_GAP,
    height: rowCount * maxHeight + Math.max(0, rowCount - 1) * VERTICAL_GAP
  };
};

const layoutGroup = (
  nodes: FlowLayoutNode[],
  edges: FlowLayoutEdge[],
  origin: FlowLayoutPosition
): GroupLayoutResult => {
  if (nodes.length === 0) {
    return { positions: {}, width: 0, height: 0 };
  }

  const groupNodeIds = new Set(nodes.map((node) => node.id));
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({
    rankdir: 'LR',
    ranker: 'network-simplex',
    acyclicer: 'greedy',
    ranksep: HORIZONTAL_GAP,
    nodesep: VERTICAL_GAP,
    marginx: 0,
    marginy: 0
  });
  graph.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    graph.setNode(node.id, {
      width: Math.max(1, node.width),
      height: Math.max(1, node.height)
    });
  }
  for (const edge of edges) {
    if (groupNodeIds.has(edge.from) && groupNodeIds.has(edge.to)) {
      graph.setEdge(edge.from, edge.to);
    }
  }

  dagre.layout(graph);

  const graphNodes = nodes.map((node) => ({ node, layout: graph.node(node.id) }));
  const minLeft = Math.min(...graphNodes.map(({ node, layout }) => layout.x - node.width / 2));
  const minTop = Math.min(...graphNodes.map(({ node, layout }) => layout.y - node.height / 2));
  const maxRight = Math.max(...graphNodes.map(({ node, layout }) => layout.x + node.width / 2));
  const maxBottom = Math.max(...graphNodes.map(({ node, layout }) => layout.y + node.height / 2));
  const positions: Record<string, FlowLayoutPosition> = {};

  for (const { node, layout } of graphNodes) {
    positions[node.id] = {
      x: Math.round(origin.x + layout.x - node.width / 2 - minLeft),
      y: Math.round(origin.y + layout.y - node.height / 2 - minTop)
    };
  }

  return {
    positions,
    width: Math.ceil(maxRight - minLeft),
    height: Math.ceil(maxBottom - minTop)
  };
};

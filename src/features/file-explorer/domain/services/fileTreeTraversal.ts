import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";

export interface TreeSearchResult {
  matchIds: Set<string>;
  expandIds: Set<string>;
}

export function flattenVisibleTree(
  nodes: FileNode[],
  expandedIds: Set<string>
): FileNode[] {
  const result: FileNode[] = [];

  for (const node of nodes) {
    result.push(node);

    if (node.type === "folder" && expandedIds.has(node.id) && node.children) {
      result.push(...flattenVisibleTree(node.children, expandedIds));
    }
  }

  return result;
}

export function getNodePath(
  nodes: FileNode[],
  targetId: string,
  currentPath: string[] = []
): string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return [...currentPath, node.name];
    }

    if (node.children) {
      const foundPath = getNodePath(node.children, targetId, [
        ...currentPath,
        node.name,
      ]);

      if (foundPath) {
        return foundPath;
      }
    }
  }

  return null;
}

export function searchTree(nodes: FileNode[], query: string): TreeSearchResult {
  const matchIds = new Set<string>();
  const expandIds = new Set<string>();
  const normalizedQuery = query.toLowerCase();

  function walk(node: FileNode): boolean {
    const nameMatch = node.name.toLowerCase().includes(normalizedQuery);
    let childMatch = false;

    if (node.children) {
      for (const child of node.children) {
        if (walk(child)) {
          childMatch = true;
        }
      }
    }

    if (nameMatch) {
      matchIds.add(node.id);
    }

    if (childMatch && node.type === "folder") {
      expandIds.add(node.id);
    }

    return nameMatch || childMatch;
  }

  for (const node of nodes) {
    walk(node);
  }

  return { matchIds, expandIds };
}

export function filterTreeByQuery(nodes: FileNode[], query: string): FileNode[] {
  const normalizedQuery = query.toLowerCase();

  function filterNode(node: FileNode): FileNode | null {
    const nameMatch = node.name.toLowerCase().includes(normalizedQuery);

    if (node.type === "file") {
      return nameMatch ? node : null;
    }

    const filteredChildren =
      node.children
        ?.map((child) => filterNode(child))
        .filter((child): child is FileNode => child !== null) ?? [];

    if (nameMatch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }

  return nodes
    .map((node) => filterNode(node))
    .filter((node): node is FileNode => node !== null);
}

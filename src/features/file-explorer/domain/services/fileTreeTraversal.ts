import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";

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

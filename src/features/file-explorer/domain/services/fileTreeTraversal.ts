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

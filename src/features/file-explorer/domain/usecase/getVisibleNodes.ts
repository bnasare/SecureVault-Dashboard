import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { flattenVisibleTree } from "@/features/file-explorer/domain/services/fileTreeTraversal";

export function getVisibleNodes(
  nodes: FileNode[],
  expandedIds: Set<string>
): FileNode[] {
  return flattenVisibleTree(nodes, expandedIds);
}

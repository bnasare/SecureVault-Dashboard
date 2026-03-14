import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { getNodePath as resolveNodePath } from "@/features/file-explorer/domain/services/fileTreeTraversal";

export function getNodePath(nodes: FileNode[], targetId: string): string[] | null {
  return resolveNodePath(nodes, targetId);
}

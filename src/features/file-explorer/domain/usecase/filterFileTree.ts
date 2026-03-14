import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { filterTreeByQuery } from "@/features/file-explorer/domain/services/fileTreeTraversal";

export function filterFileTree(nodes: FileNode[], query: string): FileNode[] {
  return filterTreeByQuery(nodes, query);
}

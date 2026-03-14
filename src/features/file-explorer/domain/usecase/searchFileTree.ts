import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { searchTree, TreeSearchResult } from "@/features/file-explorer/domain/services/fileTreeTraversal";

export function searchFileTree(nodes: FileNode[], query: string): TreeSearchResult {
  return searchTree(nodes, query);
}

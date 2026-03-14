import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { FileTreeRepository } from "@/features/file-explorer/domain/repository/FileTreeRepository";

export function getFileTree(repository: FileTreeRepository): FileNode[] {
  return repository.getTree();
}

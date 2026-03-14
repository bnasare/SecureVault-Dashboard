import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";

export interface FileTreeRepository {
  getTree(): FileNode[];
}

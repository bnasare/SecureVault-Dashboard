import fileData from "@/features/file-explorer/data/database/fileData.json";
import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { FileTreeRepository } from "@/features/file-explorer/domain/repository/FileTreeRepository";

class StaticFileTreeRepository implements FileTreeRepository {
  getTree(): FileNode[] {
    return fileData as FileNode[];
  }
}

export const staticFileTreeRepository = new StaticFileTreeRepository();

import { describe, expect, it } from "vitest";
import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { FileTreeRepository } from "@/features/file-explorer/domain/repository/FileTreeRepository";
import { getFileTree } from "@/features/file-explorer/domain/usecase/getFileTree";
import { getVisibleNodes } from "@/features/file-explorer/domain/usecase/getVisibleNodes";
import { getNodePath } from "@/features/file-explorer/domain/usecase/getNodePath";
import { searchFileTree } from "@/features/file-explorer/domain/usecase/searchFileTree";
import { filterFileTree } from "@/features/file-explorer/domain/usecase/filterFileTree";

const usecaseTree: FileNode[] = [
  {
    id: "root",
    name: "RootFolder",
    type: "folder",
    children: [{ id: "child-file", name: "alpha.txt", type: "file", size: "2KB" }],
  },
];

class InMemoryRepository implements FileTreeRepository {
  getTree(): FileNode[] {
    return usecaseTree;
  }
}

describe("file explorer usecases", () => {
  it("getFileTree returns repository data", () => {
    const repository = new InMemoryRepository();

    expect(getFileTree(repository)).toEqual(usecaseTree);
  });

  it("getVisibleNodes delegates flattening behavior", () => {
    const result = getVisibleNodes(usecaseTree, new Set(["root"]));

    expect(result.map((node) => node.id)).toEqual(["root", "child-file"]);
  });

  it("getNodePath returns breadcrumb segments", () => {
    expect(getNodePath(usecaseTree, "child-file")).toEqual(["RootFolder", "alpha.txt"]);
  });

  it("searchFileTree returns match and expand ids", () => {
    const result = searchFileTree(usecaseTree, "alpha");

    expect(result.matchIds.has("child-file")).toBe(true);
    expect(result.expandIds.has("root")).toBe(true);
  });

  it("filterFileTree returns only matching branches", () => {
    const result = filterFileTree(usecaseTree, "alpha");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("root");
    expect(result[0].children?.map((node) => node.id)).toEqual(["child-file"]);
  });
});

import { describe, expect, it } from "vitest";
import {
  filterTreeByQuery,
  flattenVisibleTree,
  getNodePath,
  searchTree,
} from "@/features/file-explorer/domain/services/fileTreeTraversal";
import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";

const sampleTree: FileNode[] = [
  {
    id: "folder-root",
    name: "Legal",
    type: "folder",
    children: [
      {
        id: "folder-active",
        name: "Active_Cases",
        type: "folder",
        children: [
          {
            id: "file-brief",
            name: "Brief_v2.pdf",
            type: "file",
            size: "120KB",
          },
          {
            id: "file-notes",
            name: "Witness_Notes.txt",
            type: "file",
            size: "34KB",
          },
        ],
      },
      {
        id: "folder-archive",
        name: "Archive",
        type: "folder",
        children: [{ id: "file-2023", name: "Case_2023.pdf", type: "file", size: "88KB" }],
      },
    ],
  },
  {
    id: "file-readme",
    name: "README_First.txt",
    type: "file",
    size: "1KB",
  },
];

describe("fileTreeTraversal", () => {
  it("flattens only top-level nodes when nothing is expanded", () => {
    const result = flattenVisibleTree(sampleTree, new Set());

    expect(result.map((node) => node.id)).toEqual(["folder-root", "file-readme"]);
  });

  it("flattens nested nodes when matching folders are expanded", () => {
    const expanded = new Set(["folder-root", "folder-active"]);
    const result = flattenVisibleTree(sampleTree, expanded);

    expect(result.map((node) => node.id)).toEqual([
      "folder-root",
      "folder-active",
      "file-brief",
      "file-notes",
      "folder-archive",
      "file-readme",
    ]);
  });

  it("returns full node path for a deep file", () => {
    const result = getNodePath(sampleTree, "file-brief");

    expect(result).toEqual(["Legal", "Active_Cases", "Brief_v2.pdf"]);
  });

  it("returns null when node path target does not exist", () => {
    const result = getNodePath(sampleTree, "missing-id");

    expect(result).toBeNull();
  });

  it("returns search matches and ancestor folder expand ids", () => {
    const result = searchTree(sampleTree, "brief");

    expect(Array.from(result.matchIds)).toEqual(["file-brief"]);
    expect(result.expandIds.has("folder-root")).toBe(true);
    expect(result.expandIds.has("folder-active")).toBe(true);
    expect(result.expandIds.has("folder-archive")).toBe(false);
  });

  it("search is case-insensitive", () => {
    const result = searchTree(sampleTree, "reAdMe");

    expect(result.matchIds.has("file-readme")).toBe(true);
  });

  it("filters tree by query while preserving parent chain", () => {
    const result = filterTreeByQuery(sampleTree, "brief");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("folder-root");
    expect(result[0].children?.[0].id).toBe("folder-active");
    expect(result[0].children?.[0].children?.map((node) => node.id)).toEqual(["file-brief"]);
  });

  it("returns an empty tree when filter has no matches", () => {
    const result = filterTreeByQuery(sampleTree, "not-found");

    expect(result).toEqual([]);
  });
});

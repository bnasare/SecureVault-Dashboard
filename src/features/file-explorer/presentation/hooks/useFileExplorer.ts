import { useCallback, useMemo, useState } from "react";
import { staticFileTreeRepository } from "@/features/file-explorer/data/repository_impl/StaticFileTreeRepository";
import { getFileTree } from "@/features/file-explorer/domain/usecase/getFileTree";
import { getVisibleNodes } from "@/features/file-explorer/domain/usecase/getVisibleNodes";
import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";

export function useFileExplorer() {
  const data = useMemo(() => getFileTree(staticFileTreeRepository), []);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);

  const visibleNodes = useMemo(
    () => getVisibleNodes(data, expandedIds),
    [data, expandedIds]
  );

  const toggleFolder = useCallback((id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const selectNode = useCallback((node: FileNode) => {
    setSelectedNode(node);
  }, []);

  return {
    data,
    expandedIds,
    selectedNode,
    visibleNodes,
    selectNode,
    toggleFolder,
  };
}

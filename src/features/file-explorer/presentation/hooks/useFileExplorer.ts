import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { staticFileTreeRepository } from "@/features/file-explorer/data/repository_impl/StaticFileTreeRepository";
import { getFileTree } from "@/features/file-explorer/domain/usecase/getFileTree";
import { getVisibleNodes } from "@/features/file-explorer/domain/usecase/getVisibleNodes";
import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";

export function useFileExplorer() {
  const data = useMemo(() => getFileTree(staticFileTreeRepository), []);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);

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

  const focusNode = useCallback((id: string) => {
    setFocusedId(id);
  }, []);

  useEffect(() => {
    const container = treeRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!focusedId) {
        if (visibleNodes.length > 0) setFocusedId(visibleNodes[0].id);
        return;
      }

      const currentIndex = visibleNodes.findIndex((node) => node.id === focusedId);
      if (currentIndex === -1) return;

      const current = visibleNodes[currentIndex];

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (currentIndex < visibleNodes.length - 1) {
            setFocusedId(visibleNodes[currentIndex + 1].id);
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (currentIndex > 0) {
            setFocusedId(visibleNodes[currentIndex - 1].id);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (current.type === "folder" && !expandedIds.has(current.id)) {
            toggleFolder(current.id);
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (current.type === "folder" && expandedIds.has(current.id)) {
            toggleFolder(current.id);
          }
          break;
        case "Enter":
          event.preventDefault();
          if (current.type === "file") {
            selectNode(current);
          }
          break;
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [expandedIds, focusedId, selectNode, toggleFolder, visibleNodes]);

  useEffect(() => {
    if (!focusedId) return;

    const element = document.querySelector(
      `[data-node-id="${focusedId}"]`
    ) as HTMLElement | null;

    element?.scrollIntoView({ block: "nearest" });
    element?.focus();
  }, [focusedId]);

  return {
    data,
    expandedIds,
    focusedId,
    selectedNode,
    treeRef,
    visibleNodes,
    focusNode,
    setFocusedId,
    selectNode,
    toggleFolder,
  };
}

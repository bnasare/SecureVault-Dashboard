import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { staticFileTreeRepository } from "@/features/file-explorer/data/repository_impl/StaticFileTreeRepository";
import { getFileTree } from "@/features/file-explorer/domain/usecase/getFileTree";
import { getVisibleNodes } from "@/features/file-explorer/domain/usecase/getVisibleNodes";
import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { searchFileTree } from "@/features/file-explorer/domain/usecase/searchFileTree";
import { filterFileTree } from "@/features/file-explorer/domain/usecase/filterFileTree";

export function useFileExplorer() {
  const data = useMemo(() => getFileTree(staticFileTreeRepository), []);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const treeRef = useRef<HTMLDivElement>(null);

  const { matchIds: searchMatchIds, expandIds: searchExpandIds } = useMemo(
    () =>
      searchQuery
        ? searchFileTree(data, searchQuery)
        : { matchIds: new Set<string>(), expandIds: new Set<string>() },
    [data, searchQuery]
  );

  const filteredData = useMemo(
    () => (searchQuery ? filterFileTree(data, searchQuery) : data),
    [data, searchQuery]
  );

  const effectiveExpanded = useMemo(() => {
    if (!searchQuery) return expandedIds;
    return new Set([...expandedIds, ...searchExpandIds]);
  }, [expandedIds, searchExpandIds, searchQuery]);

  const visibleNodes = useMemo(
    () => getVisibleNodes(filteredData, effectiveExpanded),
    [effectiveExpanded, filteredData]
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
          if (current.type === "folder" && !effectiveExpanded.has(current.id)) {
            toggleFolder(current.id);
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (current.type === "folder" && effectiveExpanded.has(current.id)) {
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
  }, [effectiveExpanded, focusedId, selectNode, toggleFolder, visibleNodes]);

  useEffect(() => {
    if (!focusedId) return;

    const element = document.querySelector(
      `[data-node-id="${focusedId}"]`
    ) as HTMLElement | null;

    element?.scrollIntoView({ block: "nearest" });
    element?.focus();
  }, [focusedId]);

  useEffect(() => {
    if (!focusedId) return;

    const stillVisible = visibleNodes.some((node) => node.id === focusedId);
    if (!stillVisible) {
      setFocusedId(visibleNodes[0]?.id ?? null);
    }
  }, [focusedId, visibleNodes]);

  return {
    data,
    effectiveExpanded,
    expandedIds,
    focusedId,
    searchMatchIds,
    searchQuery,
    selectedNode,
    treeRef,
    visibleNodes,
    filteredData,
    focusNode,
    setSearchQuery,
    setFocusedId,
    selectNode,
    toggleFolder,
  };
}

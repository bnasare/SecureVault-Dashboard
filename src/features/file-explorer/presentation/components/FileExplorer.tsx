import { Shield, Lock, Terminal, Wifi } from "lucide-react";
import { TreeNode } from "@/features/file-explorer/presentation/components/TreeNode";
import { useFileExplorer } from "@/features/file-explorer/presentation/hooks/useFileExplorer";
import { PropertiesPanel } from "@/features/file-explorer/presentation/components/PropertiesPanel";
import { SearchBar } from "@/features/file-explorer/presentation/components/SearchBar";

export function FileExplorer() {
  const {
    data,
    effectiveExpanded,
    filteredData,
    focusedId,
    searchMatchIds,
    searchQuery,
    selectedNode,
    treeRef,
    visibleNodes,
    focusNode,
    setSearchQuery,
    setFocusedId,
    selectNode,
    toggleFolder,
  } = useFileExplorer();

  return (
    <div className="flex flex-col min-h-screen h-[100dvh] bg-background vault-scanlines">
      <header className="flex flex-wrap items-center gap-y-1 px-3 sm:px-4 py-2 md:h-10 border-b border-border bg-card shrink-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <Shield size={14} className="text-primary vault-glow" />
          <span className="text-[12px] font-bold font-mono tracking-[0.15em] text-foreground vault-glow">
            SECUREVAULT
          </span>
          <span className="text-[9px] font-mono text-vault-dim ml-1 border border-border px-1.5 py-0.5 rounded-sm uppercase tracking-wider whitespace-nowrap">
            Explorer v2.1
          </span>
        </div>
        <div className="ml-auto flex items-center justify-end gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-vault-dim">
            <Wifi size={10} className="text-primary animate-pulse-glow" />
            <span className="hidden md:inline text-[9px] font-mono uppercase tracking-wider">Connected</span>
          </div>
          <div className="flex items-center gap-1.5 text-vault-dim">
            <Lock size={10} />
            <span className="hidden md:inline text-[9px] font-mono uppercase tracking-wider">AES-256</span>
          </div>
        </div>
      </header>

      <div className="vault-gradient-line shrink-0" />

      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        <div className="flex flex-col w-full flex-1 md:flex-none md:w-[320px] md:min-w-[260px] min-h-0 border-b md:border-b-0 md:border-r border-border bg-card">
          <div className="flex items-center gap-2 px-4 h-8 border-b border-border bg-vault-surface shrink-0">
            <Terminal size={10} className="text-vault-dim" />
            <span className="text-[9px] font-mono text-vault-dim uppercase tracking-[0.2em]">File Tree</span>
            <span className="ml-auto text-[9px] font-mono text-vault-dim tabular-nums">{visibleNodes.length}</span>
          </div>

          <div className="px-3 py-2 border-b border-border">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div
            ref={treeRef}
            role="tree"
            aria-label="File explorer"
            tabIndex={0}
            className="flex-1 overflow-auto py-0.5 focus:outline-none"
            onFocus={() => {
              if (!focusedId && visibleNodes.length > 0) {
                setFocusedId(visibleNodes[0].id);
              }
            }}
          >
            {searchQuery && searchMatchIds.size === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-[10px] font-mono text-vault-dim">NO RESULTS FOR</p>
                <p className="text-[11px] font-mono text-primary mt-1">"{searchQuery}"</p>
              </div>
            ) : (
              filteredData.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  expandedIds={effectiveExpanded}
                  selectedId={selectedNode?.id ?? null}
                  focusedId={focusedId}
                  searchMatchIds={searchMatchIds}
                  onToggle={toggleFolder}
                  onSelect={selectNode}
                  onFocusNode={focusNode}
                />
              ))
            )}
          </div>

          <div className="px-3 py-1.5 border-t border-border text-[9px] font-mono text-vault-dim flex items-center justify-between shrink-0">
            <span className="uppercase tracking-wider">{visibleNodes.length} nodes</span>
            {searchQuery && (
              <span className="text-primary">
                {searchMatchIds.size} match{searchMatchIds.size !== 1 ? "es" : ""}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-background md:min-w-[280px]">
          <PropertiesPanel node={selectedNode} allNodes={data} />
        </div>
      </div>
    </div>
  );
}

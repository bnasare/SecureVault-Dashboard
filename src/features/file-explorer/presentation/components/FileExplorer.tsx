import { Shield, Lock, Terminal, Wifi } from "lucide-react";
import { TreeNode } from "@/features/file-explorer/presentation/components/TreeNode";
import { useFileExplorer } from "@/features/file-explorer/presentation/hooks/useFileExplorer";
import { PropertiesPanel } from "@/features/file-explorer/presentation/components/PropertiesPanel";

export function FileExplorer() {
  const { data, expandedIds, selectedNode, visibleNodes, selectNode, toggleFolder } =
    useFileExplorer();

  return (
    <div className="flex flex-col h-screen bg-background vault-scanlines">
      <header className="flex items-center px-4 h-10 border-b border-border bg-card shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-primary vault-glow" />
          <span className="text-[12px] font-bold font-mono tracking-[0.15em] text-foreground vault-glow">
            SECUREVAULT
          </span>
          <span className="text-[9px] font-mono text-vault-dim ml-1 border border-border px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
            Explorer v2.1
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-vault-dim">
            <Wifi size={10} className="text-primary animate-pulse-glow" />
            <span className="text-[9px] font-mono uppercase tracking-wider">Connected</span>
          </div>
          <div className="flex items-center gap-1.5 text-vault-dim">
            <Lock size={10} />
            <span className="text-[9px] font-mono uppercase tracking-wider">AES-256</span>
          </div>
        </div>
      </header>

      <div className="vault-gradient-line shrink-0" />

      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col w-[320px] min-w-[260px] border-r border-border bg-card">
          <div className="flex items-center gap-2 px-4 h-8 border-b border-border bg-vault-surface shrink-0">
            <Terminal size={10} className="text-vault-dim" />
            <span className="text-[9px] font-mono text-vault-dim uppercase tracking-[0.2em]">File Tree</span>
            <span className="ml-auto text-[9px] font-mono text-vault-dim tabular-nums">{visibleNodes.length}</span>
          </div>

          <div role="tree" aria-label="File explorer" className="flex-1 overflow-auto py-0.5">
            {data.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                expandedIds={expandedIds}
                selectedId={selectedNode?.id ?? null}
                onToggle={toggleFolder}
                onSelect={selectNode}
              />
            ))}
          </div>

          <div className="px-3 py-1.5 border-t border-border text-[9px] font-mono text-vault-dim flex items-center justify-between shrink-0">
            <span className="uppercase tracking-wider">{visibleNodes.length} nodes</span>
          </div>
        </div>

        <div className="flex-1 bg-background min-w-[280px]">
          <PropertiesPanel node={selectedNode} />
        </div>
      </div>
    </div>
  );
}

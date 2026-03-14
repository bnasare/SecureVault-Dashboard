import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { ChevronIcon, FileIcon } from "@/features/file-explorer/presentation/components/FileIcon";

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function TreeNode({ node, depth, expandedIds, onToggle }: TreeNodeProps) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedIds.has(node.id);
  const paddingLeft = 16 + depth * 18;

  const handleClick = () => {
    if (isFolder) {
      onToggle(node.id);
    }
  };

  return (
    <div>
      <div
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        data-node-id={node.id}
        className="relative flex items-center gap-2 cursor-pointer select-none h-[30px] text-[12px] font-mono outline-none group border-l border-l-transparent hover:bg-vault-surface-hover hover:border-l-vault-dim/40 text-secondary-foreground"
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        {depth > 0 && (
          <span
            className="absolute top-0 bottom-0 w-px bg-border/40"
            style={{ left: paddingLeft - 10 }}
          />
        )}

        {isFolder ? <ChevronIcon isOpen={isExpanded} /> : <span className="w-3 shrink-0" />}
        <FileIcon type={node.type} isOpen={isExpanded} />
        <span className="truncate transition-colors group-hover:text-foreground">{node.name}</span>
        {node.size && (
          <span className="ml-auto pr-3 text-[10px] text-vault-dim tabular-nums shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.size}
          </span>
        )}
      </div>

      {isFolder && isExpanded && node.children && (
        <div role="group" className="animate-fade-in">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
          {node.children.length === 0 && (
            <div
              className="h-7 flex items-center text-[10px] text-vault-dim italic font-mono"
              style={{ paddingLeft: paddingLeft + 26 }}
            >
              empty
            </div>
          )}
        </div>
      )}
    </div>
  );
}

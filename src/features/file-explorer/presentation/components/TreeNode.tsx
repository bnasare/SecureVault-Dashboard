import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { ChevronIcon, FileIcon } from "@/features/file-explorer/presentation/components/FileIcon";

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  focusedId: string | null;
  searchMatchIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (node: FileNode) => void;
  onFocusNode: (id: string) => void;
}

export function TreeNode({
  node,
  depth,
  expandedIds,
  selectedId,
  focusedId,
  searchMatchIds,
  onToggle,
  onSelect,
  onFocusNode,
}: TreeNodeProps) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;
  const isSearchMatch = searchMatchIds.has(node.id);
  const paddingLeft = 16 + depth * 18;

  const handleClick = () => {
    onFocusNode(node.id);
    onSelect(node);
    if (isFolder) {
      onToggle(node.id);
    }
  };

  return (
    <div>
      <div
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={isFocused ? 0 : -1}
        data-node-id={node.id}
        className={`relative flex items-center gap-2 cursor-pointer select-none h-[30px] text-[12px] font-mono outline-none group ${
          isSelected
            ? "bg-vault-selected border-l border-l-vault-selected-border text-foreground"
            : "border-l border-l-transparent hover:bg-vault-surface-hover hover:border-l-vault-dim/40 text-secondary-foreground"
        } ${isFocused && !isSelected ? "bg-vault-surface" : ""} ${
          isFocused ? "shadow-[inset_0_0_0_1px_hsl(var(--vault-glow)/0.12)]" : ""
        }`}
        style={{ paddingLeft }}
        onClick={handleClick}
        onFocus={() => onFocusNode(node.id)}
      >
        {depth > 0 && (
          <span
            className="absolute top-0 bottom-0 w-px bg-border/40"
            style={{ left: paddingLeft - 10 }}
          />
        )}

        {isFolder ? <ChevronIcon isOpen={isExpanded} /> : <span className="w-3 shrink-0" />}
        <FileIcon type={node.type} isOpen={isExpanded} />
        <span
          className={`truncate transition-colors ${
            isSearchMatch ? "text-primary vault-glow" : ""
          } ${isSelected ? "text-foreground" : "group-hover:text-foreground"}`}
        >
          {node.name}
        </span>
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
              selectedId={selectedId}
              focusedId={focusedId}
              searchMatchIds={searchMatchIds}
              onToggle={onToggle}
              onSelect={onSelect}
              onFocusNode={onFocusNode}
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

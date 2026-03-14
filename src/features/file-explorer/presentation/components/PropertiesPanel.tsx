import { FileNode } from "@/features/file-explorer/domain/entities/FileNode";
import { FileIcon } from "@/features/file-explorer/presentation/components/FileIcon";
import { HardDrive, Tag, Layers, Shield } from "lucide-react";

interface PropertiesPanelProps {
  node: FileNode | null;
}

export function PropertiesPanel({ node }: PropertiesPanelProps) {
  if (!node) {
    return (
      <div className="h-full flex items-center justify-center vault-grid-bg px-8">
        <div className="p-8 flex flex-col items-center">
          <Shield size={32} className="mb-4 text-vault-glow/20 animate-pulse-glow" />
          <p className="text-[11px] font-mono text-vault-dim text-center leading-relaxed">
            SELECT A FILE TO
            <br />
            INSPECT PROPERTIES
          </p>
        </div>
      </div>
    );
  }

  const fileType = node.type === "folder" ? "Directory" : "File";
  const fileSize = node.size ?? "N/A";

  const properties = [
    { icon: Tag, label: "NAME", value: node.name },
    { icon: HardDrive, label: "TYPE", value: fileType },
    { icon: Layers, label: "SIZE", value: fileSize },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in vault-grid-bg">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-sm bg-vault-surface border border-border">
            <FileIcon type={node.type} isOpen={false} size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-semibold font-mono text-foreground truncate">{node.name}</h3>
            <p className="text-[10px] text-vault-dim mt-1 uppercase tracking-widest">Selected Item</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 overflow-auto">
        <p className="text-[9px] uppercase tracking-[0.2em] text-vault-dim mb-3 font-semibold">Metadata</p>
        <div className="space-y-0">
          {properties.map((property, index) => (
            <div
              key={property.label}
              className={`flex items-center py-2 ${index < properties.length - 1 ? "border-b border-border/40" : ""}`}
            >
              <property.icon size={11} className="text-vault-dim mr-2.5 shrink-0" />
              <span className="text-[10px] text-vault-dim font-mono w-20 shrink-0">{property.label}</span>
              <span className="text-[11px] font-mono text-foreground/80 truncate">{property.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";

interface FileIconProps {
  type: "file" | "folder";
  isOpen?: boolean;
  size?: number;
}

export function FileIcon({ type, isOpen, size = 15 }: FileIconProps) {
  if (type === "folder") {
    return isOpen ? (
      <FolderOpen
        size={size}
        className="text-vault-folder shrink-0 drop-shadow-[0_0_3px_hsl(var(--vault-folder)/0.4)]"
      />
    ) : (
      <Folder size={size} className="text-vault-folder shrink-0" />
    );
  }

  return <FileText size={size} className="text-vault-file shrink-0" />;
}

interface ChevronIconProps {
  isOpen: boolean;
}

export function ChevronIcon({ isOpen }: ChevronIconProps) {
  return isOpen ? (
    <ChevronDown size={12} className="text-vault-glow/60 shrink-0 transition-transform" />
  ) : (
    <ChevronRight size={12} className="text-vault-dim shrink-0 transition-transform" />
  );
}

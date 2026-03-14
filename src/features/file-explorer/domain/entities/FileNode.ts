export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  children?: FileNode[];
}

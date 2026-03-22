import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FileExplorer } from "@/features/file-explorer/presentation/components/FileExplorer";

function rowValue(label: "NAME" | "TYPE" | "SIZE"): string | null {
  const labelElement = screen.getByText(label);
  return labelElement.nextElementSibling?.textContent ?? null;
}

function focusedTreeItem(): Element | null {
  return document.querySelector('[role=\"treeitem\"][tabindex=\"0\"]');
}

describe("FileExplorer component", () => {
  it("supports keyboard tree navigation and file selection with Enter", async () => {
    const user = userEvent.setup();
    render(<FileExplorer />);

    const tree = screen.getByRole("tree", { name: /file explorer/i });
    await user.click(tree);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Active_Cases")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    await waitFor(() => {
      expect(focusedTreeItem()).toHaveAttribute("data-node-id", "leg_1");
    });

    await user.keyboard("{ArrowUp}");
    await waitFor(() => {
      expect(focusedTreeItem()).toHaveAttribute("data-node-id", "root_1");
    });

    await user.keyboard("{ArrowLeft}");
    expect(screen.queryByText("Active_Cases")).not.toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search vault/i);
    await user.type(searchInput, "README_First");

    await user.click(tree);

    await waitFor(() => {
      expect(focusedTreeItem()).toHaveAttribute("data-node-id", "root_file_1");
    });

    await user.keyboard("{Enter}");
    expect(screen.getByText("Selected Item")).toBeInTheDocument();
    expect(rowValue("NAME")).toBe("README_First.txt");
  });

  it("updates the properties panel when a file is selected", async () => {
    const user = userEvent.setup();
    render(<FileExplorer />);

    expect(screen.getAllByText(/SELECT A FILE TO/i).length).toBeGreaterThan(0);

    await user.click(screen.getByText("README_First.txt"));

    expect(screen.queryAllByText(/SELECT A FILE TO/i)).toHaveLength(0);
    expect(screen.getByText("Metadata")).toBeInTheDocument();
    expect(rowValue("NAME")).toBe("README_First.txt");
    expect(rowValue("TYPE")).toBe("File");
    expect(rowValue("SIZE")).toBe("1KB");
  });

  it("filters tree with search, auto-expands matches, and shows no-results state", async () => {
    const user = userEvent.setup();
    render(<FileExplorer />);

    const searchInput = screen.getByPlaceholderText(/search vault/i);

    await user.type(searchInput, "Appeal_Transcript");

    await waitFor(() => {
      expect(screen.getByText("Appeal_Transcript.pdf")).toBeInTheDocument();
      expect(screen.getByText("Appeal_Documents")).toBeInTheDocument();
      expect(screen.queryByText("02_Finance_Team")).not.toBeInTheDocument();
      expect(screen.getByText(/1 match/i)).toBeInTheDocument();
    });

    await user.clear(searchInput);
    await user.type(searchInput, "zzzz_non_existent");

    await waitFor(() => {
      expect(screen.getByText("NO RESULTS FOR")).toBeInTheDocument();
      expect(screen.getByText('"zzzz_non_existent"')).toBeInTheDocument();
      expect(screen.getByText(/0 matches/i)).toBeInTheDocument();
    });
  });

  it("does not steal focus from the search input while typing", async () => {
    const user = userEvent.setup();
    render(<FileExplorer />);

    const searchInput = screen.getByPlaceholderText(/search vault/i);
    await user.click(searchInput);
    await user.type(searchInput, "REA");

    expect(searchInput).toHaveFocus();

    await user.type(searchInput, "D");
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue("READ");
  });
});

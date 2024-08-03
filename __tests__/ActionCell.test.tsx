import ActionCell from "@/components/ActionCell";
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the translation hook
jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ActionCell Component", () => {
  const mockRowData = { id: 1, name: "Sample Row" };
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockExtraAction = jest.fn();

  const extraActions = [
    {
      name: "edit",
      onClick: mockExtraAction,
      icon: EditIcon,
    },
    {
      name: "delete",
      onClick: mockOnDelete,
      icon: MoreVertIcon,
    },
  ];

  const defaultProps = {
    rowData: mockRowData,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    extraActions,
    showIcons: true,
  };

  it("should render without crashing", () => {
    render(<ActionCell {...defaultProps} />);
    const iconButton = screen.getByRole("button");
    expect(iconButton).toBeInTheDocument();
  });

  it("should display MoreVertIcon button", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");
    expect(moreVertIcon).toBeInTheDocument();
  });

  it("should open the menu on MoreVertIcon click", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItem = screen.getAllByRole("menuitem");
    expect(menuItem.length).toBe(extraActions.length);
  });

  it("should display the correct number of actions in the menu", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(extraActions.length);
  });

  it("should call the correct action when a menu item is clicked", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItems = screen.getAllByRole("menuitem");

    // Click the first action
    fireEvent.click(menuItems[0]);
    expect(mockExtraAction).toHaveBeenCalledWith(mockRowData);

    // Open the menu again
    fireEvent.click(moreVertIcon);

    // Click the second action
    fireEvent.click(menuItems[1]);
    expect(mockOnDelete).toHaveBeenCalledWith(mockRowData);
  });

  it("should close the menu after an action is clicked", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItems = screen.getAllByRole("menuitem");

    // Click the first action
    fireEvent.click(menuItems[0]);
    expect(mockExtraAction).toHaveBeenCalledWith(mockRowData);

    // Menu should be closed
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  xit("should not display menu items if extraActions are empty", () => {
    render(<ActionCell {...defaultProps} extraActions={[]} />);
    const moreVertIcon = screen.getByRole("button");

    // Try to open the menu
    fireEvent.click(moreVertIcon);
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  it("should not show icons when showIcons is false", () => {
    render(<ActionCell {...defaultProps} showIcons={false} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const listItemIcons = screen.queryAllByRole("icon");

    expect(listItemIcons).toHaveLength(0); // Icons should not be displayed
  });

  it("should display translated action names using useTranslation hook", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItems = screen.getAllByRole("menuitem");

    // Check the translated action names
    expect(menuItems[0]).toHaveTextContent("edit");
    expect(menuItems[1]).toHaveTextContent("delete");
  });

  xit("should handle no actions gracefully", () => {
    render(<ActionCell {...defaultProps} extraActions={[]} />);
    const moreVertIcon = screen.getByRole("button");
    expect(moreVertIcon).toBeInTheDocument();

    // Try to open the menu
    fireEvent.click(moreVertIcon);
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  it("should display actions without icons when showIcons is false", () => {
    render(<ActionCell {...defaultProps} showIcons={false} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItems = screen.getAllByRole("menuitem");

    expect(menuItems.length).toBe(extraActions.length);
    const icons = screen.queryAllByRole("icon");
    expect(icons).toHaveLength(0);
  });

  it("should correctly handle onEdit and onDelete props", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItems = screen.getAllByRole("menuitem");

    // Click the first action (edit)
    fireEvent.click(menuItems[0]);
    expect(mockExtraAction).toHaveBeenCalledWith(mockRowData);

    // Open the menu again
    fireEvent.click(moreVertIcon);

    // Click the second action (delete)
    fireEvent.click(menuItems[1]);
    expect(mockOnDelete).toHaveBeenCalledWith(mockRowData);
  });

  it("should display all extra actions", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);
    const menuItems = screen.getAllByRole("menuitem");

    expect(menuItems).toHaveLength(extraActions.length);
  });

  xit("should render the correct icon for each action", () => {
    render(<ActionCell {...defaultProps} />);
    const moreVertIcon = screen.getByRole("button");

    // Open the menu
    fireEvent.click(moreVertIcon);

    // Check for each action icon
    extraActions.forEach((action) => {
      const iconElement = screen.getByTestId(action.name + "-icon");
      expect(iconElement).toBeInTheDocument();
    });
  });
});

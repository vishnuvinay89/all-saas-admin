import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CardItem from "@/components/CardItem";

// Mock the translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock CustomStepper component
jest.mock("@/components/Steper", () => ({
  __esModule: true,
  default: ({ completedSteps }: { completedSteps: number }) => (
    <div data-testid="custom-stepper">{`Stepper: ${completedSteps}`}</div>
  ),
}));

describe("CardItem Component", () => {
  const mockOnClick = jest.fn();
  const mockOnCopyLink = jest.fn();

  const defaultProps = {
    card: {
      id: 1,
      state: "In Progress",
      boardsUploaded: 5,
      totalBoards: 10,
      boards: ["Board 1", "Board 2"],
    },
    onClick: mockOnClick,
    onCopyLink: mockOnCopyLink,
    selected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(<CardItem {...defaultProps} />);
    const cardElement = screen.getByRole("button");
    expect(cardElement).toBeInTheDocument();
  });

  it("should display the correct state", () => {
    render(<CardItem {...defaultProps} />);
    const stateText = screen.getByText(defaultProps.card.state);
    expect(stateText).toBeInTheDocument();
  });

  it("should display the correct progress", () => {
    render(<CardItem {...defaultProps} />);
    const progressText = screen.getByText(
      `${defaultProps.card.boardsUploaded} / ${defaultProps.card.totalBoards} COURSE_PLANNER.BOARDS_FULLY_UPLOADED`,
    );
    expect(progressText).toBeInTheDocument();
  });

  it("should render CustomStepper with the correct completed steps", () => {
    render(<CardItem {...defaultProps} />);
    const stepper = screen.getByTestId("custom-stepper");
    expect(stepper).toHaveTextContent(
      `Stepper: ${defaultProps.card.boardsUploaded}`,
    );
  });

  xit("should call onClick handler when the card is clicked", () => {
    render(<CardItem {...defaultProps} />);
    const cardElement = screen.getByRole("button");

    fireEvent.click(cardElement);
    expect(mockOnClick).toHaveBeenCalled();
  });

  xit("should have a default background color", () => {
    render(<CardItem {...defaultProps} />);
    const cardElement = screen.getByRole("button");

    expect(cardElement).toHaveStyle("background-color: inherit");
  });

  xit("should have a highlighted background color when selected", () => {
    render(<CardItem {...defaultProps} selected={true} />);
    const cardElement = screen.getByRole("button");

    expect(cardElement).toHaveStyle("background-color: #EAF2FF");
  });

  xit("should change background color on hover", () => {
    render(<CardItem {...defaultProps} />);
    const cardElement = screen.getByRole("button");

    // Simulate hover
    fireEvent.mouseOver(cardElement);
    expect(cardElement).toHaveStyle("background-color: #EAF2FF");

    // Simulate mouse out
    fireEvent.mouseOut(cardElement);
    expect(cardElement).toHaveStyle("background-color: inherit");
  });

  xit("should call onCopyLink handler when the copy link button is clicked", () => {
    render(<CardItem {...defaultProps} />);
    const copyLinkButton = screen.getByRole("button", {
      name: /InsertLinkOutlinedIcon/i,
    });

    fireEvent.click(copyLinkButton);
    expect(mockOnCopyLink).toHaveBeenCalled();
  });

  xit("should stop propagation when the copy link button is clicked", () => {
    render(<CardItem {...defaultProps} />);
    const cardElement = screen.getByRole("button");
    const copyLinkButton = screen.getByRole("button", {
      name: /InsertLinkOutlinedIcon/i,
    });

    fireEvent.click(copyLinkButton);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("should display FolderOutlinedIcon", () => {
    render(<CardItem {...defaultProps} />);
    const folderIcon = screen.getByTestId("FolderOutlinedIcon");
    expect(folderIcon).toBeInTheDocument();
  });

  it("should display InsertLinkOutlinedIcon", () => {
    render(<CardItem {...defaultProps} />);
    const linkIcon = screen.getByTestId("InsertLinkOutlinedIcon");
    expect(linkIcon).toBeInTheDocument();
  });
});

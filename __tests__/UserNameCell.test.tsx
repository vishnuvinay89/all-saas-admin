import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserNameCell from "@/components/UserNameCell";
import { firstLetterInUpperCase, getUserName } from "@/utils/Helper";

// Mock getUserName function
jest.mock("@/utils/Helper", () => ({
  firstLetterInUpperCase: jest.fn((name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }),
  getUserName: jest.fn(),
}));

describe("UserNameCell Component", () => {
  const mockGetUserName = getUserName as jest.Mock;
  const mockFirstLetterInUpperCase = firstLetterInUpperCase as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display a loading indicator while fetching username", async () => {
    mockGetUserName.mockReturnValueOnce(new Promise(() => {})); // Simulate a pending promise

    render(<UserNameCell userId="123" />);

    const loadingIndicator = screen.getByRole("progressbar");
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("should display the username once fetched", async () => {
    mockGetUserName.mockResolvedValueOnce("john doe");

    render(<UserNameCell userId="123" />);

    await waitFor(() => {
      const userNameElement = screen.getByText("John Doe");
      expect(userNameElement).toBeInTheDocument();
    });
  });

  it("should capitalize the first letter of each word in the username", async () => {
    mockGetUserName.mockResolvedValueOnce("jane doe");
    mockFirstLetterInUpperCase.mockImplementationOnce((name) =>
      name
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    );

    render(<UserNameCell userId="456" />);

    await waitFor(() => {
      const userNameElement = screen.getByText("Jane Doe");
      expect(userNameElement).toBeInTheDocument();
    });

    expect(mockFirstLetterInUpperCase).toHaveBeenCalledWith("jane doe");
  });

  it("should display a dash if username is not available", async () => {
    mockGetUserName.mockResolvedValueOnce("");

    render(<UserNameCell userId="789" />);

    await waitFor(() => {
      const dashElement = screen.getByText("-");
      expect(dashElement).toBeInTheDocument();
    });
  });
});

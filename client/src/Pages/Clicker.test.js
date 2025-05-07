import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import Clicker from "./Clicker";

test("increments count on button click", () => {
  render(<Clicker />); // Load the component
  const button = screen.getByText(/click me/i); // Find the button
  fireEvent.click(button); // Simulate click
  expect(screen.getByText(/you clicked 1 times/i)).toBeInTheDocument(); // Check result
});
import { render, screen, act } from "@testing-library/react";
import React from "react";
import MuiSnackStack from "./index";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { toMatchDiffSnapshot } from "snapshot-diff";

expect.extend({ toMatchDiffSnapshot });
import { AlertProps } from "@mui/material/Alert";

describe("when the close button is clicked", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	it("should display the next snackbar after clicking button", async () => {
		render(<MuiSnackStack />);
		const firstMessage = "first message";
		const secondMessage = "second message";
		await act(async () => {
			MuiSnackStack.queue(firstMessage);
			// Runs the transition animation to show the first message
			await jest.runOnlyPendingTimers();
			MuiSnackStack.queue(secondMessage);
			await userEvent.click(
				screen.getByRole("button", {
					name: /close/i,
				})
			);
			// Runs the transition animation to dismiss the first snackbar
			await jest.runOnlyPendingTimers();
		});
		expect(screen.getByText(secondMessage)).toBeInTheDocument();
		expect(screen.queryByText(firstMessage)).not.toBeInTheDocument();
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", {
					name: /close/i,
				})
			);
			// Runs the transition animation to close the second snackbar.
			await jest.runOnlyPendingTimers();
		});
		expect(screen.queryByText(secondMessage)).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", {
				name: /close/i,
			})
		).not.toBeInTheDocument();
	});
});

describe("when the timeout is reached", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});
	it("show the message with the default severity and position", async () => {
		const { asFragment } = render(<MuiSnackStack />);
		const expectedMessage = "asdf";
		const expectedTimeout = 9000;
		await act(async () => {
			MuiSnackStack.queue(expectedMessage, expectedTimeout);
			await jest.runOnlyPendingTimers();
		});
		screen.getByText(expectedMessage);
		screen.getByTestId("InfoOutlinedIcon");
		const infoSnackbar = asFragment();
		// Verifies that the info snackbar appears at the default position.
		expect(infoSnackbar).toMatchSnapshot();
		await act(async () => {
			await jest.advanceTimersByTime(expectedTimeout + 1000);
		});
		expect(screen.queryByText(expectedMessage)).not.toBeInTheDocument();
		// Verfies the snackbar has bteen removed.
		expect(infoSnackbar).toMatchDiffSnapshot(asFragment());
	});

	it("show he next snackbar after the current snackbar times out", async () => {
		let expectedSeverity: AlertProps["severity"] = "warning";
		const { asFragment } = render(<MuiSnackStack />);
		const firstMessage = "first message";
		const secondMessage = "second message";
		const secondTimeout = 4000;
		// Queues a warning snackbar at the bottom center.
		await act(async () => {
			MuiSnackStack.queue(
				firstMessage,
				undefined, // Uses default timeout
				expectedSeverity,
				{
					vertical: "bottom",
					horizontal: "center",
				}
			);
			await jest.runOnlyPendingTimers();
		});
		screen.getByText(firstMessage);
		screen.getByTestId("ReportProblemOutlinedIcon");
		expectedSeverity = "error";
		const warningSnackbar = asFragment();
		// Queues an error snackbar at the top right.
		expect(warningSnackbar).toMatchSnapshot();
		MuiSnackStack.queue(secondMessage, secondTimeout, expectedSeverity, {
			vertical: "top",
			horizontal: "right",
		});
		await act(async () => {
			await window.queueMicrotask(() => null);
			await jest.runOnlyPendingTimers();
			await window.queueMicrotask(() => null);
			await jest.runOnlyPendingTimers();
		});
		screen.getByText(secondMessage);
		screen.getByTestId("ErrorOutlineIcon");

		const errorSnackbar = asFragment();
		// The second snackbar should have replaced the first snackbar
		expect(warningSnackbar).toMatchDiffSnapshot(errorSnackbar);
	});
});

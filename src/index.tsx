import React, { ReactElement, useState, useRef } from "react";
import Alert from "@mui/material/Alert";
import { AlertProps } from "@mui/material/Alert";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface Message {
  message: string;
  timeout: number;
  snackbarOrigin: SnackbarOrigin;
  severity: AlertProps["severity"];
}

type Queue = (
  message: string,
  timeout?: number,
  severity?: AlertProps["severity"],
  snackbarOrigin?: SnackbarOrigin
) => Promise<void>;

interface QueueMethods {

  messageQueue: Array<Message>;
  queue: Queue;
}

const muiSnackStack: (() => ReactElement) & QueueMethods = () => {
	const mountedSnackbar: React.FC = () => {
		// Null means there is no snackar being displayed.
		const timer = useRef<NodeJS.Timeout>();
		const cancelCurrentSnackbar = useRef<() => void>()
		const [waiting, setWaiting] = useState<Promise<void> | null>(null);

		const [isOpen, setIsOpen] = useState(false);
		const [currentMessage, setCurrentMessage] = useState<null | string>(null);
		const [currentTimeout, setCurrentTimeout] = useState<null | number>(null);
		const [snackbarOrigin, setSnackbarOrigin] = useState<SnackbarOrigin>({
			vertical: "top",
			horizontal: "right",
		});
		const [severity, setSeverity] = useState<AlertProps["severity"]>("info");

		// Hides the snackbar component.
		const handleSnackbarClose: (
      event: React.SyntheticEvent | undefined
    ) => void = (event) => {
    	if (!event) {
    		setIsOpen(false);
    	}
    };

		const dequeue: () => Promise<void> = () => {
			const processQueue = async () => {
				while (muiSnackStack.messageQueue.length) {
					const nextItem = muiSnackStack.messageQueue.pop() as Message;
					const { message, timeout, snackbarOrigin, severity } = nextItem;

					// Waits 200 milliseconds for slide in animation.
					await new Promise<void>((endAnimationResolve) => {
						setTimeout(() => {
							setCurrentMessage(message);
							setCurrentTimeout(timeout);
							setSnackbarOrigin(snackbarOrigin);
							setSeverity(severity);
							setIsOpen(true);
							endAnimationResolve();
						}, 200);
					});

					// Pauses the loop until the snackbar times out or is closed.
					await new Promise<void>((dismissSnackbarResolve) => {
						// Dismisses the snackbar automatically after the timeout.
						timer.current = setTimeout(() => {
							handleSnackbarClose(undefined);
							dismissSnackbarResolve();
						}, timeout);

						// Used to dismiss the current snackbar when closed.
						cancelCurrentSnackbar.current = dismissSnackbarResolve
					});
					setIsOpen(false);
				}
			};

			const waitForProcessQueueToFinish = processQueue();
			waitForProcessQueueToFinish.then(() => {
				setWaiting(null);
			});

			setWaiting(waitForProcessQueueToFinish);
			return waitForProcessQueueToFinish;
		};

		// Resolves when after the snackbar queue proceessing has completed..
		muiSnackStack.queue = (
			message,
			timeout = 3000,
			severity = "info",
			snackbarOrigin = { vertical: "top", horizontal: "right" }
		): Promise<void> => {
			// Adds the message to the queue.
			muiSnackStack.messageQueue.unshift({
				message,
				timeout,
				snackbarOrigin,
				severity,
			});

			// If there is already a message being shown,
			// then return the current dequeuing process.
			if (waiting) {
				return waiting;
			} else {
				// Otherwise, start a new dequeuing process
				return dequeue();
			}
		};

		const onClose = (): void => {
			if (timer.current) {
				// Removes the timer because the the snackbar has been closed.
				clearTimeout(timer.current);

				if (cancelCurrentSnackbar.current) {
					cancelCurrentSnackbar.current();
				}
			}
		};

		return (
			<Snackbar
				anchorOrigin={snackbarOrigin}
				open={isOpen}
				onClose={handleSnackbarClose}
				autoHideDuration={currentTimeout}
			>
				<Alert severity={severity} onClose={onClose}>
					{currentMessage}
				</Alert>
			</Snackbar>
		);
	};

	return mountedSnackbar({});
};
muiSnackStack.messageQueue = [];
muiSnackStack.queue = (): Promise<void> =>
	Promise.reject(
		new Error("MuiSnackStack must be first initialized as <MuiSnackStack /> ")
	);

export default muiSnackStack;

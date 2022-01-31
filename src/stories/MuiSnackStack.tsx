import React from "react";
import MuiSnackStackComponent from "..";
import Button from "@mui/material/Button";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material/Alert";

interface MuiSnackStackProps {
  /**
   * How long to show the dialog
   */
  duration: number;

  /**
   * Sets the Snackbar vertical alignment
   */
  vertical: SnackbarOrigin["vertical"];

  /**
   * Sets the snackbar horizontal alignment
   */
  horizontal: SnackbarOrigin["horizontal"];

  /**
   * SHould be error, warning, info, success
   */
  severity: AlertProps["severity"];

  /**
   * The message to show
   */
  message: string;
}

export const MuiSnackStack: (props: MuiSnackStackProps) => JSX.Element = ({
	message = "Lorem Ipsum Dolor",
	duration = 3000,
	vertical = "top",
	horizontal = "right",
	severity = "info",
}: MuiSnackStackProps) => {
	let counter = 0;
	return (
		<div>
			<MuiSnackStackComponent />
			<Button
				onClick={(): void => {
					MuiSnackStackComponent.queue(
						`${message} #${counter++}`, 
						duration, 
						severity, {
							vertical,
							horizontal,
						}
					);
				}}
			>
        Open Snackbar
			</Button>
		</div>
	);
};

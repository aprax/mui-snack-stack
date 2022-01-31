import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MuiSnackStack } from "./MuiSnackStack";

export default {
	title: "MuiSnackStack",
	component: MuiSnackStack,
} as ComponentMeta<typeof MuiSnackStack>;

const Template: ComponentStory<typeof MuiSnackStack> = (args) => (
	<MuiSnackStack {...args} />
);

export const Default = Template.bind({});

Default.args = {
	duration: 3000,
	vertical: "top",
	horizontal: "right",
	severity: "info",
	message: "Lorem ipsum dolor",
};

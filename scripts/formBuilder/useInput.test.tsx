import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useInput } from "./useInput";

function InputTest(
	props: {
		label: string;
		value: string;
		onChange(value: any): void;
		placeholder: string;
		tt: string;
	},
) {
	return (
		<>
			<input
				onChange={(event) => void props.onChange(event.target.value)}
				value={props.value}
				placeholder={props.placeholder}
				name={props.label}
			/>
			<p>{props.tt}</p>
		</>
	);
}

describe("useInput", () => {
	it("should return the correct template", () => {
		const { Template } = useInput(InputTest, {
			label: "test",
			defaultValue: "default",
			props: {
				placeholder: "placeholder",
				tt: "tt",
			},
		});

		const componentRender = render(
			<Template
				label="test"
				value="default"
				onChange={() => void 0}
				errorMessage="error"
			/>,
		);
		expect(componentRender.asFragment()).toMatchSnapshot();
	});
});

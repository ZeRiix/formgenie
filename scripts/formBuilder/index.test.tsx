import { useFormBuilder, type GetRef } from "./index";
import { useInput } from "./useInput";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { z } from "zod";

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

describe("useBuilderForm", () => {
	it("should return the correct template", () => {
		const Form = useFormBuilder({
			name: useInput(
				InputTest,
				{
					defaultValue: "",
					label: "Name",
					props: {
						placeholder: "Type your name",
						tt: "cc les amis",
					},
				},
			),
			age: useInput(
				(props) => (
					<>
						<input
							onChange={(event) => void props.onChange(event.target.value)}
							value={props.value}
							placeholder={props.placeholder}
							name={props.name}
						/>
					</>
				),
				{
					label: "Age",
					defaultValue: 0,
					props: {
						placeholder: "Type your age",
					},
				},
			),
		});

		const componentRender = render(
			<Form ref={null} />,
		);

		expect(componentRender.asFragment()).toMatchSnapshot();
	});

	it("test default values", () => {
		const FormTest = useFormBuilder({
			name: useInput(
				InputTest,
				{
					defaultValue: "test",
					label: "Name",
					props: {
						placeholder: "Type your name",
						tt: "cc les amis",
					},
				},
			),
		});

		const formRef = createRef<GetRef<typeof FormTest>>();

		render(
			<FormTest ref={formRef} />,
		);

		expect(formRef.current?.values.name).toMatchSnapshot();
	});

	it("test check error", async() => {
		const MIN_SCHEMA = 5;
		const FormTest = useFormBuilder({
			name: useInput(
				InputTest,
				{
					defaultValue: "test",
					label: "Name",
					props: {
						placeholder: "Type your name",
						tt: "cc les amis",
					},
					zodSchema: z.string().min(MIN_SCHEMA),
				},
			),
		});

		const formRef = createRef<GetRef<typeof FormTest>>();

		render(
			<FormTest ref={formRef} />,
		);

		expect(await formRef.current?.check()).toMatchSnapshot();
	});

	it("test check good", async() => {
		const MIN_SCHEMA = 3;
		const FormTest = useFormBuilder({
			name: useInput(
				InputTest,
				{
					defaultValue: "test",
					label: "Name",
					props: {
						placeholder: "Type your name",
						tt: "cc les amis",
					},
					zodSchema: z.string().min(MIN_SCHEMA),
				},
			),
		});

		const formRef = createRef<GetRef<typeof FormTest>>();

		render(
			<FormTest ref={formRef} />,
		);

		expect(await formRef.current?.check()).toMatchSnapshot();
	});

	it("test check good without zodSchema", async() => {
		const FormTest = useFormBuilder({
			name: useInput(
				InputTest,
				{
					defaultValue: "test",
					label: "Name",
					props: {
						placeholder: "Type your name",
						tt: "cc les amis",
					},
				},
			),
		});

		const formRef = createRef<GetRef<typeof FormTest>>();

		render(
			<FormTest ref={formRef} />,
		);

		expect(await formRef.current?.check()).toMatchSnapshot();
	});

	it("test reset", async() => {
		const FormTest = useFormBuilder({
			name: useInput(
				InputTest,
				{
					defaultValue: "test",
					label: "Name",
					props: {
						placeholder: "Type your name",
						tt: "cc les amis",
					},
				},
			),
		});

		const formRef = createRef<GetRef<typeof FormTest>>();

		const { getByPlaceholderText } = render(
			<FormTest ref={formRef} />,
		);

		const input = getByPlaceholderText("Type your name") as HTMLInputElement;

		expect(input.value).toMatchSnapshot();

		fireEvent.change(input, { target: { value: "new value" } });
		expect(input.value).toMatchSnapshot();

		formRef.current?.reset();

		await waitFor(() => {
			expect(input.value).toMatchSnapshot();
		});
	});
});

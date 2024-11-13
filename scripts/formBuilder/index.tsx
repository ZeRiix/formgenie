import { type TemplateInput } from "@scripts/formBuilder/useInput";
import { type z, type ZodType } from "zod";
import React, { forwardRef, useRef, useState, useImperativeHandle } from "react";

type GetInputValues<
	GenericInputs extends Record<string, TemplateInput>,
> = {
	[Prop in keyof GenericInputs]:
	GenericInputs[Prop] extends TemplateInput<infer InferedParams>
		? InferedParams["defaultValue"]
		: never
};

type GetOutputValues<
	GenericInputs extends Record<string, TemplateInput>,
> = {
	[Prop in keyof GenericInputs]:
	GenericInputs[Prop] extends TemplateInput<infer InferedParams>
		? InferedParams["zodSchema"] extends ZodType
			? z.infer<InferedParams["zodSchema"]>
			: InferedParams["defaultValue"]
		: never
};

type Simp<T> =
	T extends (...args: any[]) => any
		? T
		: T extends object
			? { [K in keyof T]: Simp<T[K]> }
			: T;

interface RefValue<
	GenericInputs extends Record<string, TemplateInput>,
> {
	values: GetInputValues<GenericInputs>;
	check(): Promise<Simp<GetOutputValues<GenericInputs>> | null>;
	reset(): void;
}

export type GetRef<
	GenericComponent extends React.ForwardRefExoticComponent<any>,
> = GenericComponent extends React.ForwardRefExoticComponent<React.RefAttributes<infer InferedRefValue>>
	? Simp<InferedRefValue>
	: never;

type Errors<T> = {
	[K in keyof T]?: string;
};

function initializeErrors<T, >(values: T): Errors<T> {
	const errors: Errors<T> = {};
	for (const key in values) {
		if (Object.prototype.hasOwnProperty.call(values, key)) {
			errors[key] = undefined;
		}
	}
	return errors;
}

export function useFormBuilder<
	GenericInputs extends Record<string, TemplateInput>,
>(
	inputsObject: GenericInputs,
) {
	const inputEntries = Object.entries(inputsObject);

	const defaultState = Object.fromEntries(
		inputEntries.map(
			([key, input]) => [
				key,
				input.params.defaultValue,
			],
		),
	) as GetInputValues<GenericInputs>;

	return forwardRef<
		RefValue<GenericInputs>
	>(
		(props, ref) => {
			const formRef = useRef<HTMLFormElement>(null);

			const FIRST_ERROR_INDEX = 0;

			const [values, setValues] = useState<GetInputValues<GenericInputs>>({ ...defaultState });

			const [errors, setErrors] = useState<Errors<GetInputValues<GenericInputs>>>(initializeErrors(values));

			useImperativeHandle(
				ref,
				() => ({
					values: new Proxy(
						values,
						{
							get(target, prop) {
								return target[prop as string];
							},
							set(target, prop, value) {
								setValues({
									...target,
									[prop]: value,
								});

								return true;
							},
						},
					),
					check(): Promise<Simp<GetOutputValues<GenericInputs>> | null> {
						return new Promise((resolve) => {
							const result = Object.fromEntries(
								inputEntries.map(
									([key, input]) => {
										const value = values[key];
										const schema = input.params.zodSchema;

										if (schema) {
											const parsedValue = schema.safeParse(value);

											if (!parsedValue.success) {
												setErrors((prevErrors) => ({
													...prevErrors,
													[key]: parsedValue.error.errors[FIRST_ERROR_INDEX].message,
												}));

												return [key, undefined];
											}

											setErrors((prevErrors) => ({
												...prevErrors,
												[key]: undefined,
											}));
											return [key, parsedValue.data];
										}

										return [key, value];
									},
								),
							) as Simp<GetOutputValues<GenericInputs>>;
							resolve(result);
						});
					},
					reset(): void {
						setValues({ ...defaultState });
					},
				}),
			);

			return (
				<form ref={formRef}>
					{
						inputEntries.map(
							([name, { Template }], index) => (
								<div key={index}>
									<Template
										onChange={(value) => void setValues({
											...values,
											[name]: value,
										})}
										value={values[name]}
										errorMessage={errors[name]}
									/>
								</div>
							),
						)
					}
				</form>
			);
		},
	);
}

import React from "react";
import { type ZodType } from "zod";

type InputComponent<
	GenericProps extends InputComponentProps = InputComponentProps,
> = (props: GenericProps) => React.ReactElement;

interface UseInputParams<
	GenericProps extends object = any,
> {
	label?: string;
	defaultValue?: "value" extends keyof GenericProps ? GenericProps["value"] : never;
	props?: Omit<GenericProps, keyof InputComponentProps>;
	zodSchema?: ZodType;
}

interface InputComponentProps {
	onChange(value: any): void;
	value: any;
	errorMessage?: string;
	label?: string;
	[key: string]: any;
}

export interface TemplateInput<
	GenericProps extends UseInputParams = UseInputParams,
> {
	params: GenericProps;
	Template(prop: InputComponentProps): React.ReactElement;
}

export function useInput<
	GenericProps extends InputComponentProps,
	GenericParams extends UseInputParams<GenericProps>,
>(
	component: InputComponent<GenericProps>,
	params: GenericParams,
) {
	const Component = component as InputComponent;

	return {
		params,
		Template: ((props: InputComponentProps) => {
			const mergedProps = {
				...props,
				...params.props,
				onChange: props.onChange,
				value: props.value,
				errorMessage: props.errorMessage,
				label: params.label,
			};

			return (
				<>
					{params.label && <label htmlFor={params.label}>{params.label}</label>}
					<Component {...mergedProps} />
					{props.errorMessage && <span>{props.errorMessage}</span>}
				</>
			);
		}),
	} as TemplateInput<GenericParams>;
}

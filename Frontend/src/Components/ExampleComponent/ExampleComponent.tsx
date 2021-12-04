import { Button, ButtonProps } from '@mui/material';
import React from 'react';

/**
 * JsDoc interface documentation
 * Export optional
 */
export interface IExampleComponentProps extends ButtonProps {
	/*Property documentation. This value will appear before the button.*/
	customValue?: string;
	/*Text to place on the button*/
	buttonText: string;
}

/**
 * JsDoc documentation
 * @param props see {@link IExampleComponentProps}
 * @returns a component, duh
 */
export const ExampleComponent: React.FC<IExampleComponentProps> = ({ customValue = 'DefaultValue', ...props }) => {
	//return type is often not needed.
	return (
		<>
			<p>ExampleComponent customValue field: {customValue}</p>
			<Button {...props}>{props.buttonText}</Button>
		</>
	);
};

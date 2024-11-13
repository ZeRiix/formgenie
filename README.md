<a name="top"></a>

<p align="center">
  <img src="./logo.webp" alt="logo" weight="150px" width="150px" />
</p>
<p align="center">
  <span style="font-size: 24px; font-weight: bold;">FormGenie React</span>
</p>
<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/types-TypeScript-blue?logo=typescript&style=plastic" alt="lang" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/tsx-React-blue?logo=react&style=plastic" alt="lang" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/coverage-95%25-green?style=plastic" alt="lang">
  </a>
  <a href="https://www.npmjs.com/package/formgenie-react">
    <img src="https://img.shields.io/npm/v/formgenie-react" alt="lib">
  </a>
</p>

`formgenie-react` is a library that helps you to generate forms in React. It is a simple and easy-to-use library that allows you to create forms with minimal code.

## Installation

```bash
npm install formgenie-react zod
```

# Usage

### 1. import the necessary modules

```tsx
import React from 'react';
import { useFormBuilder, usseInput, type GetRef } from 'formgenie-react';
import { z } from 'zod';
```

### 2 Create Imput (optional)

```tsx
import React from 'react';

export function InputTest(
    props: {
        tt: string // exemple of other props
        onChange: (value: string) => void // is use set value of input
        value: string, // is use get value of input
        errorMessage?: string  // is use get message error of zod schema
    }
) {
    return (
        <>
            <input
                type="text" 
                onChange={(event) => props.onChange(event.target.value)}
                value={props.value}
            />
            {props.errorMessage && <div>{props.errorMessage}</div>}
        </>
    );
}
```

> [!NOTE]
> In this example, we have created a component `InputTest` which is a simple input.
> The component has the following properties:  
> - `tt`: an arbitrary property
> - `onChange`: a function that takes the input value as a parameter
> - `value`: the value of the input
> - `errorMessage`: the error message from the zod schema validation (optional)  

> [!IMPORTANT]
> For a component to be usable by `formgenie-react`, it must have at least the following properties:  
>   - `onChange`: a function that takes the input value as a parameter
>   - `value`: the value of the input
>   - `errorMessage`: the error message from the zod schema validation (optional)  
>
> You can add other properties to your component, they will be definable in the form.

### 2. Create Form

```tsx
import { useFormBuilder, useInput } from 'formgenie-react';
import { z } from 'zod';
import { InputTest } from './your/path/to/InputTest';

const Form = useFormBuilder({
    name: useInput(
        InputTest,
        {
            defaultValue: "test",
            zodSchema: z.coerce.number(),
            props: {
                tt: "rrr",
            }
        },
    ),
    prenom: useInput(
        InputTest,
        {
            defaultValue: "test",
            zodSchema: z.coerce.number(),
            props: {
                tt: "rrr"
            }
        },
    )
});
```

> [!NOTE]
> In this example, we have created a form with two fields:
>   - `name`: a field of type `InputTest` with the following properties:
>     - `defaultValue`: the default value of the field
>     - `zodSchema`: the validation schema of the field
>     - `props`: additional properties of the field
>   - `prenom`: a field of type `InputTest` with the following properties:
>     - `defaultValue`: the default value of the field
>     - `zodSchema`: the validation schema of the field
>     - `props`: additional properties of the field  
>
> You can add as many fields as you want.  
> It is from the `props` that you can define the additional properties of your component.

### 3. Use Form

```tsx
import React, { useRef } from 'react';
import type { GetRef } from 'formgenie-react';
import { Form } from './your/path/to/Form';

function TestForm() {

    const formRef = useRef<GetRef<typeof Form>>(null);
	
    const submit = async () => {
        if (formRef.current) {
            try {
                const result = await formRef.current.check();
                console.log(result);
			} catch (error) {
                console.error(error);
            }
        }
    };

    const reset = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
};

    return (
        <>
            <Form ref={formRef} />
            <button onClick={submit}>Submit</button>
            <button onClick={reset}>Reset</button>
        </>
    );
}
```

> [!NOTE]
> In this example, we have created a `TestForm` component that contains a `Form`.
> We have also created two functions:  
>   - `submit`: which is an example of form submission  
>   - `reset`: which is an example of form reset  
>
> To use a form created with **formgenie-react**, you need to give it a `ref` typed from the form.  
> For this, **formgenie-react** exports a `GetRef` type that allows you to retrieve the type of the form's `ref`.

> [!IMPORTANT]
> To access the form values, you can do so through the form's ref.  
> The `check` function allows you to check if the form is valid and return the field values as an object.  
> The `reset` function allows you to reset the field values of the form. It does so based on the values set in the `defaultValue` of the fields.  

### 4. Implement Form

```tsx
import React from 'react';
import { TestForm } from './your/path/to/Form';

export function App() {
    return (
        <TestForm />
    );
}
```

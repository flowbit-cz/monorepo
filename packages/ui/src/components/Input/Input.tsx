import { useId, type ComponentProps } from "react";
import { controlClasses, Field, fieldDescribedBy } from "./Field";

export interface InputProps extends Omit<ComponentProps<"input">, "id"> {
    label: string;
    hint?: string;
    error?: string;
    id?: string;
    /** Class of the wrapping field. */
    className?: string;
}

/** Text-like input with label, hint and error. Works with react-hook-form's `register()`. */
export function Input({ label, hint, error, id, className, ...props }: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
        <Field id={inputId} label={label} hint={hint} error={error} className={className}>
            <input
                id={inputId}
                className={controlClasses(Boolean(error))}
                aria-invalid={error ? true : undefined}
                aria-describedby={fieldDescribedBy(inputId, { hint, error })}
                {...props}
            />
        </Field>
    );
}

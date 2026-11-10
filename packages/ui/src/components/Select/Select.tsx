import { useId, type ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { controlClasses, Field, fieldDescribedBy } from "../Input/Field";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends Omit<ComponentProps<"select">, "id" | "children"> {
    label: string;
    options: SelectOption[];
    /** Label of the empty first option ("Any destination"). Omit it to require a value. */
    placeholder?: string;
    hint?: string;
    error?: string;
    id?: string;
    className?: string;
}

/** Native select (best accessibility and mobile UX) with label, hint and error. */
export function Select({ label, options, placeholder, hint, error, id, className, ...props }: SelectProps) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (
        <Field id={selectId} label={label} hint={hint} error={error} className={className}>
            <select
                id={selectId}
                className={cn(controlClasses(Boolean(error)), "appearance-auto")}
                aria-invalid={error ? true : undefined}
                aria-describedby={fieldDescribedBy(selectId, { hint, error })}
                {...props}
            >
                {placeholder !== undefined && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}

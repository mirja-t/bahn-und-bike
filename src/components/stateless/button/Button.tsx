import "./button.scss";

export interface ButtonProps {
    label: string;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary";
    onClick?: () => void;
    disabled?: boolean;
}
export const Button = ({
    label,
    type,
    variant,
    onClick,
    disabled,
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={variant ? `button button-${variant}` : "button"}
            type={type}
            disabled={disabled}
        >
            <span>{label}</span>
        </button>
    );
};

import "./button.scss";

export interface ButtonProps {
    label: string;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary";
    onClick?: () => void;
}
export const Button = ({ label, type, variant, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`button button-${variant}`}
            type={type}
        >
            <span>{label}</span>
        </button>
    );
};

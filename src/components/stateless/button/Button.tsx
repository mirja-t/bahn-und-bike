import "./button.scss";

export interface ButtonProps {
    label: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}
export const Button = ({ label, type, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className="button" type={type}>
            <span>{label}</span>
        </button>
    );
};

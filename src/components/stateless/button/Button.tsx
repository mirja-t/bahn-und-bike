import './button.scss';

interface ButtonProps {
    label: string;
    type?: "button" | "submit" | "reset";
}
export const Button = ({label, type}: ButtonProps) => {
    return (<button className="button" type={type}>
        <span>{label}</span>
    </button>)
}
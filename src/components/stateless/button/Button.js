import './button.scss';

export const Button = ({label, type}) => {
    return (<button className="button" type={type}>
        <span>{label}</span>
    </button>)
}
import "./zoompanel.scss";

interface ZoomPanelProps {
    fn: (arg0: string) => void;
}

export const ZoomPanel = ({ fn }: ZoomPanelProps) => {
    return (
        <div id="zoompanel">
            <button
                onClick={() => {
                    fn("+");
                }}
            >
                +
            </button>
            <button
                onClick={() => {
                    fn("-");
                }}
            >
                -
            </button>
        </div>
    );
};

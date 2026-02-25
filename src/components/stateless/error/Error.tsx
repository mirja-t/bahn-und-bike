import "./error.scss";

export const Error = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="error">
            <div id="error">
                <p>{children || "Failed to load"}</p>
            </div>
        </div>
    );
};

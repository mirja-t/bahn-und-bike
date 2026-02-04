import "./header.scss";
interface HeaderProps {
    children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
    return <div id="header">{children}</div>;
};

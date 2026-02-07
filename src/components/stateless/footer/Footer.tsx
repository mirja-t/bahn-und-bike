import "./footer.scss";
interface FooterProps {
    children: React.ReactNode;
}

export const Footer = ({ children }: FooterProps) => {
    return <div id="footer">{children}</div>;
};

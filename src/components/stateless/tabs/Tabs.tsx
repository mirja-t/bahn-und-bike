import React, { type ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../button/Button";
import "./tabs.scss";
import ScrollContainer from "../scrollcontainer/ScrollContainer";

type TabProps = {
    id: string;
    name: string;
    children: ReactNode | ReactNode[];
    active?: boolean;
};
type TabsProps = {
    children: ReactNode | ReactNode[];
    height?: string;
    activeTabId?: string;
    setActiveTabId?: (id: string) => void;
};

const Tab = ({ children, id }: TabProps) => {
    return (
        <div data-testid={`tab-${id}`} className="tab">
            {children}
        </div>
    );
};
type TabHeaderProps = { children: ReactNode };
const TabHeader = ({ children }: TabHeaderProps) => {
    return <div className="tabheader">{children}</div>;
};

const Tabs = ({ children, height, activeTabId, setActiveTabId }: TabsProps) => {
    const tabs = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === Tab,
    ) as React.ReactElement<TabProps>[];
    const [activeId, setActiveId] = useState<string>(() => {
        // Set the initial active tab to the first one or the one with active prop
        const activeTab = tabs.find((tab) => tab.props.active);
        return activeTab
            ? activeTab.props.id
            : (tabs[0] && tabs[0].props.id) || "";
    });
    useEffect(() => {
        if (activeTabId) {
            setActiveId(activeTabId);
        }
    }, [activeTabId]);

    return (
        <ScrollContainer className="tabs" height={height}>
            <ScrollContainer.FitContent className="tabs-fit-content">
                <nav
                    aria-label="Tabs"
                    data-testid="tabs"
                    className="flex -mb-5 justify-between"
                >
                    <ul className="flex space-x-1">
                        {tabs.map((tab) => (
                            <li
                                key={tab.props.id}
                                className={
                                    tab.props.id === activeId ? "active" : ""
                                }
                            >
                                <Button
                                    key={tab.props.id}
                                    onClick={() => {
                                        setActiveId(tab.props.id);
                                        setActiveTabId &&
                                            setActiveTabId(tab.props.id);
                                    }}
                                    label={tab.props.name}
                                />
                            </li>
                        ))}
                    </ul>
                </nav>
            </ScrollContainer.FitContent>

            <ScrollContainer.ScrollContent className="tabs-scroll-content">
                <div className="">
                    <div className="">
                        <AnimatePresence mode="popLayout">
                            {tabs.map(
                                (tab) =>
                                    tab.props.id === activeId && (
                                        <motion.div
                                            key={tab.props.id}
                                            initial={{
                                                scale: 0.8,
                                                opacity: 0,
                                                x: "-50%",
                                            }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            exit={{
                                                scale: 0.8,
                                                opacity: 0,
                                                x: "50%",
                                            }}
                                            transition={{
                                                type: "tween",
                                                duration: 0.2,
                                            }}
                                        >
                                            <Tab
                                                id={tab.props.id}
                                                name={tab.props.name}
                                            >
                                                {tab.props.children}
                                            </Tab>
                                        </motion.div>
                                    ),
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                {/* overlay for round borders beneath scrollbar */}
                <div className=""></div>
            </ScrollContainer.ScrollContent>
        </ScrollContainer>
    );
};

export default Object.assign(Tabs, { Tab, TabHeader });

import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./errorBoundary.module.scss";
import { Panel } from "../panel/Panel";
import { Button } from "../button/Button";

interface ErrorBoundaryFallbackProps {
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (props: ErrorBoundaryFallbackProps) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    eventId: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            eventId: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Generate a unique event ID for this error
        const eventId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        this.setState({
            error,
            errorInfo,
            eventId,
        });

        // Log error details
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // In production, you might want to send this to an error reporting service
        if (process.env.NODE_ENV === "production") {
            // Example: Send to error reporting service
            // errorReportingService.captureException(error, { extra: errorInfo, tags: { eventId } });
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback({
                    error: this.state.error,
                    errorInfo: this.state.errorInfo,
                });
            }

            // Default fallback UI
            return (
                <div className={styles.errorBoundary}>
                    <div className={styles.container}>
                        <Panel>
                            <div className={styles.innerWrapper}>
                                <div className={styles.icon}>
                                    <svg
                                        width="64"
                                        height="64"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>

                                <h2>Oops! Something went wrong</h2>

                                <p>
                                    We're sorry, but something unexpected
                                    happened while loading your bike and train
                                    route information. This could be due to a
                                    temporary connection issue or a problem with
                                    the route data.
                                </p>

                                <div className="button-wrapper">
                                    <Button
                                        type="button"
                                        onClick={this.handleReload}
                                        variant="primary"
                                        label={"Reload Page"}
                                    />
                                </div>

                                {process.env.NODE_ENV === "development" &&
                                    this.state.error && (
                                        <details>
                                            <summary>
                                                Error Details (Development Mode)
                                            </summary>
                                            <div>
                                                <h4>Error:</h4>
                                                <pre>
                                                    {this.state.error.toString()}
                                                </pre>

                                                {this.state.errorInfo && (
                                                    <>
                                                        <h4>
                                                            Component Stack:
                                                        </h4>
                                                        <pre>
                                                            {
                                                                this.state
                                                                    .errorInfo
                                                                    .componentStack
                                                            }
                                                        </pre>
                                                    </>
                                                )}

                                                {this.state.eventId && (
                                                    <p>
                                                        Event ID:{" "}
                                                        {this.state.eventId}
                                                    </p>
                                                )}
                                            </div>
                                        </details>
                                    )}
                            </div>
                        </Panel>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

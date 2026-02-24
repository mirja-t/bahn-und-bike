import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ErrorBoundary from "../components/stateless/errorBoundary/ErrorBoundary";

/**
 * ErrorBoundary with Render Prop Pattern
 *
 * The fallback prop now accepts a render function that receives:
 * - error: The caught error object
 * - errorInfo: React ErrorInfo with componentStack
 * - resetErrorBoundary: Function to reset the error state
 * - eventId: Unique identifier for this error occurrence
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary
 *   fallback={({ error, errorInfo, resetErrorBoundary, eventId }) => (
 *     <CustomErrorUI
 *       error={error}
 *       onRetry={resetErrorBoundary}
 *       eventId={eventId}
 *     />
 *   )}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error("This is a test error for the ErrorBoundary!");
    }
    return <div>This component is working fine!</div>;
};

// Component that throws an error after some interaction
const ConditionalError = () => {
    const [shouldThrow, setShouldThrow] = useState(false);

    return (
        <div style={{ padding: "2rem" }}>
            <h3>Interactive Error Test</h3>
            <p>Click the button below to trigger an error:</p>
            <button
                onClick={() => setShouldThrow(true)}
                style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}
            >
                Trigger Error
            </button>
            <ThrowError shouldThrow={shouldThrow} />
        </div>
    );
};

const meta = {
    title: "Stateless/ErrorBoundary",
    component: ErrorBoundary,
    tags: ["autodocs"],
    argTypes: {
        children: { control: false },
        fallback: {
            control: false,
            description:
                "Render function that receives error, errorInfo, resetErrorBoundary, and eventId props",
        },
        onError: { action: "error-caught" },
    },
    args: {},
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Normal working state
export const Default: Story = {
    args: {
        children: (
            <div style={{ padding: "2rem" }}>
                <h2>Working Component</h2>
                <p>
                    This component is working normally inside the ErrorBoundary.
                </p>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        marginTop: "1rem",
                    }}
                >
                    <div
                        style={{
                            padding: "1rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    >
                        <h4>Route Info</h4>
                        <p>Berlin → Hamburg</p>
                        <p>Duration: 1h 45m</p>
                    </div>
                    <div
                        style={{
                            padding: "1rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    >
                        <h4>Bike Path</h4>
                        <p>Elbe Cycle Route</p>
                        <p>Distance: 120km</p>
                    </div>
                </div>
            </div>
        ),
    },
};

// Error state with default fallback
export const WithError: Story = {
    args: {
        children: <ThrowError shouldThrow={true} />,
    },
};

// Error state with custom fallback
export const WithCustomFallback: Story = {
    args: {
        children: <ThrowError shouldThrow={true} />,
        fallback: ({ error }) => (
            <div
                style={{
                    padding: "3rem",
                    textAlign: "center",
                    background: "#fff3cd",
                    border: "1px solid #ffeaa7",
                    borderRadius: "8px",
                    margin: "2rem",
                }}
            >
                <h3 style={{ color: "#856404", marginBottom: "1rem" }}>
                    🚧 Route Loading Issue
                </h3>
                <p style={{ color: "#856404", marginBottom: "1rem" }}>
                    We're having trouble loading your bike and train route data.
                    Please check your connection and try again.
                </p>
                {error && (
                    <p
                        style={{
                            color: "#721c24",
                            fontSize: "0.875rem",
                            marginBottom: "1rem",
                        }}
                    >
                        Error: {error.message}
                    </p>
                )}
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                    }}
                >
                    <button
                        style={{
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        ),
    },
};

// Interactive error trigger
export const InteractiveError: Story = {
    args: {
        children: <ConditionalError />,
        onError: (error, errorInfo) => {
            console.log("Error caught by boundary:", error);
            console.log("Error info:", errorInfo);
        },
    },
};

// Multiple components with individual error boundaries
export const MultipleComponents: Story = {
    args: {
        children: <></>,
    },
    render: (args) => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                padding: "2rem",
            }}
        >
            <ErrorBoundary
                {...args}
                fallback={({ error }) => (
                    <div
                        style={{
                            padding: "1rem",
                            background: "#f8d7da",
                            border: "1px solid #f5c6cb",
                            borderRadius: "4px",
                        }}
                    >
                        <p
                            style={{
                                color: "#721c24",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                            }}
                        >
                            ⚠️ Component A Error
                        </p>
                        {error && (
                            <p
                                style={{
                                    color: "#721c24",
                                    fontSize: "0.75rem",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {error.message}
                            </p>
                        )}
                    </div>
                )}
            >
                <div
                    style={{
                        padding: "1rem",
                        border: "1px solid #28a745",
                        borderRadius: "4px",
                    }}
                >
                    <h3 style={{ color: "#28a745" }}>Working Component A</h3>
                    <p>This component is working fine.</p>
                </div>
            </ErrorBoundary>

            <ErrorBoundary
                {...args}
                fallback={({ error }) => (
                    <div
                        style={{
                            padding: "1rem",
                            background: "#f8d7da",
                            border: "1px solid #f5c6cb",
                            borderRadius: "4px",
                        }}
                    >
                        <p
                            style={{
                                color: "#721c24",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                            }}
                        >
                            ⚠️ Component B Error
                        </p>
                        {error && (
                            <p
                                style={{
                                    color: "#721c24",
                                    fontSize: "0.75rem",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {error.message}
                            </p>
                        )}
                    </div>
                )}
            >
                <div
                    style={{
                        padding: "1rem",
                        border: "1px solid #dc3545",
                        borderRadius: "4px",
                    }}
                >
                    <h3 style={{ color: "#dc3545" }}>Broken Component B</h3>
                    <ThrowError shouldThrow={true} />
                </div>
            </ErrorBoundary>
        </div>
    ),
};

// Nested error boundaries
export const NestedBoundaries: Story = {
    args: {
        children: <></>,
    },
    render: (args) => (
        <ErrorBoundary
            {...args}
            fallback={({ error }) => (
                <div
                    style={{
                        padding: "2rem",
                        background: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        borderRadius: "4px",
                    }}
                >
                    <h4 style={{ color: "#721c24", marginBottom: "1rem" }}>
                        Outer boundary caught the error!
                    </h4>
                    {error && (
                        <p
                            style={{
                                color: "#721c24",
                                fontSize: "0.875rem",
                                marginBottom: "1rem",
                            }}
                        >
                            Error: {error.message}
                        </p>
                    )}
                </div>
            )}
        >
            <div
                style={{
                    padding: "2rem",
                    border: "2px solid #007bff",
                    borderRadius: "8px",
                }}
            >
                <h3>Outer Boundary Content</h3>
                <p>This content is protected by the outer error boundary.</p>

                <ErrorBoundary
                    fallback={({ error }) => (
                        <div
                            style={{
                                padding: "1rem",
                                background: "#fff3cd",
                                border: "1px solid #ffeaa7",
                                borderRadius: "4px",
                            }}
                        >
                            <h5
                                style={{
                                    color: "#856404",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                Inner boundary caught the error!
                            </h5>
                            {error && (
                                <p
                                    style={{
                                        color: "#856404",
                                        fontSize: "0.75rem",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Error: {error.message}
                                </p>
                            )}
                        </div>
                    )}
                >
                    <div
                        style={{
                            padding: "1rem",
                            border: "1px solid #6c757d",
                            borderRadius: "4px",
                            marginTop: "1rem",
                        }}
                    >
                        <h4>Inner Boundary Content</h4>
                        <ThrowError shouldThrow={true} />
                    </div>
                </ErrorBoundary>
            </div>
        </ErrorBoundary>
    ),
};

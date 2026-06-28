// test-utils.tsx
import { createMockStore } from "@/stories/MockSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";

export function renderWithProviders(children: ReactElement) {
    const mockStore = createMockStore();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                cacheTime: 0,
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <Provider store={mockStore}>{children}</Provider>
        </QueryClientProvider>,
    );
}

// test-utils.tsx
import { createMockStore } from "@/stories/MockSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import type { RootState } from "@/store";

type RenderWithProvidersOptions = {
    preloadedState?: Partial<RootState>;
    route?: string;
};

export function renderWithProviders(
    children: ReactElement,
    options: RenderWithProvidersOptions = {},
) {
    const { preloadedState = {}, route = "/" } = options;
    const mockStore = createMockStore(preloadedState);
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
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
            </Provider>
        </QueryClientProvider>,
    );
}

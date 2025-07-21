import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NavigationBar from "@/components/NavigationBar.vue";

const mockRoute = {
  path: "/test-path",
};

vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
}));

describe("NavigationBar", () => {
  beforeEach(() => {
    mockRoute.path = "/test-path";
  });

  const mountComponent = () => {
    return mount(NavigationBar, {
      global: {
        mocks: {
          $route: mockRoute,
        },
      },
    });
  };

  it("renders properly", () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it("displays navigation links", () => {
    const wrapper = mountComponent();
    const links = wrapper.findAll('[data-slot="navigation-menu-link"]');
    expect(links.length).toBe(2);
  });

  it("applies border-2 class when route path is '/'", () => {
    mockRoute.path = "/";

    const wrapper = mountComponent();

    const homeLink = wrapper.find(
      '[data-slot="navigation-menu-link"][href="/"]',
    );
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.classes()).toContain("border-2");
  });

  it("does not apply border-2 class when route path is not '/'", () => {
    mockRoute.path = "/anime";

    const wrapper = mountComponent();

    const homeLink = wrapper.find(
      '[data-slot="navigation-menu-link"][href="/"]',
    );
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.classes()).not.toContain("border-2");
  });
});

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NavigationBar from "@/components/NavigationBar.vue";

const mockRoute = {
  path: "/test-path",
};

vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
}));

const NavigationMenu = {
  name: "NavigationMenu",
  template: '<div data-testid="navigation-menu"><slot /></div>',
};
const NavigationMenuList = {
  name: "NavigationMenuList",
  template: '<div data-testid="navigation-menu-list"><slot /></div>',
};
const NavigationMenuItem = {
  name: "NavigationMenuItem",
  template: '<div data-testid="navigation-menu-item"><slot /></div>',
};
const NavigationMenuLink = {
  name: "NavigationMenuLink",
  template: '<div data-testid="navigation-menu-link"><slot /></div>',
};
const ThemeSwitcher = {
  name: "ThemeSwitcher",
  template: '<div data-testid="theme-switcher"><slot /></div>',
};

describe("NavigationBar", () => {
  beforeEach(() => {
    // Reset mock before each test
    mockRoute.path = "/test-path";
  });

  const mountComponent = () => {
    return mount(NavigationBar, {
      global: {
        mocks: {
          $route: mockRoute,
        },
        components: {
          NavigationMenu,
          NavigationMenuList,
          NavigationMenuItem,
          NavigationMenuLink,
          ThemeSwitcher,
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
    const links = wrapper.findAll('[data-testid="navigation-menu-link"]');
    expect(links.length).toBe(2);
  });

  it("applies border-2 class when route path is '/'", () => {
    mockRoute.path = "/";

    const wrapper = mountComponent();

    const homeLink = wrapper.find(
      '[data-testid="navigation-menu-link"][href="/"]',
    );
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.classes()).toContain("border-2");
  });

  it("does not apply border-2 class when route path is not '/'", () => {
    // Keep mock route as non-home path
    mockRoute.path = "/anime";

    const wrapper = mountComponent();

    const homeLink = wrapper.find(
      '[data-testid="navigation-menu-link"][href="/"]',
    );
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.classes()).not.toContain("border-2");
  });
});

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

// Mock useColorMode
const mockMode = ref("light");
vi.mock("@vueuse/core", () => ({
  useColorMode: () => mockMode,
}));

// Mock lucide-vue-next icons
vi.mock("lucide-vue-next", () => ({
  Moon: {
    name: "Moon",
    template: '<div data-testid="moon-icon"></div>',
  },
  Sun: {
    name: "Sun",
    template: '<div data-testid="sun-icon"></div>',
  },
}));

// Mock dropdown components
const DropdownMenu = {
  name: "DropdownMenu",
  template: '<div data-testid="dropdown-menu"><slot /></div>',
};

const DropdownMenuTrigger = {
  name: "DropdownMenuTrigger",
  props: ["asChild"],
  template: '<div data-testid="dropdown-trigger"><slot /></div>',
};

const DropdownMenuContent = {
  name: "DropdownMenuContent",
  props: ["align"],
  template: '<div data-testid="dropdown-content"><slot /></div>',
};

const DropdownMenuItem = {
  name: "DropdownMenuItem",
  template:
    '<button data-testid="dropdown-item" @click="$emit(\'click\')"><slot /></button>',
  emits: ["click"],
};

const Button = {
  name: "Button",
  props: ["variant"],
  template:
    '<button data-testid="theme-button" :class="variant"><slot /></button>',
};

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    mockMode.value = "light";
  });

  const mountComponent = () => {
    return mount(ThemeSwitcher, {
      global: {
        components: {
          DropdownMenu,
          DropdownMenuTrigger,
          DropdownMenuContent,
          DropdownMenuItem,
          Button,
        },
      },
    });
  };

  it("renders correctly", () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-testid="dropdown-menu"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="theme-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="moon-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sun-icon"]').exists()).toBe(true);
  });

  it("displays dropdown menu items", () => {
    const wrapper = mountComponent();

    const dropdownItems = wrapper.findAll('[data-testid="dropdown-item"]');
    expect(dropdownItems).toHaveLength(3);
    expect(dropdownItems[0].text()).toBe("Light");
    expect(dropdownItems[1].text()).toBe("Dark");
    expect(dropdownItems[2].text()).toBe("System");
  });

  it("switches to light mode when light option is clicked", async () => {
    const wrapper = mountComponent();

    const lightItem = wrapper.findAll('[data-testid="dropdown-item"]')[0];
    await lightItem.trigger("click");

    expect(mockMode.value).toBe("light");
  });

  it("switches to dark mode when dark option is clicked", async () => {
    const wrapper = mountComponent();

    const darkItem = wrapper.findAll('[data-testid="dropdown-item"]')[1];
    await darkItem.trigger("click");

    expect(mockMode.value).toBe("dark");
  });

  it("switches to system mode when system option is clicked", async () => {
    const wrapper = mountComponent();

    const systemItem = wrapper.findAll('[data-testid="dropdown-item"]')[2];
    await systemItem.trigger("click");

    expect(mockMode.value).toBe("auto");
  });

  it("maintains reactive mode state", async () => {
    const wrapper = mountComponent();

    mockMode.value = "dark";
    await wrapper.vm.$nextTick();

    expect(mockMode.value).toBe("dark");

    const lightItem = wrapper.findAll('[data-testid="dropdown-item"]')[0];
    await lightItem.trigger("click");

    expect(mockMode.value).toBe("light");
  });
});

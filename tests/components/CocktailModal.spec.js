import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import CocktailModal from "../../src/components/CocktailModal.vue";
import gsap from "gsap";

// Mock gsap.fromTo for animations
vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
  },
}));

describe("CocktailModal.vue", () => {
  const baseCocktail = {
    idDrink: "123",
    strDrink: "Test Cocktail",
    strDrinkThumb: "thumb-url",
    strCategory: "Category",
    strAlcoholic: "Alcoholic",
    strGlass: "Highball glass",
    strTags: "tag1,tag2",
    strInstructions: "Step 1. Step 2.",
    strVideo: "https://youtube.com/test",
    strIngredient1: "Gin",
    strMeasure1: "50 ml",
    strIngredient2: "Tonic Water",
    strMeasure2: "100 ml",
    strIngredient3: "",
    strMeasure3: "",
  };

  let wrapper;
  const isFavorite = false;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(CocktailModal, {
      props: {
        cocktail: baseCocktail,
        isFavorite,
      },
    });
  });

  it("renders cocktail image and title", () => {
    expect(wrapper.find("img").attributes("src")).toBe(
      baseCocktail.strDrinkThumb
    );
    expect(wrapper.find("h2").text()).toBe(baseCocktail.strDrink);
  });

  it("formats and displays tags", () => {
    const tagElement = wrapper.find("p.text-gray-500");
    expect(tagElement.exists()).toBe(true);
    expect(tagElement.text()).toBe("#tag1 #tag2");
  });

  it("displays category, alcoholic and glass badges", () => {
    const badges = wrapper.findAll("span.px-2");
    const badgeTexts = badges.map((b) => b.text());
    expect(badgeTexts).toContain(baseCocktail.strCategory);
    expect(badgeTexts).toContain(baseCocktail.strAlcoholic);
    expect(badgeTexts).toContain(baseCocktail.strGlass);
  });

  it("renders ingredients list correctly", () => {
    const items = wrapper.findAll("li.flex");
    expect(items).toHaveLength(2);
    expect(items[0].text()).toContain("Gin");
    expect(items[0].text()).toContain("50 ml");
    expect(items[1].text()).toContain("Tonic Water");
    expect(items[1].text()).toContain("100 ml");
  });

  it("renders instructions", () => {
    expect(wrapper.find("div.prose p").text()).toBe(
      baseCocktail.strInstructions
    );
  });

  it("renders video tutorial link when strVideo is present", () => {
    const link = wrapper.find("a");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe(baseCocktail.strVideo);
    expect(link.text()).toContain("Watch on YouTube");
  });

  it("emits close when backdrop or close button is clicked", async () => {
    // Backdrop click
    await wrapper.find("div.fixed").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);

    // Close button click (X icon)
    const [closeBtn] = wrapper.findAll("button");
    await closeBtn.trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });

  it("emits toggle-favorite with cocktail when heart button is clicked", async () => {
    const heartBtn = wrapper
      .findAll("button")
      .find((btn) => btn.classes().some((c) => c.includes("right-16")));
    await heartBtn.trigger("click");
    expect(wrapper.emitted("toggle-favorite")).toBeTruthy();
    expect(wrapper.emitted("toggle-favorite")[0]).toEqual([baseCocktail]);
  });

  it("calls gsap.fromTo for modal and ingredients animations on mount", () => {
    expect(gsap.fromTo).toHaveBeenCalledTimes(2);
    const calls = gsap.fromTo.mock.calls;
    expect(calls[0][0]).toBe(wrapper.vm.modalContent);
    expect(calls[1][0]).toBeInstanceOf(NodeList || Array);
  });
});

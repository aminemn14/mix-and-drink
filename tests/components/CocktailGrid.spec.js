import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import CocktailGrid from "../../src/components/CocktailGrid.vue";
import gsap from "gsap";

// Mock gsap.fromTo to avoid real animations
vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
  },
}));

describe("CocktailGrid.vue", () => {
  const mockCocktails = [
    {
      idDrink: "1",
      strDrink: "Mojito",
      strDrinkThumb: "url-1",
      strCategory: "Classic",
      strAlcoholic: "Alcoholic",
      strInstructions: "Mix ingredients.",
    },
    {
      idDrink: "2",
      strDrink: "Margarita",
      strDrinkThumb: "url-2",
      strCategory: "Cocktail",
      strAlcoholic: "Alcoholic",
      strInstructions: "Shake well.",
    },
  ];

  let wrapper;
  const favorites = [mockCocktails[1]];

  beforeEach(() => {
    wrapper = mount(CocktailGrid, {
      props: {
        cocktails: mockCocktails,
        favorites,
      },
    });
  });

  it("renders the correct number of cocktail cards", () => {
    const cards = wrapper.findAll(".group");
    expect(cards).toHaveLength(mockCocktails.length);
  });

  it("applies animation classes based on index", () => {
    const [firstCard, secondCard] = wrapper.findAll(".group");
    expect(firstCard.classes()).toContain("fade-in-up-1");
    expect(secondCard.classes()).toContain("fade-in-up-2");
  });

  it('emits "toggle-favorite" with the correct cocktail on favorite button click', async () => {
    // First button in the first card is the favorite toggle
    const firstFavoriteBtn = wrapper.findAll(".group")[0].find("button");
    await firstFavoriteBtn.trigger("click");
    expect(wrapper.emitted("toggle-favorite")).toBeTruthy();
    expect(wrapper.emitted("toggle-favorite")[0]).toEqual([mockCocktails[0]]);
  });

  it('emits "view-details" with the correct cocktail on view recipe button click', async () => {
    // Second button in the first card is the "View Recipe" button
    const firstCardButtons = wrapper.findAll(".group")[0].findAll("button");
    const viewBtn = firstCardButtons[1];
    await viewBtn.trigger("click");
    expect(wrapper.emitted("view-details")).toBeTruthy();
    expect(wrapper.emitted("view-details")[0]).toEqual([mockCocktails[0]]);
  });

  it("highlights favorite cocktails correctly", () => {
    // Heart icons have size h-5, filter those
    const heartIcons = wrapper
      .findAll("svg")
      .filter((svg) => svg.classes().includes("h-5"));
    // First cocktail is not favorite -> gray
    expect(heartIcons[0].classes()).toContain("text-gray-400");
    // Second cocktail is favorite -> red
    expect(heartIcons[1].classes()).toContain("text-red-500");
  });

  it("calls gsap.fromTo on mounted to animate cards", () => {
    expect(gsap.fromTo).toHaveBeenCalled();
    const args = gsap.fromTo.mock.calls[0];
    expect(args[1]).toHaveProperty("y");
    expect(args[2]).toHaveProperty("duration");
  });
});

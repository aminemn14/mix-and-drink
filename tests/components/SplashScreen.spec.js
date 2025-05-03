import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SplashScreen from "../../src/components/SplashScreen.vue";
import gsap from "gsap";

let timelineOnComplete;
const timelineMock = { to: vi.fn() };

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
    timeline: vi.fn((opts) => {
      timelineOnComplete = opts.onComplete;
      return timelineMock;
    }),
    to: vi.fn((target, vars) => {
      if (vars.onComplete) vars.onComplete();
    }),
  },
}));

describe("SplashScreen.vue", () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    timelineOnComplete = undefined;
    wrapper = mount(SplashScreen);
  });

  it("calls gsap.fromTo on mount for splashContent animation", () => {
    expect(gsap.fromTo).toHaveBeenCalledTimes(1);
    const args = gsap.fromTo.mock.calls[0];
    expect(args[0]).toBe(wrapper.vm.splashContent);
    expect(args[2]).toHaveProperty("duration", 0.8);
  });

  it("initializes a timeline with onComplete callback and animates loading bar", () => {
    // timeline should be created once
    expect(gsap.timeline).toHaveBeenCalledTimes(1);
    // onComplete should be captured
    expect(typeof timelineOnComplete).toBe("function");
    // loading bar animation should be scheduled
    expect(timelineMock.to).toHaveBeenCalledWith(
      wrapper.vm.loadingBar,
      expect.objectContaining({
        width: "100%",
        duration: 2,
        ease: "power1.inOut",
      })
    );
  });

  it("emits complete after timeline and exit animation", () => {
    // Simulate timeline completion
    timelineOnComplete();
    // onComplete of timeline calls gsap.to on splashContent, whose onComplete emits complete
    expect(gsap.to).toHaveBeenCalledWith(
      wrapper.vm.splashContent,
      expect.objectContaining({ onComplete: expect.any(Function) })
    );
    // After gsap.to mock runs, the event should have been emitted
    expect(wrapper.emitted("complete")).toBeTruthy();
    expect(wrapper.emitted("complete").length).toBe(1);
  });
});

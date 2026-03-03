import { describe, it, expect } from "vitest";
import { getExcerpt, getReadTime } from "./blog";

describe("blog utilities", () => {
  describe("getExcerpt", () => {
    it("should remove HTML tags", () => {
      const html = "<p>Hello <strong>world</strong></p>";
      expect(getExcerpt(html)).toBe("Hello world");
    });

    it("should truncate long text", () => {
      const longText = "A".repeat(200);
      const excerpt = getExcerpt(longText, 10);
      expect(excerpt).toBe("AAAAAAAAAA...");
    });
  });

  describe("getReadTime", () => {
    it("should return correct read time for short text", () => {
      const text = "word ".repeat(50);
      expect(getReadTime(text)).toBe("1 min read");
    });

    it("should return correct read time for long text", () => {
      const text = "word ".repeat(400);
      expect(getReadTime(text)).toBe("2 min read");
    });
    
    it("should handle empty text", () => {
        expect(getReadTime("")).toBe("0 min read");
    });
  });
});

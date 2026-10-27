import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalResourceLink } from "@/components/ExternalResourceLink";
import { ytChannel, ytSearch } from "@/lib/data";

describe("ExternalResourceLink", () => {
  it.each([
    ["search", ytSearch("Professor Ferretto Porcentagem ENEM")],
    ["channel", ytChannel("Professor Ferretto")],
    ["video", "https://youtu.be/dQw4w9WgXcQ?t=30"],
  ])("opens the YouTube %s as a plain https link in a new tab", (_, href) => {
    render(<ExternalResourceLink href={href}>Aula</ExternalResourceLink>);
    const link = screen.getByRole("link", { name: /Aula/ });
    expect(link.getAttribute("href")).toMatch(/^https:\/\/www\.youtube\.com\//);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    // The click must not be intercepted: the browser follows the href itself.
    expect(fireEvent.click(link)).toBe(true);
    expect(document.querySelectorAll("a").length).toBe(1);
  });

  it("blocks invalid or unsafe links and explains why", () => {
    render(<ExternalResourceLink href="javascript:alert(1)">Ruim</ExternalResourceLink>);
    expect(fireEvent.click(screen.getByRole("link", { name: /Ruim/ }))).toBe(false);
    expect(screen.getByRole("alert")).toHaveTextContent("Este link não é válido");
  });
});

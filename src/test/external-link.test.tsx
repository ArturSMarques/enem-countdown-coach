import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExternalLinkHelp, ExternalResourceLink } from "@/components/ExternalResourceLink";
import { isFramed } from "@/lib/clipboard";
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

describe("Copiar link (saída segura quando o YouTube não abre)", () => {
  const url = ytSearch("Professor Ferretto Porcentagem ENEM");

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
  });

  it("copies the same https address the link opens and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<ExternalResourceLink href={url}>Buscar aula</ExternalResourceLink>);
    fireEvent.click(screen.getByRole("button", { name: "Copiar link: Buscar aula" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Link copiado");
    expect(writeText).toHaveBeenCalledWith(screen.getByRole("link").getAttribute("href"));
  });

  it("shows the address to copy by hand when the browser refuses to copy", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    Object.defineProperty(document, "execCommand", { configurable: true, value: () => false });
    render(<ExternalResourceLink href={url}>Buscar aula</ExternalResourceLink>);
    fireEvent.click(screen.getByRole("button", { name: /Copiar link/ }));
    const field = await screen.findByRole("textbox", { name: "Endereço do link" });
    expect(field).toHaveValue(screen.getByRole("link").getAttribute("href"));
    expect(screen.getByRole("status")).toHaveTextContent("Não foi possível copiar sozinho");
  });

  it("uses the textarea fallback when the Clipboard API is missing", async () => {
    const exec = vi.fn(() => true);
    Object.defineProperty(document, "execCommand", { configurable: true, value: exec });
    render(<ExternalResourceLink href={url}>Buscar aula</ExternalResourceLink>);
    fireEvent.click(screen.getByRole("button", { name: /Copiar link/ }));
    expect(await screen.findByRole("status")).toHaveTextContent("Link copiado");
    expect(exec).toHaveBeenCalledWith("copy");
  });

  it("offers no copy button for invalid links or when disabled", () => {
    render(
      <>
        <ExternalResourceLink href="javascript:alert(1)">Ruim</ExternalResourceLink>
        <ExternalResourceLink href={url} copyable={false}>
          Resumo
        </ExternalResourceLink>
      </>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("ExternalLinkHelp", () => {
  it("always explains what to do when a lesson does not open", () => {
    render(<ExternalLinkHelp />);
    expect(screen.getByText(/www\.youtube\.com está bloqueado.*Copiar link/)).toBeInTheDocument();
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("warns when the site itself runs inside another page", () => {
    const top = Object.getOwnPropertyDescriptor(window, "top")!;
    Object.defineProperty(window, "top", { configurable: true, get: () => ({}) });
    try {
      render(<ExternalLinkHelp />);
      expect(screen.getByRole("note")).toHaveTextContent("dentro de outra página");
    } finally {
      Object.defineProperty(window, "top", top);
    }
  });
});

describe("isFramed", () => {
  it("detects frames, including cross-origin ones that throw", () => {
    const self = {} as Window;
    expect(isFramed({ self, top: self } as unknown as Window)).toBe(false);
    expect(isFramed({ self, top: {} } as unknown as Window)).toBe(true);
    const crossOrigin = {
      self,
      get top(): Window {
        throw new Error("SecurityError");
      },
    } as unknown as Window;
    expect(isFramed(crossOrigin)).toBe(true);
    expect(isFramed(undefined)).toBe(false);
  });
});

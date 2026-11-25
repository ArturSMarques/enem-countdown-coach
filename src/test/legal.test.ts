import { describe, expect, it } from "vitest";
import { acceptedCurrentTerms, DISCLAIMER, exportJSON, TERMS_VERSION } from "@/lib/legal";
import { acceptTerms, clearAllData, currentState, setDataSaver } from "@/lib/store";

const KEY = "reta-final-enem-v1";

describe("terms, data export and deletion", () => {
  it("says the app does not guarantee a score", () => {
    expect(DISCLAIMER).toMatch(/não garante nota nem aprovação/);
  });

  it("checks the accepted version", () => {
    expect(acceptedCurrentTerms(null)).toBe(false);
    expect(acceptedCurrentTerms({ version: TERMS_VERSION, day: "2026-11-26" })).toBe(true);
    expect(acceptedCurrentTerms({ version: "0", day: "2026-01-01" })).toBe(false);
  });

  it("accepts the terms, exports everything saved and deletes it all", () => {
    localStorage.clear();
    acceptTerms();
    setDataSaver(true);
    const saved = JSON.parse(localStorage.getItem(KEY)!);
    expect(saved.termsAccepted.version).toBe(TERMS_VERSION);
    expect(JSON.parse(exportJSON(currentState()))).toEqual(saved);
    clearAllData();
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(currentState()).toMatchObject({
      config: null,
      termsAccepted: null,
      dataSaver: false,
      attempts: [],
    });
  });
});

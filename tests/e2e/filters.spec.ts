/**
 * E2E Tests for Filter Sidebar Feature
 * Tests user interactions and filter functionality
 */

import { test, expect } from "@playwright/test";

test.describe("Filter Sidebar", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");
  });

  test.describe("Filter Discovery (User Story 1)", () => {
    test("should display all filter categories", async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify filter categories are visible in the sidebar
      await expect(
        page.getByRole("heading", { name: "Location" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Service Type" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Quality" })
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "Cost" })).toBeVisible();
    });

    test.skip("should display all filters within each category", async ({
      page,
    }) => {
      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify key filter labels are visible by checking for label elements
      // These are rendered as <label class="text-sm font-medium">
      await expect(
        page.locator("label", { hasText: "Commune" }).first()
      ).toBeVisible();
      await expect(
        page.locator("label", { hasText: "Type" }).first()
      ).toBeVisible();
      await expect(
        page.locator("label", { hasText: "Minimum Quality Score" }).first()
      ).toBeVisible();
      await expect(
        page.locator("label", { hasText: "Cost" }).first()
      ).toBeVisible();
    });

    test("should render correct UI control for each filter type", async ({
      page,
    }) => {
      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify categorical filters have combobox buttons (they show 'Select...' initially)
      const comboboxButtons = page.locator('[role="combobox"]');
      await expect(comboboxButtons.first()).toBeVisible();
      expect(await comboboxButtons.count()).toBeGreaterThan(0);

      // Verify numeric filter (Quality Score) has a slider
      const sliders = page.locator('[role="slider"]');
      await expect(sliders.first()).toBeVisible();
      expect(await sliders.count()).toBeGreaterThan(0);
    });
  });

  test.describe("Filter Application", () => {
    test("should apply categorical filter and update results", async ({
      page,
    }) => {
      // TODO: Implement in Phase 3
      // 1. Select a categorical filter option
      // 2. Verify results update
      // 3. Verify filter is reflected in URL
    });

    test("should apply numeric filter and update results", async ({ page }) => {
      // TODO: Implement in Phase 3
      // 1. Adjust numeric filter slider
      // 2. Verify results update
      // 3. Verify filter is reflected in URL
    });

    test("should combine multiple filters", async ({ page }) => {
      // TODO: Implement in Phase 3
      // 1. Apply multiple filters
      // 2. Verify all filters are applied
      // 3. Verify results are filtered by all criteria
    });
  });

  test.describe("Additional Filters (User Story 2)", () => {
    test("should display additional filter categories", async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify additional filter categories are visible
      await expect(
        page.getByRole("heading", { name: "Target Audience" })
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "Themes" })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Access & Reception" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Data Source" })
      ).toBeVisible();
    });

    test("should combine new filters with existing filters", async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify that new filter categories exist alongside existing ones
      await expect(
        page.getByRole("heading", { name: "Location" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Target Audience" })
      ).toBeVisible();

      // Verify all filter categories are present
      const headings = page.locator("h3");
      const count = await headings.count();
      expect(count).toBeGreaterThanOrEqual(8); // 4 original + 4 new
    });

    test("should render controls for additional filters", async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify new filters have appropriate controls (all are categorical/combobox)
      const comboboxButtons = page.locator('[role="combobox"]');
      const buttonCount = await comboboxButtons.count();

      // Should have at least 6 combobox buttons (2 original + 4 new + sources)
      expect(buttonCount).toBeGreaterThanOrEqual(6);
    });
  });

  test.describe("Filter Management", () => {
    test("should clear individual filter", async ({ page }) => {
      // TODO: Implement in Phase 3
      // 1. Apply a filter
      // 2. Click clear button
      // 3. Verify filter is removed
    });

    test("should reset all filters", async ({ page }) => {
      // TODO: Implement in Phase 3
      // 1. Apply multiple filters
      // 2. Click reset all button
      // 3. Verify all filters are cleared
    });
  });

  test.describe("URL State Persistence (User Story 3)", () => {
    test("should persist single filter in URL", async ({ page }) => {
      // TODO: Implement in Phase 5
      // 1. Apply a filter
      // 2. Verify URL contains filter parameter
      // 3. Copy URL and open in new tab
      // 4. Verify filter is restored
    });

    test("should persist multiple filters in URL", async ({ page }) => {
      // TODO: Implement in Phase 5
      // 1. Apply multiple filters
      // 2. Verify URL contains all filter parameters
      // 3. Copy URL and open in new tab
      // 4. Verify all filters are restored
    });

    test("should restore filters from URL on page load", async ({ page }) => {
      // TODO: Implement in Phase 5
      // 1. Navigate to URL with filter parameters
      // 2. Verify filters are pre-applied
      // 3. Verify results match filter criteria
    });

    test("should silently ignore unsupported URL parameters", async ({
      page,
    }) => {
      // TODO: Implement in Phase 5
      // 1. Navigate to URL with unsupported filter parameters
      // 2. Verify application loads without errors
      // 3. Verify unsupported parameters are ignored
    });
  });

  test.describe("Mobile Responsiveness", () => {
    test("should display filter drawer on mobile", async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState("networkidle");

      // Verify filter button is visible on mobile
      const filterButton = page.getByRole("button", { name: /show filters/i });
      await expect(filterButton).toBeVisible();

      // Click filter button to open drawer
      await filterButton.click();

      // Verify drawer opens with filters
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(
        dialog.getByRole("heading", { name: "Location" })
      ).toBeVisible();
      await expect(
        dialog.getByRole("heading", { name: "Service Type" })
      ).toBeVisible();
    });

    test("should display persistent sidebar on desktop", async ({ page }) => {
      // Set viewport to desktop size
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForLoadState("networkidle");

      // Verify sidebar is visible (not in a drawer)
      await expect(
        page.getByRole("heading", { name: "Data Inclusion Explorer" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Location" })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Service Type" })
      ).toBeVisible();

      // Verify mobile filter button is NOT visible on desktop
      const filterButton = page.getByRole("button", { name: /show filters/i });
      await expect(filterButton).not.toBeVisible();
    });
  });

  test.describe("Error Handling", () => {
    test("should display error state when filter fetch fails", async ({
      page,
    }) => {
      // TODO: Implement in Phase 6
      // 1. Mock API error
      // 2. Verify error message is displayed
      // 3. Verify retry button is available
    });

    test("should handle empty results gracefully", async ({ page }) => {
      // TODO: Implement in Phase 6
      // 1. Apply filters that result in zero services
      // 2. Verify empty state message is displayed
      // 3. Verify user can modify filters
    });
  });
});

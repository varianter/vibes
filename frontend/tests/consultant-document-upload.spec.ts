import { test, expect } from "@playwright/test";
import { Degree } from "@/api-types";
import { draftToInitialValues } from "@/components/consultants/consultantDocumentDraft";
import { ConsultantDocumentDraft } from "@/types";

const departments = [
  { id: "myDepartment", name: "My Department" },
  { id: "oslo", name: "Oslo" },
];

const draft: ConsultantDocumentDraft = {
  name: "Kari Nordmann",
  departmentId: "myDepartment",
  degree: "Master",
  graduationYear: 2014,
  startDate: "2026-08-01",
};

const extractUrl = "/my-org/konsulenter/api/consultant/extract";

test.describe("draftToInitialValues", () => {
  test("maps all extracted values to form values", () => {
    const values = draftToInitialValues(draft, departments);

    expect(values.name).toBe("Kari Nordmann");
    expect(values.degree).toBe(Degree.Master);
    expect(values.department).toEqual({
      id: "myDepartment",
      name: "My Department",
    });
    expect(values.graduationYear).toBe(2014);
    expect(values.startDate?.toISOString().split("T")[0]).toBe("2026-08-01");
  });

  test("leaves out unknown department and missing values", () => {
    const values = draftToInitialValues(
      {
        name: "Kari Nordmann",
        departmentId: "does-not-exist",
        degree: "None",
        graduationYear: null,
        startDate: null,
      },
      departments,
    );

    expect(values).toEqual({ name: "Kari Nordmann", degree: Degree.None });
  });
});

test.describe("extract route validation", () => {
  test("rejects request without file", async ({ request }) => {
    const response = await request.post(extractUrl, {
      multipart: { other: "value" },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: "Mangler fil" });
  });

  test("rejects files that are not PDF", async ({ request }) => {
    const response = await request.post(extractUrl, {
      multipart: {
        file: {
          name: "tilbud.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("not a pdf"),
        },
      },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: "Filen må være en PDF" });
  });

  test("rejects PDF larger than 10 MB", async ({ request }) => {
    const response = await request.post(extractUrl, {
      multipart: {
        file: {
          name: "tilbud.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
        },
      },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      error: "Filen er for stor (maks 10 MB)",
    });
  });
});

test.describe("add consultant from document (beta)", () => {
  test("pre-fills the add consultant form from the uploaded PDF", async ({
    page,
  }) => {
    await page.route(`**${extractUrl}`, (route) =>
      route.fulfill({ json: draft }),
    );

    await page.goto("/my-org/konsulenter");
    await page
      .getByRole("button", { name: "Legg til konsulent (automatisert/beta)" })
      .click();

    await page.getByLabel("Last opp ansettelsestilbud (PDF)").setInputFiles({
      name: "tilbud.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 test"),
    });
    await page.getByRole("button", { name: "Hent verdier" }).click();

    await expect(page.getByText("Forhåndsutfylt fra dokument")).toBeVisible();
    await expect(page.locator("#name")).toHaveValue("Kari Nordmann");
    await expect(page.locator("#startdate")).toHaveValue("2026-08-01");
    await expect(page.locator("#department")).toContainText("My Department");
    await expect(page.locator("#degree")).toContainText("Master");
    await expect(page.locator("#graduationYear")).toContainText("2014");
  });

  test("shows the error and keeps the dialog open when extraction fails", async ({
    page,
  }) => {
    await page.route(`**${extractUrl}`, (route) =>
      route.fulfill({
        status: 500,
        json: { error: "Klarte ikke å hente verdier fra dokumentet" },
      }),
    );

    await page.goto("/my-org/konsulenter");
    await page
      .getByRole("button", { name: "Legg til konsulent (automatisert/beta)" })
      .click();
    await page.getByLabel("Last opp ansettelsestilbud (PDF)").setInputFiles({
      name: "tilbud.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 test"),
    });
    await page.getByRole("button", { name: "Hent verdier" }).click();

    await expect(
      page.getByText("Klarte ikke å hente verdier fra dokumentet"),
    ).toBeVisible();
    await expect(page.getByText("Forhåndsutfylt fra dokument")).toBeHidden();
  });
});

import { Builder, until, WebDriver } from "selenium-webdriver";
import { getElementById } from "@/lib";
import "selenium-webdriver/chrome";
import "chromedriver";

const rootUrl = "http://localhost:3000/auth/login";
let driver: WebDriver;

describe("Selenium Automated Test", () => {
  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("View Service Request As A User", () => {
    const email = "carlo2@cpu.edu.ph"; //remove this if done na tanan for testing
    const password = "Qwertyuiop1!"; // //

    it("login as a user", async () => {
      await driver.get(rootUrl);
      await driver.wait(until.urlContains("/auth/login"), 10000);

      const emailInput = await getElementById("email", driver);
      const passwordInput = await getElementById("password", driver);
      const loginButton = await getElementById("login-button", driver);

      await emailInput.sendKeys(email);
      await passwordInput.sendKeys(password);
      await loginButton.click();
    });

    it("click on create service request ", async () => {
      await driver.wait(until.elementLocated({ id: "left-tab" }), 10000);
      const createRequest = await driver.findElement({ id: "create-request" });
      await createRequest.click();
    });

    it("see the create service request form", async () => {
      expect(
        await driver.findElement({ id: "create-service-request-title" })
      ).toBeTruthy();

      expect(await driver.findElement({ id: "title" })).toBeTruthy();
      expect(await driver.findElement({ id: "details" })).toBeTruthy();
      expect(
        await driver.findElement({ id: "send-service-request-button" })
      ).toBeTruthy();
      expect(
        await driver.findElement({ id: "create-service-request-back-button" })
      ).toBeTruthy();
    });

    it("fills out the create service form", async () => {
      const titleInput = "This title is from e2e testing";
      const DetailInput = "This detail is from e2e testing";

      const getTitle = await getElementById("title", driver);
      const getText = await getElementById("details", driver);

      await getTitle.sendKeys(titleInput);
      await getText.sendKeys(DetailInput);
    });

    it("returns to homepage after creating SR", async () => {
      const backButton = await getElementById(
        "create-service-request-back-button",
        driver
      );
      await backButton.click();
    });

    it("click on the service request", async () => {
      await driver.wait(until.elementLocated({ id: "left-tab" }), 10000);
      const viewRequest = await driver.findElement({ id: "view-request" });
      await viewRequest.click();
    });

    it("click on the service request card", async () => {
      await driver.wait(
        until.elementLocated({ id: "view-request-card-preview" }),
        10000
      );
      const reqCard = await driver.findElement({
        id: "view-request-card-preview",
      });
      await reqCard.click();
    });

    it("see the full details of the service request", async () => {
      await driver.wait(
        until.elementLocated({ id: "title-of-request" }),
        10000
      );
      expect(await driver.findElement({ id: "title-of-request" })).toBeTruthy();
      expect(await driver.findElement({ id: "request-details" })).toBeTruthy();
      expect(await driver.findElement({ id: "requestor-name" })).toBeTruthy();
      expect(await driver.findElement({ id: "created-on" })).toBeTruthy();
      expect(await driver.findElement({ id: "back-button" })).toBeTruthy();
      expect(await driver.findElement({ id: "approve-button" })).toBeTruthy();
      expect(await driver.findElement({ id: "reject-button" })).toBeTruthy();
      expect(await driver.findElement({ id: "previous-button" })).toBeTruthy();
      expect(await driver.findElement({ id: "next-button" })).toBeTruthy();
      expect(await driver.findElement({ id: "requestor-email" })).toBeTruthy();
    });

    it("click back on the service request card", async () => {
      await driver.wait(until.elementLocated({ id: "back-button" }), 10000);

      const backButton = await driver.findElement({ id: "back-button" });
      await backButton.click();
    });
  });
  describe("View Service Request As An Admin", () => {
    const email = "new@cpu.edu.ph"; //remove this if done na tanan for testing
    const password = "Qwerty1!"; // //

    it("login as an admin", async () => {
      await driver.get(rootUrl);
      await driver.wait(until.urlContains("/auth/login"), 10000);

      const emailInput = await getElementById("email", driver);
      const passwordInput = await getElementById("password", driver);
      const loginButton = await getElementById("login-button", driver);

      await emailInput.sendKeys(email);
      await passwordInput.sendKeys(password);
      await loginButton.click();
    });

    it("go the service request", async () => {
      await driver.wait(until.elementLocated({ id: "left-tab" }), 10000);
      const viewRequest = await driver.findElement({ id: "view-request" });
      await viewRequest.click();
    });
  });
});

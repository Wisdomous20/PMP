import { Builder, By, until, WebDriver } from 'selenium-webdriver';

const rootURL = process.env.NEXT_PUBLIC_CLIENT_URL;

describe('Login Process', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('MicrosoftEdge').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('logs in a user with valid credentials', async () => {
    await driver.get(`${rootURL}auth/login`);

    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.sendKeys('test@cpu.edu.ph');

    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('ValidPassword123!');

    const loginButton = await driver.findElement(By.id('login-button'));
    await loginButton.click();

    await driver.wait(until.urlIs(`${rootURL}service-request`), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe(`${rootURL}service-request`);
  });

  it('displays an error for invalid email format', async () => {
    await driver.get(`${rootURL}auth/login`);

    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.sendKeys('invalidemail');

    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('ValidPassword123!');

    const loginButton = await driver.findElement(By.id('login-button'));
    await loginButton.click();

    await driver.wait(until.elementLocated(By.id('email-error')), 5000);
    const errorMessage = await driver.findElement(By.id('email-error')).getText();
    expect(errorMessage).toBe('Please enter a valid CPU email address');
  });

  it('displays an error for incorrect credentials', async () => {
    await driver.get(`${rootURL}auth/login`);

    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.sendKeys('test@cpu.edu.ph');

    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('WrongPassword123!');

    const loginButton = await driver.findElement(By.id('login-button'));
    await loginButton.click();

    await driver.wait(until.elementLocated(By.id('password-error')), 5000);
    const errorMessage = await driver.findElement(By.id('password-error')).getText();
    expect(errorMessage).toBe('Invalid email or password');
  });

  it('displays an error for missing credentials', async () => {
    await driver.get(`${rootURL}auth/login`);

    const loginButton = await driver.findElement(By.id('login-button'));
    await loginButton.click();

    await driver.wait(until.elementLocated(By.id('email-error')), 5000);
    const emailErrorMessage = await driver.findElement(By.id('email-error')).getText();
    await driver.wait(until.elementLocated(By.id('password-error')), 5000);
    const passwordErrorMessage = await driver.findElement(By.id('password-error')).getText();

    expect(emailErrorMessage).toBe('Please enter a valid CPU email address');
    expect(passwordErrorMessage).toBe('Password must be at least 8 characters long');
  });
});

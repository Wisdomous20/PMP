import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import axios from 'axios';

const rootURL = process.env.NEXT_PUBLIC_CLIENT_URL;

jest.setTimeout(20000)

async function deleteUserByEmail(email: string) {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/user`, {
      data: { email },
    });
    console.log(response.data.message);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting user:", error.response?.data || error.message);
    } else {
      console.error("Error deleting user:", error);
    }
  }
}

describe('Registration Process', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('MicrosoftEdge').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('registers a user with valid credentials', async () => {
    await driver.get(`${rootURL}auth/register`);

    const firstNameInput = await driver.findElement(By.id('firstName'));
    await firstNameInput.sendKeys('John');

    const lastNameInput = await driver.findElement(By.id('lastName'));
    await lastNameInput.sendKeys('Doe');

    const departmentInput = await driver.findElement(By.id('department'));
    await departmentInput.sendKeys('Engineering');

    const localNumberInput = await driver.findElement(By.id('localNumber'));
    await localNumberInput.sendKeys('1234567');

    const cellphoneNumberInput = await driver.findElement(By.id('cellphoneNumber'));
    await cellphoneNumberInput.sendKeys('09171234567');

    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.sendKeys('john.doe@cpu.edu.ph');

    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('ValidPassword123!');

    const confirmPasswordInput = await driver.findElement(By.id('confirmPassword'));
    await confirmPasswordInput.sendKeys('ValidPassword123!');

    const registerButton = await driver.findElement(By.css('button[type="submit"]'));
    await registerButton.click();

    await driver.wait(until.urlIs(`${rootURL}`), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe(`${rootURL}`);

    await deleteUserByEmail('john.doe@cpu.edu.ph');
  });

  // it('display an error messag; invalid email', async () => {
  //   await driver.get(`${rootURL}/register`);

  //   const usernameInput = await driver.findElement(By.id('name'));
  //   await usernameInput.sendKeys('newuser');

  //   const emailInput = await driver.findElement(By.id('email'));
  //   await emailInput.sendKeys('invalidemail');

  //   const passwordInput = await driver.findElement(By.id('password'));
  //   await passwordInput.sendKeys('validPassword');

  //   await driver.wait(until.elementLocated(By.id('registerButton')), 5000);

  //   const registerButton = await driver.findElement(By.id('registerButton'));
  //   await registerButton.click();

  //   const errorMessage = await driver.findElement(By.id('errorMessage')).getText();
  //   expect(errorMessage).toContain('Enter a valid email');
  // });

  // it('display an error message; email already in use', async () => {
  //   await driver.get(`${rootURL}/register`);

  //   const usernameInput = await driver.findElement(By.id('name'));
  //   await usernameInput.sendKeys('newuser');

  //   const emailInput = await driver.findElement(By.id('email'));
  //   await emailInput.sendKeys('test@email.com');

  //   const passwordInput = await driver.findElement(By.id('password'));
  //   await passwordInput.sendKeys('test');

  //   const registerButton = await driver.findElement(By.id('registerButton'));
  //   await registerButton.click();

  //   await driver.wait(until.elementLocated(By.id('errorMessage')), 5000);

  //   const errorMessage = await driver.findElement(By.id('errorMessage')).getText();
  //   expect(errorMessage).toContain('Email is already in use');
  // });
});
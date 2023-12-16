import { $ } from '@wdio/globals'
import Page from './page.js';
import { browser } from '@wdio/globals'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername () {
        return $('input[placeholder="username"]');
    }

    public get inputPassword () {
        return $('input[placeholder="password"]');
    }

    public get btnSubmit () {
        return $('div.button');
    }

    public get toastMessage () {
        return $('div.Toastify__toast-body > div:nth-child(2)');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
        await this.toastMessage.waitForDisplayed();
        await browser.pause(3000)

    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('login');
    }
}

export default new LoginPage();

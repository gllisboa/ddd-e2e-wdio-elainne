import { $, $$ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class UnpopularPostPage extends Page {
    /**
     * define selectors using getter methods
     */

    public get pointsFirstPost () {
        return $("#root > div > div > div:nth-child(6) > div.post-points > div:nth-child(2)")
    }

    public get pointsSecondPost () {
        return $("#root > div > div > div:nth-child(7) > div.post-points > div:nth-child(2)")
    }

    public get pointsThirdPost () {
        return $("#root > div > div > div:nth-child(8) > div.post-points > div:nth-child(2)")
    }

    public get titleFourthPost () {
        return $("#root > div > div > div:nth-child(9) > div.post-row-content > a")
    }

    public get pointsFourthPost () {
        return $("#root > div > div > div:nth-child(9) > div.post-points > div:nth-child(2)")
    }

    public get titleFifthPost () {
        return $("#root > div > div > div:nth-child(9) > div.post-row-content > a")
    }

    public get pointsFifthPost () {
        return $("#root > div > div > div:nth-child(9) > div.post-points > div:nth-child(2)")
    }

    public get postUnpopularFilter () {
        return $$('div.post-filters > div.post-filter')[2];
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to posts
     */
    public async openPostUnpopular () {
        await this.postUnpopularFilter.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('');
    }
}

export default new UnpopularPostPage();

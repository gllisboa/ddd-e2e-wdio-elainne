import { $, $$ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class PostPage extends Page {
    /**
     * define selectors using getter methods
     */

    public get dateCreateFirstPost () {
        return $("#root > div > div > div:nth-child(6) > div.post-row-content > div > span")
    }

    public get dateCreateSecondPost () {
        return $("#root > div > div > div:nth-child(7) > div.post-row-content > div > span")
    }

    public get dateCreateThirdPost () {
        return $("#root > div > div > div:nth-child(8) > div.post-row-content > div > span")
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

export default new PostPage();

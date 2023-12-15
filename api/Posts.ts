/**
 *
 * @remarks
 * This code is based on the project {@link https://github.com/jmfiola/jest-api-test-typescript-example}.
*/

import { AxiosResponse } from "axios";
import { AEndpoint } from "./AEndpoint.ts";

export default class Posts extends AEndpoint {
  constructor() {
    super("/posts", "posts");
  }

  //Sort posts
  public async sortPosts(sortBy: string): Promise<AxiosResponse> {
    return this.restClient.sendGet({
      route: "/sort",
      data: { sortBy: sortBy }
    });
  }

  //Get popular posts
  public async getPopularPosts(offset?: number, accessToken?: string): Promise<AxiosResponse> {
    const requestConfig = {
      route: "/popular",
      params: { offset: offset },
      headers: {}  // Inicializa os headers vazios
    };

    if (accessToken) {
      requestConfig.headers["Authorization"] = accessToken; // Adiciona o header Authorization
    }

    return this.restClient.sendGet(requestConfig);
  }

  //Get unpopular posts
  public async getUnpopularPosts(offset?: number, accessToken?: string): Promise<AxiosResponse> {
    const requestConfig = {
      route: "/unpopular",
      params: { offset: offset },
      headers: {}  // Inicializa os headers vazios
    };

    if (accessToken) {
      requestConfig.headers["Authorization"] = accessToken; // Adiciona o header Authorization
    }

    return this.restClient.sendGet(requestConfig);
  }

  //Get recent posts
  public async getRecentPosts(offset?: number, accessToken?: string): Promise<AxiosResponse> {
    const requestConfig = {
      route: "/recent",
      params: { offset: offset },
      headers: {}  // Inicializa os headers vazios
    };

    if (accessToken) {
      requestConfig.headers["Authorization"] = accessToken; // Adiciona o header Authorization
    }

    return this.restClient.sendGet(requestConfig);
  }

  //Create a post
  public async createPost(accessToken: string, title: string, postType: string, text: string, link?: string): Promise<AxiosResponse> {
    const postData: any = {
      title: title,
      postType: postType,
      text: text,
      link: link || ""
    };

    return this.restClient.sendPost({
      route: "/",
      headers: { "Authorization": accessToken },
      data: postData
    });
  }

  //Get a post by slug
  public async getPostBySlug(slug: string, accessToken?: string): Promise<AxiosResponse> {
    const requestConfig = {
      route: "/",
      params: { slug: slug },
      headers: {}
    };

    if (accessToken) {
      requestConfig.headers["Authorization"] = accessToken;
    }

    return this.restClient.sendGet(requestConfig);
  }

  //Upvote a post 
  public async upvotePost(accessToken: string, slug: string): Promise<AxiosResponse> {
    return this.restClient.sendPost({
      route: "/upvote",
      headers: { "Authorization": accessToken },
      data: { slug: slug }
    });
  }

  //Downvote a post
  public async downvotePost(accessToken: string, slug: string): Promise<AxiosResponse> {
    return this.restClient.sendPost({
      route: "/downvote",
      headers: { "Authorization": accessToken },
      data: { slug: slug }
    });
  }
}


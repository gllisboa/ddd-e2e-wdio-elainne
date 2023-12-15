/**
 *
 * @remarks
 * This code is based on the project {@link https://github.com/jmfiola/jest-api-test-typescript-example}.
*/

import { AxiosResponse } from "axios";
import { AEndpoint } from "./AEndpoint.ts";

export default class Users extends AEndpoint {
  constructor() {
    super("/users", "users");
  }

  /**
   * This method is used to login, using the REST API.
   * For the moment, the username and password are hardcoded. 
   * 
   * @returns the result of the post request. If sucessful, the response will contain an access token and refresh token.
   */

  //Login
  public async postLogin(username: string, password: string): Promise<AxiosResponse> {
    return this.restClient.sendPost({
      route: "/login",
      data: { username: username, password: password }
    });
  }

  //Get current user
  public async getMe(accessToken: string): Promise<AxiosResponse> {
    return this.restClient.sendGet({
      route: "/me",
      params: { "Authorization": accessToken }
    });
  }

  //Create a new user account
  public async post(username: string, email: string, password: string): Promise<AxiosResponse> {
    return this.restClient.sendPost({
      route: "/",
      data: { username: username, email: email, password: password }
    });
  }

  //Refresh access token
  public async postTokenRefresh(refreshToken: string): Promise<AxiosResponse> {
    return this.restClient.sendPost({
      route: "/token/refresh",
      data: { refreshToken: refreshToken }
    });
  }

  //Get user by username
  public async getUserByUserName(username: string, accessToken: string): Promise<AxiosResponse> {
    return this.restClient.sendGet({
      route: "/:username",
      data: { "username": username },
      params: { "Authorization": accessToken }
    });
  }

  //Logout
  public async postLogout(accessToken: string): Promise<AxiosResponse> {
    return this.restClient.sendPost({
      route: "/logout",
      headers: { "Authorization": accessToken }
    });
  }

  //Delete a user
  public async deleteUser(accessToken: string, userId: string): Promise<AxiosResponse> {
    return this.restClient.sendDelete({
      route: `/${userId}`,
      headers: { "Authorization": accessToken },
      data: { userId: userId }
    });
  }
}

import {AxiosResponse} from "axios";
import {ILogin} from "../models/ILogin";
import {IRequestConfig, request} from "./api";


export default class LoginService {
    static async loginRequest(vk_code: string): Promise<ILogin> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: "/auth/login",
            params: {vk_code: vk_code},
            auth: false,
            withCredentials: true
        }
        return await request(requestConfig)
    }
}
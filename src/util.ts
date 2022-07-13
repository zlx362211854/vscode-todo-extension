import * as vscode from 'vscode';
import { login } from "./request";
import store from "./store";

export const secretKey = "394812730425442A472D2F423F452848";

export const startAuthInterval = () => {
    setInterval(async () => {
        const userinfo = store.getItem('userinfo')
        const res = await login({ username: userinfo.username, password: userinfo.password })
        if (res.data?.code === 200) {
            store.setItem('auth-token', res.data?.result?.accessToken)
        }
        if (res.data?.code !== 200) {
            vscode.window.showErrorMessage('Session persistence failed. Please log in again!')
        }
    }, 1000 * 60 * 60)
}
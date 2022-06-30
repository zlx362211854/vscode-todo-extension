import * as vscode from 'vscode';
import { login } from '../request';
import store from '../store';
export const loginHandler = () => {
    vscode.window.showInputBox({ title: 'username' }).then(username => {
        vscode.window.showInputBox({ title: 'password' }).then(password => {
            const params = {
                username: username || '',
                password: password || ''
            }
            login(params)
        });
    });
}

export const handleLogin = async () => {
    return new Promise<boolean>((resolve, reject) => {
        vscode.window.showInputBox({ title: 'username' }).then(username => {
            vscode.window.showInputBox({ title: 'password' }).then(async password => {
                const params = {
                    username: username || '',
                    password: password || ''
                }
                const res = await login(params)
                if (res.data?.code === 200) {
                    vscode.window.showInformationMessage('Login successful!')
                    store.setItem('auth-token', res.data?.result?.accessToken)
                    store.setItem('userinfo', { username: res.data?.result?.name, userId: res.data?.result?.id })
                    resolve(true)
                }
            });
        });
    })
}
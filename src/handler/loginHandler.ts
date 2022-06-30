import * as vscode from 'vscode';
import { login, signin } from '../request';
import store from '../store';
const validateName = (name: string) => {
    if (!name) {
        return 'username is required!'
    }
    return null
}

const validatePassword = (p: string) => {
    if (!p) {
        return 'password is required!'
    }
    if (p.length < 6) {
        return 'The password must contain at least six characters!'
    }
    return null
}

const validateConfirmPassword = (password: string) => (confirmPassword: string) => {
    if (password !== confirmPassword) {
        return 'The confirm password is incorrect!'
    }
    return null
}


export const signinHandler = async () => {
    const username = await vscode.window.showInputBox({
        title: 'username', placeHolder: 'please input your name', validateInput: validateName
    })
    const password = await vscode.window.showInputBox({
        title: 'password', password: true, placeHolder: 'please input your password', validateInput: validatePassword
    })
    await vscode.window.showInputBox({
        title: 'confirm password', password: true, placeHolder: 'please confirm your name', validateInput: validateConfirmPassword(password || '')
    })
    const params = {
        username: username || '',
        password: password || ''
    }
    const { data } = await signin(params)
    if (data.code === 200) {
        vscode.window.showInformationMessage('Registered successfully')
    }
}

export const handleLogin = async () => {
    return new Promise<boolean>(async (resolve, reject) => {
        const username = await vscode.window.showInputBox({
            title: 'username', placeHolder: 'please input your name', validateInput: validateName
        })
        const password = await vscode.window.showInputBox({
            title: 'password', password: true, placeHolder: 'please input your password', validateInput: validatePassword
        })
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
    })
}
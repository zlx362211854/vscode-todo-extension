import axios from 'axios'
import * as vscode from 'vscode';
import * as Crypto from 'crypto-js'
import { secretKey } from '../util'
import store from '../store';

const req = axios.create({
    baseURL: 'http://114.116.125.115',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});
req.interceptors.response.use(function (response) {
    if (response.data && response.data.code === 100) {
        vscode.window.showErrorMessage(response.data.message)
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});
interface Response {
    data: {
        code: 100 | 200
        message: string
        result: any
    }
}
export const login = (params: { username: string, password: string }) => {
    const encryptedPassword = Crypto.AES.encrypt(params.password, secretKey).toString();
    return req.request<any, Response>({
        url: '/user/login',
        method: 'POST',
        data: { username: params.username, password: encryptedPassword },
    })
}
export const signin = (params: { username: string, password: string }) => {
    const encryptedPassword = Crypto.AES.encrypt(params.password, secretKey).toString();
    return req.request<any, Response>({
        url: '/user/signin',
        method: 'POST',
        data: { username: params.username, password: encryptedPassword },
    })
}

export const getList = () => {
    const authToken = store.getItem('auth-token')
    return req.request<any, Response>({
        url: '/task',
        headers: {
            'Authorization': authToken
        }
    })
}

export const addData = (data: any) => {
    const authToken = store.getItem('auth-token')
    return req.request<any, Response>({
        url: '/task',
        method: 'POST',
        headers: {
            'Authorization': authToken
        },
        data: data
    })
}

export const updateData = (id: string, data: any) => {
    const authToken = store.getItem('auth-token')
    return req.request<any, Response>({
        url: `/task/${id}`,
        method: 'PUT',
        headers: {
            'Authorization': authToken
        },
        data: data
    })
}

export const deleteData = (id: string) => {
    const authToken = store.getItem('auth-token')
    return req.request<any, Response>({
        url: `/task/${id}`,
        method: 'DELETE',
        headers: {
            'Authorization': authToken
        }
    })
}
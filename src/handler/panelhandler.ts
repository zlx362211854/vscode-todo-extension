import * as vscode from 'vscode';
import TodoPanel from '../panel';
import store from '../store';
import { handleLogin, loginHandler } from './loginHandler';
export const panelHandler = (context: vscode.ExtensionContext) => async () => {
    const authToken = store.getItem('auth-token')
    if (!authToken) {
        vscode.window.showInformationMessage('please login first!')
        const islogin = await handleLogin()
        if (islogin) {
            handlePanelOpen(context)
        }
    } else {
        handlePanelOpen(context)
    }
}

const handlePanelOpen = (context: vscode.ExtensionContext) => {
    TodoPanel.createOrShow(context.extensionUri);
    TodoPanel.currentPanel?.getListData()
}
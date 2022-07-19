import path = require('path');
import * as vscode from 'vscode';
import { Note, openfileHandler } from './handler/addtodoHandler';
import { addData, deleteData, getList, updateData } from './request';
import { html } from './template';
function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
    return {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `assest` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'assest')]
    };
}
/**
 * Manages todo webview panels
 */
export default class TodoPanel {
    public static currentPanel: TodoPanel | undefined;


    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {

        // if already have a panel, show it.
        if (TodoPanel.currentPanel) {
            TodoPanel.currentPanel._panel.reveal();
            return;
        }

        // if does not have panel, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            'todo',
            'TODO App',
            vscode.ViewColumn.One,
            getWebviewOptions(extensionUri),
        );

        TodoPanel.currentPanel = new TodoPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        TodoPanel.currentPanel = new TodoPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // insert html content into webview
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update();
                    this.getListData()
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
        this._panel.webview.onDidReceiveMessage(message => {
            console.log('插件收到的消息：', message);
            switch (message.type) {
                case 'add':
                    this.addData(message.data)
                    break;
                case 'update':
                    this.updateData(message.data)
                    break;
                case 'remove':
                    this.deleteData(message.data)
                    break;
                case 'openfile':
                    this.openfile(message.data)
                    break;
            }
        });
    }

    public dispose() {
        TodoPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._updateTodo(webview);
    }

    private _updateTodo(webview: vscode.Webview) {
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'assest', 'app.js');
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'assest', 'app.css');
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        return html(webview, scriptUri, stylesResetUri);
    }

    /* request */
    public postListData(data: any) {
        // ask webview to re-render task list
        this._panel.webview.postMessage({ type: 'list', data });
    }

    public async getListData() {
        const { data } = await getList()
        const list = data.result
        if (Array.isArray(list)) {
            this.postListData(list)
        }
    }

    public async addData(item: any) {
        const { data } = await addData(item)
        if (data.code === 200) {
            this.getListData()
        }
    }

    public async updateData(item: any) {
        if (!item.id) return null
        const { data } = await updateData(item.id, item)
        if (data.code === 200) {
            this.getListData()
        }
    }

    public async deleteData(item: any) {
        if (!item.id) return null
        const { data } = await deleteData(item.id)
        if (data.code === 200) {
            this.getListData()
        }
    }

    public async openfile(info: string) {
        try {
            const infoObject: Note = JSON.parse(info)
            openfileHandler(infoObject)
        } catch (err) {
            console.log(err)
            // vscode.window.showErrorMessage(err)
        }
    }
}



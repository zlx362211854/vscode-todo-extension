// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { signinHandler } from './handler/loginHandler';
import { panelHandler } from './handler/panelhandler';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('todo-app.signin', signinHandler));
	context.subscriptions.push(vscode.commands.registerCommand('todo-app.open', panelHandler(context))
	);
}



// this method is called when your extension is deactivated
export function deactivate() { }

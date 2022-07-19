// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { addTodoHandler, openfileHandler } from './handler/addtodoHandler';
import { signinHandler } from './handler/loginHandler';
import { panelHandler } from './handler/panelhandler';
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('todo-app.signin', signinHandler));
	context.subscriptions.push(vscode.commands.registerCommand('todo-app.open', panelHandler(context)));
	context.subscriptions.push(vscode.commands.registerCommand('todo-app.add-todo', addTodoHandler(context)));
}



// this method is called when your extension is deactivated
export function deactivate() { }

import * as vscode from 'vscode';
import TodoPanel from '../panel';
import { addData } from '../request';
import store from '../store';
import { handleLogin } from './loginHandler';
import { handlePanelOpen } from './panelhandler';
export interface Position {
    line: number;
    character: number;
}

export interface Note {
    fileName: string;
    fileLine: number;
    positionStart: Position;
    positionEnd: Position;
    codeSnippet: string;
}
export const openfileHandler = async (note: Note) => {
    vscode.workspace.openTextDocument(note.fileName).then(doc => {
        vscode.window.showTextDocument(doc).then(editor => {
            var range = new vscode.Range(note.fileLine, 0, note.fileLine, 0);
            editor.revealRange(range);

            var start = new vscode.Position(note.positionStart.line, note.positionStart.character);
            var end = new vscode.Position(note.positionEnd.line, note.positionEnd.character);
            editor.selection = new vscode.Selection(start, end);

            var range = new vscode.Range(start, start);
            editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        });
    });
}
export const addTodoHandler = (context: vscode.ExtensionContext) => async () => {
    const authToken = store.getItem('auth-token')
    if (!authToken) {
        vscode.window.showInformationMessage('please login first!')
        await handleLogin()
        await handleCreate()
    } else {
        handleCreate()
    }
}

const handleCreate = async () => {
    const title = await vscode.window.showInputBox({
        title: 'title', placeHolder: 'please input title', validateInput: (title: string) => {
            if (!title) {
                return 'todo title is required!'
            }
            if (title.length < 2 || title.length > 20) {
                return 'The title field must be between 2-20 chars'
            }
            return null
        }
    })
    const description = await vscode.window.showInputBox({
        title: 'description', placeHolder: 'please input description', validateInput: (description: string) => {
            if (description && (description.length < 2 || description.length > 20)) {
                return ' The description field must be between 2-50 chars'
            }
            return null
        }
    })
    const note = createNote()
    const noteInfo = JSON.stringify(note)
    const newTask = {
        title,
        description,
        status: 'TODO',
        info: noteInfo
    }
    console.log(note)
    const { data } = await addData(newTask)
    if (data.code === 200) {
        vscode.window.showInformationMessage('create successful!')
    }
}

const createNote = () => {
    let codeSnippet = '';
    let fileName = '';
    let selection = undefined;
    let positionStart: Position = { line: 0, character: 0 };
    let positionEnd: Position = { line: 0, character: 0 };

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        fileName = editor.document.uri.fsPath;
        selection = editor.selection;
        if (selection) {
            codeSnippet = editor.document.getText(selection);
            positionStart = { line: selection.start.line, character: selection.start.character };
            positionEnd = { line: selection.end.line, character: selection.end.character };
        }
    }
    const note: Note = {
        fileName: fileName,
        fileLine: selection ? selection.start.line : 0,
        positionStart: positionStart,
        positionEnd: positionEnd,
        codeSnippet: codeSnippet,
    };
    return note;
};
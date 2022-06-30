import * as vscode from 'vscode';
export const html = (webview: vscode.Webview, jsurl: vscode.Uri, cssurl: vscode.Uri) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <title>Vite App</title>
    <script type="module" crossorigin src="${jsurl}"></script>
    <link rel="stylesheet" href="${cssurl}">
  </head>
  
  <body>
    <div id="root1"></div>
    
  </body>
  
  </html>`;
}

'use strict';

const vscode = require('vscode');

/**
 * Cursor 的 Git 历史面板是 Source Control 视图容器里的
 * "Source Control Graph"（视图 id 为 workbench.scm.history）。
 * 不同版本/VS Code 版本暴露的命令名略有差异，因此按顺序尝试。
 */
const HISTORY_FOCUS_COMMANDS = [
  'workbench.scm.history',       // Cursor/VS Code：直接按视图 id 聚焦
  'workbench.scm.history.open',  // 通用视图 open 命令
  'workbench.scm.history.focus'  // 通用视图 focus 命令（部分版本）
];

async function tryExecute(command) {
  try {
    await vscode.commands.executeCommand(command);
    return true;
  } catch (err) {
    return false;
  }
}

async function focusGitHistory() {
  for (const command of HISTORY_FOCUS_COMMANDS) {
    if (await tryExecute(command)) {
      return;
    }
  }

  // 兜底：至少打开 Source Control 视图，避免快捷键完全没反应
  await tryExecute('workbench.view.scm');
  vscode.window.showWarningMessage(
    '没有找到 Git 历史记录面板命令，已打开源代码管理视图。'
  );
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitHistoryFocus.focus', focusGitHistory)
  );
}

function deactivate() {}

module.exports = { activate, deactivate };

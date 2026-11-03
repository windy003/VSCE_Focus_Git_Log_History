'use strict';

const vscode = require('vscode');

/**
 * Cursor 的 Git 历史面板是 Source Control 视图容器里的
 * "Source Control Graph"（视图 id 为 workbench.scm.history）。
 * 不同版本/VS Code 版本暴露的命令名略有差异，因此按顺序尝试。
 */
const HISTORY_VIEW_ID = 'workbench.scm.history';

const HISTORY_FOCUS_COMMANDS = [
  'workbench.scm.history',       // Cursor/VS Code：直接按视图 id 聚焦
  'workbench.scm.history.open',  // 通用视图 open 命令
  'workbench.scm.history.focus'  // 通用视图 focus 命令（部分版本）
];

async function tryExecute(command, ...args) {
  try {
    await vscode.commands.executeCommand(command, ...args);
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

/**
 * 读取当前聚焦的视图 id（Cursor 内部命令，取不到时返回 undefined）。
 * 只用于从命令面板调用时做保护，避免对别的列表误弹详情。
 */
async function getFocusedView() {
  try {
    const commands = await vscode.commands.getCommands(true);
    if (!commands.includes('getContextKeyValue')) {
      return undefined;
    }
    return await vscode.commands.executeCommand('getContextKeyValue', 'focusedView');
  } catch (err) {
    return undefined;
  }
}

/**
 * 对 Git 历史面板中当前选中的提交，弹出与鼠标悬浮完全一致的详情卡：
 * 完整提交信息、作者、时间、文件增删统计等。
 *
 * 这里复用 VS Code 列表/树的内置命令 list.showHover：它会找到当前
 * 聚焦行并显示其悬浮提示（SCM Graph 的每一行都注册了 rich hover）。
 */
async function showSelectedCommitDetails() {
  const focusedView = await getFocusedView();
  if (
    typeof focusedView === 'string' &&
    focusedView !== '' &&
    focusedView !== HISTORY_VIEW_ID
  ) {
    vscode.window.showInformationMessage(
      '请先聚焦 Git 历史记录面板，选中提交后再查看详细信息。'
    );
    return;
  }

  // 原生列表“显示悬浮详情”命令
  if (await tryExecute('list.showHover')) {
    return;
  }

  // 旧版本回退
  if (await tryExecute('workbench.action.showHover')) {
    return;
  }

  vscode.window.showWarningMessage(
    '当前版本不支持在列表中显示提交详情悬浮框。'
  );
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitHistoryFocus.focus', focusGitHistory),
    vscode.commands.registerCommand(
      'gitHistoryFocus.showDetails',
      showSelectedCommitDetails
    )
  );
}

function deactivate() {}

module.exports = { activate, deactivate };

# Git History Focus

在 Cursor 中按 `Alt+Shift+G` 直接聚焦 Git 历史记录面板（Source Control Graph，即源代码管理里的提交历史视图），聚焦后可以直接用 `↑`/`↓` 选择提交记录。

## 使用方法

1. 安装扩展后，在任意位置（编辑器、终端、侧栏均可）按 `Alt+Shift+G`。
2. 焦点会跳到 Source Control 容器中的 Graph（历史记录）视图。
3. 用 `↑`/`↓` 选择提交；`Enter` 查看提交详情。

## 如果快捷键没反应

- 确认 Cursor 窗口已重新加载（`Ctrl+Shift+P` → `Developer: Reload Window`）。
- Windows 上 `Alt+Shift` 可能被输入法语言切换占用；可在 Cursor 的快捷键设置中搜索 `gitHistoryFocus.focus` 重新绑定。
- 修改快捷键：`Ctrl+K Ctrl+S` 打开键盘快捷方式，搜索“聚焦 Git 历史记录面板”。

## 实现说明

扩展注册了命令 `gitHistoryFocus.focus`，内部依次尝试执行：

1. `workbench.scm.history`（Cursor 的 Graph 视图 id/聚焦命令）
2. `workbench.scm.history.open`
3. `workbench.scm.history.focus`
4. 兜底：`workbench.view.scm`（打开 Source Control 视图）

`package.json` 中通过 `contributes.keybindings` 将 `shift+alt+g` 绑定到该命令。

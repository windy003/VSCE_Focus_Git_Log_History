# Git History Focus

在 Cursor 中按 `Alt+Shift+G` 直接聚焦 Git 历史记录面板（Source Control Graph，即源代码管理里的提交历史视图），聚焦后可以直接用 `↑`/`↓` 选择提交记录。当提交标题被省略号截断时，**再次按 `Alt+Shift+G`** 即可弹出与鼠标悬浮完全一致的完整详情卡。

## 使用方法

1. 在任意位置（编辑器、终端、侧栏均可）按 `Alt+Shift+G`，焦点跳到 Source Control 容器中的 Graph（历史记录）视图。
2. 用 `↑`/`↓` 选择提交；`Enter` 查看提交改动。
3. 如果提交标题显示不全，再次按 `Alt+Shift+G`（或使用 VS Code 内置的 `Ctrl+K Ctrl+I`），会显示该提交的悬浮详情卡：完整提交信息、作者、时间、文件/增删行统计等，和把鼠标移到该行上完全一样。
4. 按 `Esc` 关闭详情卡并回到列表。

> 说明：详情卡使用的是 VS Code 列表原生的 “Show Hover”，弹出后键盘焦点会进入详情卡（方便用 Tab 访问卡片里的操作按钮）。按 `Esc` 后焦点会回到提交列表。

## 如果快捷键没反应

- 确认 Cursor 窗口已重新加载（`Ctrl+Shift+P` → `Developer: Reload Window`）。
- Windows 上 `Alt+Shift` 可能被输入法语言切换占用；可在 Cursor 的快捷键设置中搜索 `gitHistoryFocus` 重新绑定。
- 修改快捷键：`Ctrl+K Ctrl+S` 打开键盘快捷方式，搜索“聚焦 Git 历史记录面板”或“显示所选提交的详细信息”。

## 实现说明

扩展注册了两个命令：

| 命令 | 快捷键 | 作用 |
| --- | --- | --- |
| `gitHistoryFocus.focus` | `Alt+Shift+G`（焦点不在历史面板时） | 聚焦 Git 历史记录面板 |
| `gitHistoryFocus.showDetails` | `Alt+Shift+G`（焦点已在历史面板时） | 显示所选提交的悬浮详情 |

聚焦命令会依次尝试执行：

1. `workbench.scm.history`（Cursor 的 Graph 视图 id/聚焦命令）
2. `workbench.scm.history.open`
3. `workbench.scm.history.focus`
4. 兜底：`workbench.view.scm`（打开 Source Control 视图）

详情命令复用内置命令 `list.showHover`：它会找到历史列表当前聚焦行（`.focused`）上注册的 rich hover 并显示，因此内容、样式与鼠标悬浮完全一致。`package.json` 通过 `when` 子句 `focusedView == 'workbench.scm.history'` 区分“聚焦历史面板”和“查看详情”两种状态。

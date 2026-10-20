# OBS 接入说明（待 Grokbot 云电脑）

当前 Obsidian vault 在 **Grokbot 云电脑**，本机/本仓库尚未挂载。

## 计划目录约定

云电脑 vault 建议预留：

```text
CTA-Path-A/
  Daily/          # 日信号笔记（由 Actions 或同步脚本写入）
  Backtests/      # 周回测摘要
  Attachments/    # 图表导出
```

## 同步方向（定稿前）

1. GitHub Actions 产出 `archive/l1_report_YYYYMMDD.json`
2. 本站 `data/signals.json` 更新 → Pages 可视化
3. 云电脑侧：拉取 JSON → 生成 Markdown 进 OBS（脚本由 Grokbot 项目合并时落地）

在云电脑可 SSH/共享路径后，再把 vault 路径与同步脚本写进 `cta-path-a`。

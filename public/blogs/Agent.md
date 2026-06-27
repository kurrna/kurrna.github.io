---
title: Agent Learning
description: Harness Engineering 和 Agent 工作流的一些学习笔记。
date: 2026-06-27
category: 学习笔记
---

# Agent Learning

## Harness Engineering

Harness 的四大核心组件

- 上下文工程 Context Engineering：动态知识注入、AGENTS.md（提供一个稳定小巧的入口点）
- 架构约束 Architecture Constraints：**Types → Config → Repo → Service → Runtime → UI**，下层不能反向依赖上层
- 反馈循环 Feedback Loop：智能体审智能体
- 熵管理 Entropy Management：定期垃圾回收

| 核心组件                 | 解决的问题                   | 代表实践                             |
| ------------------------ | ---------------------------- | ------------------------------------ |
| **上下文工程** Context   | Agent 不知道该看什么、怎么找 | AGENTS.md 活文档、按需检索           |
| **架构约束** Constraints | Agent 复制并放大坏模式       | 分层依赖、自定义 Linter、CI 强制阻断 |
| **反馈循环** Feedback    | Agent 不知道自己做错了       | Agent-to-Agent Review、自动测试套件  |
| **熵管理** Entropy       | 技术债务和文档腐烂           | Doc-gardening Agent、持续垃圾回收    |

> 我印象最深的是几类问题：
>
> 1. 对异常不敏感。比如我让它分析 nanobot 仓库有多少个 commit，它没有检查仓库是不是 shallow clone，只是简单查了一下，就告诉我有六百来个 commit。
> 2. 喜欢绕弯子。完成一个目标的路径可能是 `A -> D`，但 agent 往往会走成 `A -> B -> C -> D`。
> 3. 习惯根据预训练知识直接回答，而不是先验证当前环境，再确认结论是否成立。
>
> ——[agent 每天都在犯什么错](https://chengyongru.github.io/blog/notebook/agent%20%E6%AF%8F%E5%A4%A9%E9%83%BD%E5%9C%A8%E7%8A%AF%E4%BB%80%E4%B9%88%E9%94%99/)

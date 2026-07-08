---
title: Agent Learning
description: Agent 学习的一些笔记，待整理。
date: 2026-06-27
last_update: 2026-07-06
tags: [Agent, RAG, LLM, MCP, Harness]
category: 学习笔记
---

# Agent Learning

## Agent

**Agent = LLM + Planning + Tool Use + Memory**

```python
# 规划 -> 决策 -> 执行 -> 结果存入记忆 -> 再决策
def agent_run(user_goal: str):
    plan = llm.plan(user_goal) 
    memory = [] # 短期记忆
    
    for step in plan:
        action = llm.decide(
        	step=step,
        	history=memory,
        	long_term=vector_db.search(step) # 从长期记忆中搜索相关历史
        )
        if action.type == "tool_call":
            result = tools.execut(action.tool_name, action.args)
            memory.append({"step": step, "result": result})
            
        elif action.type == "final_answer":
            return action.content # LLM 判断人物完成，返回最终答案
```

### Agent 与 Workflow 与 Tools

Agent 是一个完整的决策系统，Workflow 是更上层的编排框架，把 Agent、LLM、Tools 组织成一条确定性流程，每个节点做什么都是事前写死的

Tools 使用 MCP 作为标准化协议，Client 与 Server 的所有报文底层消息格式使用 JSON-RPC 2.0 进行通信（目前主流），本地用 stdio 管道通信，远程用 HTTP-SSE （deprecated）或 Streamable HTTP 

MCP 是标准化大模型工具调用上下文协议，分为三层：

1. **初始化握手**：Agent ↔ MCP Server 协商能力、可用工具列表
2. **工具发现**：Server 返回工具元数据（入参、描述、功能）
3. **Agent 工具调用请求**：LLM 输出结构化工具调用载荷
4. **Server 工具执行响应**：返回工具结果 / 错误
5. **上下文回灌**：结果送入 LLM 继续推理

**Agent Loop** 的停止条件：

1. LLM 主动判断任务完成
2. 设置最大循环轮数
3. 设置总 token 预算上限
4. 超时机制

Agentic Workflow 用 Workflow 固定主流程，在需要灵活判断的节点嵌入 Agent

### Agent 的设计范式

- 纯 Agent：完全让 LLM 自己决定下一步作什么
- **ReAct**（Reasoning + Acting）：推理和行动交替进行，每一步都是局部最优决策，因此在处理复杂任务，需要全局规划时容易迷失方向
- **Plan-and-Execute**：先让 LLM 专门做规划，然后由另外一个 LLM 逐步执行，执行时把结果反馈给规划器，随时进行重新规划
- **Reflection**：在 Agent 完成一步或者完成整个任务后，再让一个 LLM 来评判，如果评估不通过则充实或者换策略

### Agent 的记忆

感知记忆（本次调用的原始输入）、短期记忆（Context Window）、长期记忆（情节记忆、语义记忆、程序记忆）、实体记忆（结构化事实，如 SOUL.md 等）

- 长期记忆：通过语义检索访问
  - 情节记忆：具体的事件经历
  - 语义记忆：多次经历中提炼出来的通用知识和规律
  - 程序记忆：怎么做某件事的操作流程

知识图谱：让记忆之间产生关联

**记忆压缩**：

- 滑动窗口
- 摘要压缩：将滑动窗口硬截断的旧记忆进行摘要
- 重要性过滤：按价值筛选
- 结构化抽取

### Agent 的规划

- **CoT**：让 LLM 把推理步骤写出来，改个 Prompt 就行了
- **ToT**：同时探索多条推理路径，边探索边剪枝
- **GoT**：允许不同路径的推理路线中间结果合并和复用，一个推理节点可以接受来自多个前置节点的输出作为输入

### Multi-Agent

多 Agent 的协作方式

- 顺序流水线
- 并行 SubAgent，最后由调度者收集汇总
- 辩论/评审模式，多个 Agent 对同一个问题各自给出方案，然后由裁判或相互评审筛选最优解

单个 Agent 适合任务流程清晰，复杂度适中的任务，实现简单方便维护；多 Agent 适合需要专业分工、任务量大或需要并行执行的复杂场景，分为中心化和去中心化模式

中心化的多 Agent 系统中决策者通过路由来决定下一步

- 静态路由：提前把规则写死，比如搜索就找 Researcher Agent，代码 Review 就找对应的 Review Agent

- 动态路由：把下一步的 SubAgent 交给 LLM 来决定

  ```python
  def dynamic_route(task_context: str, available_agents: list[str]) -> str:
      """让 LLM 根据当前上下文决定下一步调用哪个 Agent"""
      prompt = f"""当前任务状态：
  {task_context}
  
  可用的 Agent：
  {chr(10).join(f'- {agent}' for agent in available_agents)}
  
  请根据当前进展，判断下一步应该交给哪个 Agent 来执行。
  只返回 Agent 名称，不需要解释。"""
  
      response = client.chat.completions.create(
          model="gpt-4",
          messages=[{"role": "user", "content": prompt}]
      )
      selected = response.choices[0].message.content.strip()
      return selected  # 返回选中的 Agent 名称
  ```

**A2A** 协议：不同 Agent 之间的通信标准协议

---

## RAG

**Retrieval-Augmented Generation 检索增强生成**

**主要流程**

- **离线阶段**：知识的准备
  - 文档加载：把各种格式的原始数据读进来
  - 文档切割 Chunking：实践中一般 500 ~ 1000 token 一个 chunk，同时前后做一定的重叠
  - 向量化 Embedding
  - 入库 VectorStore
- **在线阶段**：用户提问时实时检索
  - Query 处理：Prompt 改写，让 LLM 把用户的问题改写为更适合检索的形式或者从对话历史里补充必要的上下文
  - 向量检索（粗排）：把用户的问题也转化为向量，然后去向量库做相似性搜索，找出向量距离最近的 Top-K chunk。但是这一步没有深度理解查询和文档之间的语义关系，召回的结果容易混入一些看着近但是不相关的内容
  - Rerank（精排）：Rerank 模型会把用户问题和每个候选 chunk 拼在一起理解它们之间的相关性，然后重新排序，并把不相关的结果过滤掉
  - 生成：把用户问题+精排后的 chunk 拼成 prompt，交给 LLM 生成最终答案，通过“只根据提供的资料回答，资料里没有就说不知道”的 Prompt 来抑制 LLM 的幻觉

RAG 解决 LLM 的内置知识时效性、垂类知识与私有知识还有幻觉问题，相比于模型微调成本更低

### RAG Chunking

- 固定大小切割：chunk_size = 500, overlap = 100，比较适合纯文本和没有明显结构的文档

- 语义边界切割：维护一个分隔符优先级列表，先尝试按段落切，若太大按句子切，还是太大按标点切，知道满足 chunk_size 限制。比较适合有明确结构的 Markdown 或 HTML 文档。实际操作中可以用 NLP 工具识别句子结束位置，然后以句子为单位往 chunk里加，加满了再开启新的。

- 特殊内容专项处理：代码和表格文件等

- 父子切割：存储时一段内容存两份，一份细粒度小 chunk（比如 200 token），专门用于向量检索，另一份是包含这个小 chunk 前后文的大 chunk（比如 1000 token），通过 ID 跟对应的小 chunk 关联。解决了固定大小可能切断语义，语义边界切割质量好但是粒度不好控制的问题，兼顾检索精度和上下文完整

- Contextual Retrieval：不改变 chunk 本身，而是在向量化之前把缺失的上下文补进去。先让 LLM 根据原始文档为每个切出来的 chunk 生成一段简短的背景说明，将生成的 context 前置拼到 chunk 前面，然后再把这个 Context + chunk 整体去做 Embedding 和 BM25 索引

  > 使用 Prompt Caching 降低 Contextual Retrieval 的 LLM 成本：第一次调用会把文档缓存到 KV Cache，后续同一篇文章的所有 chunk 请求都复用这份缓存

### Embedding

将一段自然语言文本映射成一个固定长度的浮点数向量

常见 Embedding 模型

- OpenAI 的 text-embedding 系列，英文效果好
- BGE 系列，中文支持好

选择评判标准：语言支持、数据合规要求、向量维度

MTEB 为通用排行榜，不一定适用于垂类业务，正确做法是在自己的业务数据上测：准备几百条业务相关的 Query + 正确答案 chunk 对，分别使用候选模型进行检索，看正确的 chunk 有没有出现在前 K 条结果里，这个指标的名字叫做 Hit@K。通常 Hit@5 低于 0.7 就要考虑换模型或者改进 Chunking 策略。

#### Embedding 算法

1. 静态词向量：如 Word2Vec，无法处理多义词
2. 上下文相关向量：如 BERT，但是比较时要把查询和每一个候选 chunk 拼在一起重新跑一遍，检索速度慢
3. 句子级对比学习：SBERT、SimCSE、BGE，专门为“两端文本有多相似”进行优化，提前把所有文档向量算好存起来，查询时只用算一次

#### 向量数据库

核心操作叫做**近似最近邻搜索 ANN（Approximate Nearest Neighbor）**，根据一个查询向量返回 Top-K 向量

普通的关系型数据库在存储结构化数据时靠 B-tree 索引，主要用于查询精确匹配；而向量数据库则使用 HNSW 和 IVF 索引算法进行高位向量索引。其中 HNSW（Hierachical Navigable Small World）多层嵌套小世界图，召回率较高，建索引时内存消耗大，不适合内存受限场景，Qdrant、Milvus、Chroma 使用。IVF（Inverted File Index）先对向量做聚类，内存占用小，精度略低，Milvus 在大规模场景下会用 IVF 索引。通过索引能把查询时间压缩到接近 $O(logN)$

**向量数据库的性能瓶颈**：

- 内存压力：标量量化
- 大批量写入会触发 Segment 合并，影响查询延迟：批量写入改为业务低峰期，分批小批次写入

#### RAG 的在线工作流程

1. **Query 预处理**：简单改写、让 LLM 预设可能的答案再向量检索（HyDE 假设文档嵌入）、多角度 Query 扩写、后退提问（将具体问题向上抽象一层，生成一个更通用的背景问题检索，再根据背景知识回答）

2. **Query Embedding**：离线建库与在线检索必须选用相同的 Embedding 模型

3. **向量检索 + 多路召回**：粗搜 Top-K + 词法搜索（如 BM25），因为向量搜索对精确词语（如产品型号、专有名词）等不敏感。多路结果通过 RRF（互倒排名融合）算法合并，比单路覆盖面更广，质量更高

4. **ReRank**：使用专用的 ReRank 模型（Cross-Encoder 结构）将用户 Query 和候选片段拼在一起重新打分，评估它们之间的语义匹配程度，过滤噪音

5. **Prompt 拼装**：防止幻觉

   ```python
   prompt = f"""
   你是一个专业助手，请根据以下参考资料回答用户的问题。
   如果参考资料中没有相关信息，请回答「根据现有资料无法回答」，不要自行猜测。
   
   参考资料：
   [1] {chunk_1}
   [2] {chunk_2}
   [3] {chunk_3}
   
   用户问题：{user_query}
   """
   ```

6. **生成 + 溯源**：需要大模型在答案中标注每句话来自哪个片段方便追溯，工程上缓存高频 Query 的检索结果、并行执行向量搜索和词法检索以减少两路召回的延迟

#### 向量检索与词法关键词检索

代表 BM25，通过词频 TF 和稀缺度 IDF 对词汇进行打分，记录每个词出现在哪些文档中，缺点是同义词，需要与向量检索互补

```python
# 用 rank_bm25 库做关键词检索的例子
from rank_bm25 import BM25Okapi

# 文档库（实际使用时是分词后的 token 列表）
corpus = [
    ["苹果", "手机", "截图", "方法"],
    ["iPhone", "截屏", "教程"],
    ["安卓", "手机", "拍照"],
]
bm25 = BM25Okapi(corpus)

# 查询也要分词
query = ["苹果", "手机", "截图"]
scores = bm25.get_scores(query)  # 每个文档的 BM25 分数
```

**混合检索 Hybrid Search**：同时跑向量和词法检索召回两批候选，然后使用 **RRF Reciprocal Rank Fusion 互倒排名融合**，算法把两路结果合并排序

```python
def reciprocal_rank_fusion(results_list, k=60):
    """
    results_list: 多路检索结果，每路是一个 [doc_id, ...] 的有序列表
    k: 平滑参数，防止排名第 1 的文档权重过大，通常取 60
    """
    scores = {}
    for results in results_list:
        for rank, doc_id in enumerate(results):
            if doc_id not in scores:
                scores[doc_id] = 0
            # 排名越靠前（rank 越小），倒数越大
            scores[doc_id] += 1 / (rank + k)
    # 按总分降序排列，取 Top-K
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

# 使用示例
vector_results = ["doc_a", "doc_b", "doc_c"]   # 向量检索的排序结果
bm25_results   = ["doc_b", "doc_d", "doc_a"]   # BM25 的排序结果

merged = reciprocal_rank_fusion([vector_results, bm25_results])
# doc_b 两路都高排，doc_a 也两路命中，会排在前面
```

**图数据库**：向量检索是单跳的，没法沿着实体关系链向下追，图数据库存“实体与关系”的网结构。当问题里出现多个具体实体名并追问实体之间有什么关系时可以使用

#### RAG 的设计范式

本质上是：在「检索」和「生成」之间，系统应该怎么协调、怎么决策、怎么处理中间的各种异常情况？

1. **Naive RAG**：基础的检索加生成
2. **Advanced RAG**：增加 Query 改写、Rerank、混合检索等优化
3. **Modular RAG**：将各个环节模块化便于组合
4. **Self RAG**：让 LLM 自己决定要不要检索，以及评估检索质量
5. **CRPG** 自动纠错、**Graph RAG** 知识图谱增强全局理解、**Agentic RAG** 把 RAG 嵌入 Agent 循环

#### LLM 的幻觉

原因：

1. 检索层幻觉：检索层没找到
2. 生成层幻觉：LLM 没有根据检索结果回答

解决方案：

1. Prompt：对检索层幻觉效果有限，无法防止 LLM 瞎编
2. 检索质量差拒绝回答：ReRank 模型打分，最高分低于阈值则拒绝检索
3. 答案生成后逐条核查：生成后让 LLM 回头检查
4. 强制 LLM 输出时带上来源

#### RAG 效果的量化与评估

分为衡量检索质量和生成质量，本质上需要调用 LLM 来打分，工程上使用抽查和小模型来降低成本

检索层评估：

- Hit@K：找到了没有
- MRR Mean Reciprocal Rank 平均倒数排名：你要找的东西排在第几名

生成层评估：

- 忠实度：幻觉程度，加强约束，做质量门禁
- 答案相关性：防止跑题，Prompt 不够明确
- 上下文召回率：衡量是否有漏掉的内容，增强 Embedding 模型，调整 Chunking  策略，加多路召回补充覆盖面
- 上下文精确率：衡量检索结果里有用得结果是否排在前面，噪声太大，提升 ReRank 模型质量，降低最终 Prompt 中的 chunk 数量

另有线上指标如追问率、点👎率、转人工率、会话解决率等

#### RAG 知识库的更新

需要删掉旧文档对应的所有 chunk 再重新入库完成 RAG 离线流程

时机：

1. 定时轮询：扫描文档并计算哈希开销较大
2. 事件驱动：通过消息队列通知

手段：

1. 全量重建
2. 灰度更新：先并行写入新版本，验证没问题再切换，否则回滚

---

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

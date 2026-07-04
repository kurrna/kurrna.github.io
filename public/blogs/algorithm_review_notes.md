---
title: Review Notes of Algorithm
description: 算法设计复习笔记，分为分治、动态规划、贪心和图算法四个部分。
date: 2026-01-05
category: 学习笔记
---


## 25秋算法设计复习笔记

### 一、概论

#### Lecture01_Abstact

- 算法：给定计算问题，算法是一系列良定义的计算步骤。

- [插入排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/InsertionSort.cpp)算法（稳定排序）

  - 将数组待排序元素依次插入到已排序部分，使已排序部分保持升序的性质
  - 时间复杂度：$O(n^2)$
  - 空间复杂度：$O(1)$

- [选择排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/SelectionSort.cpp)算法（不稳定排序）

  - 第一次遍历找最小元素；第二次遍历找次小元素；……；第n次遍历找第n小元素
  - 时间复杂度：$O(n^2)$
  - 空间复杂度：$O(1)$

- 算法的性质：有穷性、确定性、可行性

- 时间复杂度：渐进分析最坏情况（确定上界）

  | 渐进记号              | 名称       |
  | --------------------- | ---------- |
  | $T(n) = \Theta(g(n))$ | 渐近紧确界 |
  | $T(n) = O(g(n))$      | 渐近上界   |
  | $T(n) = \Omega(g(n))$ | 渐进下界   |

- $T(n) = \Theta(g(n))$等价于$T(n) = O(g(n))$且$T(n) = \Omega(g(n))$，故算法的时间复杂度通常使用用渐近记号$O$表示。

  ```mermaid
  flowchart TB
      A[算法设计与分析] --> B[分而治之篇]
      A --> C[动态规划篇]
      A --> D[贪心策略篇]
      A --> E[图算法篇]

      subgraph B[分而治之篇]
          B1[归并排序]
          B2[递归式求解]
          B3[最大子数组I]
          B4[逆序对计数]
          B5[快速排序]
          B6[次序选择]
      end

      subgraph C[动态规划篇]
          C1[0-1背包]
          C2[最大子数组II]
          C3[最长公共子序列]
          C4[最长公共子串]
          C5[编辑距离]
          C6[钢条切割]
          C7[矩阵链乘法]
      end

      subgraph D[贪心策略篇]
          D1[部分背包]
          D2[霍夫曼编码]
          D3[任务调度]
          D4[活动选择]
          D5[最小生成树]
          D6[单源最短路径]
      end

      subgraph E[图算法篇]
          E1[广度优先搜索]
          E2[深度优先搜索]
          E3[环路存在性判断]
          E4[拓扑排序]
          E5[强连通分量]
          E6[全点对最短路径]
          E7[二分图匹配]
      end
  ```


----

### 二、分而治之篇

#### Lecture02_MergeSort & Lecture03_Solving_Recurrences

- [归并排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DevideConquer/MergeSort.cpp)算法（稳定排序）

  - 基于分治，拆$\log_2(n)$次，合并时从左到右扫描，需要额外空间存储合并过程
  - 时间复杂度：$O(n\log(n))$
  - 空间复杂度：$O(n)$

- 递归式复杂度分析：

  - $T(n)$：完成`MergeSort(A, 1, n)`（递归式算法）的运行时间，$T(n) = 2T(n/2) + O(n)$

  - 递归树法：共$log_2(n) + 1$层，每一层的代价为$O(n)$

  - 代入法：猜测$T(n) = \Theta(n\log(n))$，使用数学归纳法证明

  - **主定理法**：

    - 对于形如$T(n) = aT(\frac{n}{b}) + f(n)$的递归式，每层共a个分支，以因子b速度下降，层数$\log_b(n) + 1$，其叶节点代价之和为$a^{log_b(n)} * 1$，即$n^{log_b(a)}$。

    - 故$T(n) = \Theta(n^{\log_b(a)}) + \sum_{i=0}^{\log_b(n-1)}a^if(\frac{n}{b^i})$。

    - 根据根节点代价$f(n)$与叶节点代价之和$n_{log_b(a)}$的大小

      | 运行时间                          | 代价比较                             |
    | --------------------------------- | ------------------------------------ |
      | $T(n) = \Theta(f(n))$             | $f(n)=\Omega(n^{log_b(a+\epsilon)})$ |
    | $T(n)=\Theta(n^{log_b(a)}log(n))$ | $f(n)=\Theta(n^{log_b(a)})$          |
      | $T(n)=\Theta(n^{log_b(a)})$       | $f(n) = O(n^{log_b(a-\epsilon)})$    |

    - 若$f(n) = n^k$，则有如下简化形式：

      | 运行时间                        | 代价比较                           |
      | ------------------------------- | ---------------------------------- |
      | $T(n) = \Theta(n^k)$           | $k > log_b(a)$ |
      | $T(n)=\Theta(n^klog(n))$ | $k = log_b(a)$ |
      | $T(n)=\Theta(n^{log_b(a)})$       | $k < log_b(a)$ |

    - 另有主定理扩展形式：对于$f(n)=\Theta(n^{log_b(a)}log^k(n))$

      | 运行时间                        | 代价比较                           |
      | ------------------------------- | ---------------------------------- |
      | $T(n)=\Theta(n^{log_b(a)}log^{k+1}(n))$ | $k > -1$ |
      | $T(n)=\Theta(n^{log_b(a)}loglog(n))$ | $k = -1$ |
      | $T(n)=\Theta(n^{log_b(a)})$ | $k < -1$ |

#### Lecture04_Maximum_Contiguous_Subarray

- [最大子数组](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DevideConquer/MaximumContiguousSubarray.cpp)：最大子数组之和=max(以A[mid]结尾的最大子数组之和+以A[mid+1]开头的最大子数组之和，LEFT部分最大子数组，RIGHT部分最大子数组)
  - **分治法**：$O(n\log(n))$
  - 空间复杂度：$O(1)$
  - 【更快的算法】动态规划：$O(n)$

#### Lecture05_Counting_Inversion

- [逆序对计数](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Counting_Inversion.cpp)：逆序对总数[1, n] = max(逆序对总数[1, mid], 逆序对总数[mid+1, n], 跨越mid的逆序对数目)，
- 计算跨越mid的逆序对数目，在合并时对数组进行归并排序的同时计算逆序对数目。
  - 分治法：$O(n\log(n))$
  - 空间复杂度：$O(n)$

#### Lecture06_Polynomial_Multiplication

- 多项式乘法：将系数数组A和B根据指数$\frac{n}{2}$的大小关系分别划分为两个子数组$A_0$，$A_1 * x^\frac{n}{2}$和$B_0$，$B_1 * \frac{n}{2}$，递归三次分别求解$A_0B_0$，$(A_0 + A_1)(B_0 + B_1)$，$A_1B_1$。这样两个交叉项可由三个结果计算出来。
  - 改进的分治法：$O(n^{\log(3)})$
  - 【更快的算法】快速傅里叶变换：$O(n\log(n))$

#### Lecture07_Quicksort

- [快速排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DevideConquer/QuickSort.cpp)算法（不稳定排序）
  - 与归并排序相比，侧重分解，并且不需要额外的空间且缓存友好。使用最简单的优化方式：随机选取主元。
  - 最好情况：$O(nlog(n))$
  - 最坏情况：$O(n^2)$
  - 随机主元期望时间复杂度：$O(nlog(n))$

#### Lecture08_Selection_Problem

- [次序选择问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DevideConquer/SelectionProblem.cpp)：求数组中第k小的元素，不必对所有元素排序，选取一个主元进行位置划分后左边的元素有$pivotIdx - start$个，若$k-1 < pivotIdx - start + 1$，则数组第k小元素在左边，若大于则在右边。
  - 最好情况：$O(n)$
  - 最坏情况：$O(n^2)$
  - 随机主元期望时间复杂度：$O(n)$

#### Lecture09_HeapSort_LowerBound

- 优先队列：支持将新元素插入队列Insert和将队列中最小元素出队Extract_Min
- (二叉)堆：支持Insert和Extract-Min的时间复杂度都为$O(log(n))$
  - 相当于一棵完全二叉树，包含n个节点的堆的高度为$log(n)$
  - 小根堆(最小堆)：父节点的值不大于其左右孩子节点的值
  - 使用数组实现：对于每个元素$a[i]$，其左孩子下标$2i+1$，右孩子下标$2i + 2$，父节点下标为$\lfloor \frac{n}{2} \rfloor$
  - 插入Insert：若父节点大于当前节点则不断向上冒泡直到满足最小堆的有序性
  - 最小值出队Extract-Min：直接移除根节点，将最后一个节点复制道跟节点，不断向下冒泡直到满足最小堆的有序性（与值较小的孩子节点进行交换）
- [堆排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DevideConquer/HeapSort.cpp)算法（不稳定排序）
  - 建立一个有n个节点的二叉堆（更有效的建堆方法$O(n)$），执行n次Extract-Min操作。
  - 时间复杂度：$O(nlog(n))$
  - 空间复杂度：$O(1)$
- 排序算法的下界
  - 定理：任何**基于比较的**排序算法其时间复杂度的下界均为$\Omega(n\log(n))$（使用决策树模型证明）
  - 推论：堆排序以及归并排序是渐进最优的基于比较的排序算法
- [计数排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/CountingSort.cpp)算法（稳定排序）
  - 对于元素x，确定小于x的元素的数量i，将x放在输出数组的i+1位置
  - 时间复杂度：$O(n + k)$
  - 空间复杂度：$O(n + k)$

---

### 三、动态规划篇

#### Lecture10_0-1_Knapsack

- [0-1背包问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DP/ZeroOneKnapsack.cpp)
  - 输入：n个商品组成集合O，每个商品有两个属性$v_i$和$p_i$，分别表示体积和价格；背包容量为C
  - 输出：求解一个商品子集，总价值最高且容量小于C
  - 蛮力枚举：$O(2^n)$
  - 带缓存递归：自顶向下，在递归过程求解
  - 递推求解：自底向上，$O(nC)$
- 动态规划一般步骤
  - 问题分析：$P[n, C]$：前$n$个商品可选、背包剩余容量为$C$时的最大总价格
  - 递推关系：$P[i, c] = max\{P[i - 1, c], P[i - 1, c - v_i] + p_i\}$
    - 分析最优子结构：问题的最优解由相关子问题最优解组合而成，子问题可以独立求解
  - 自底向上：初始化$P[i, 0] = 0, P[0, c] = 0$，依次求解问题
  - 决策过程：回溯追踪最优方案，使用$Rec[i, c]$记录决策过程

#### Lecture11_MaxSubArrayII

- [最大子数组](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DP/MaxSubArray.cpp)（动态规划）
  - 时间复杂度：$O(n)$

#### Lecture12_Longest_Common_Sequence

- [最长公共子序列问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DP/LongestCommonSequence.cpp)
  - 给定两个序列X和Y，求其最大公共子序列（即去掉任意多个元素剩下的部分）
  - 使用追踪数组Rec记录这一步是"L", "U"还是"LU"
  - 时间复杂度：$O(n * m)$

#### Lecture13_Longest_Common_Substring

- [最长公共子串问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DP/LongestCommonSubstring.cpp)
  - 与最大公共子序列不同的是不需要求解子问题
  - 时间复杂度：$O(n * m)$

#### Lecture14_MED

- [编辑距离问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DP/MinimumEditDistance.cpp)
  - 使用$Rec[i,j]$保存子问题来源，上侧"U"则操作为删除s[i]，左侧"L"则操作为插入t[j]，对角线"D"则为用t[j]替换s[i]。最后根据数组Rec输出最少编辑操作。
  - 时间复杂度：$O(n * m)$

#### Lecture15_RodCutting

- [钢条切割问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DP/RodCutting.cpp)
  - 输入钢条价格表$p[1\ldots n]$，输出最大收益$C[n]$与钢条切割方案
  - 使用rec[i]记录长度为i的钢条切割的第一段应该是多少
  - 时间复杂度：$O(n^2)$

#### Lecture16_MatrixMul

- [矩阵链乘法（Matrix Chain Mul）](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/DP/MatrixChainMul.cpp)
  - 输入：n个矩阵组成的矩阵链；矩阵链$U_{1\ldots n}$对应的维度数分别为$p_0, p_1, \ldots ,p_n$，$U_i$的维度为$p_{i-1} * p_i$
  - 输出：找到一种加括号的方式，以确定矩阵链乘法的计算顺序，使得最小化矩阵链标量乘法的次数
  - $dp[i, j] = dp[i, k] + dp[k + 1, j] + p_{i-1}p_kp_j$，$dp[i, j]$表示计算矩阵链$U_{i\ldots j}$所需标量乘法的最小次数
  - 时间复杂度：$O(n^3)$

---

### 四、贪心策略篇

#### Lecture17_Frac_Knapsack

- [部分背包问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Greedy/FracKnapsack.cpp)
  - 输入：n个商品组成集合O，每个商品有两个属性$v_i$和$p_i$，分别表示体积和价格；背包容量为C
  - 输出：求解一个解决方案$S=\{x_i|1\le i \le n, 0\le x_i \le 1\}$（其中当$x_i$只能取0或1时变为0-1背包问题）在约束条件下使得$\sum_{x_i \in S} x_i * p_i$最大
  - 与0-1背包区别为物品是否可分
  - 贪心策略：最高性价比优先，按性价比进行排序并初始化
  - 时间复杂度：$O(n\log(n))$

#### Lecture18_HuffmanCode

- [最优前缀码问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Greedy/HuffmanCode.cpp)
  - 输入：字符数n以及各个字符的频数$F = <f_1, f_2, \ldots, f_n>$
  - 输出：解析结果唯一的二进制编码方案C，使得字符串总长$\sum_{i=1}^{n} |c_i|*f_i$最小
  - 贪心策略1：优先处理高频字符，将字符频数从大到小排序，依次编码高频字符
  - **贪心策略2**：优先处理低频字符，选择两个最小的频数$f_1, f_2$，合并为$f' = f_1 + f_2$后加入F，重复合并过程（霍夫曼编码）
  - 时间复杂度：$O(nlog(n))$

#### Lecture19_ActivitySelection

- [活动选择问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Greedy/ActivitySelection.cpp)
  - 输入：活动集合S，每个活动$a_i$的开始时间$s_i$和结束时间$f_i$，每个活动的权值$w_i$
  - 输出：活动集合的权重和最大子集使得时间不重叠
  - 存在重叠的子问题使用动态规划求解，$D[i]$为前i个活动中不冲突活动最大权重和，$p[i]$为$a_i$开始前最后结束的活动
  - $D[i] = max\{D[p[i]] + w_i, D[i-1]\}$

---

### 算法策略小结

独立子问题：分而治之

重叠子问题：动态规划

单一子问题：贪心算法

---

### 五、图算法

#### Lecture20_Graph

- 图的概念 $G = <V, E>$

  - 相邻：边$(u, v)$连接的顶点$u$和$v$相邻
  - 关联：边$(u, v)$和其连接的顶点相互关联
  - 顶点的度：$deg(v)$为v关联的边数
  - 图的度：$deg(G) = \sum_{v \in V} deg(v)$

- 握手定理：无向图的度是边数的两倍，$deg(G) = 2|E|$

- 路径：图中一个顶点序列$<v_0, v_1, \ldots, v_k>$称为$v_0$到$v_k$的路径

  - 若存在路径$<v_0, v_1, \ldots, v_k>$，则$v_0$**可达**$v_k$
  - 若路径中点各不相同，则该路径为**简单的**
  - 若路径这种$v_0=v_k$且至少包含一条边，则该路径为**环路**

- 连通：如果图的任意对顶点都互相可达，则称该图是连通的，反之称非连通

  - 连通分量：根据是否连通将顶点进行分组，相互可达的顶点集称为**连通分量**

- 子图：若$V' \subseteq V, E' \subseteq E$，则称图$G' = <V', E'>$是图G的一个子图

  - 生成子图(Spanning Subgraph)：若$V' = V, E' \subseteq E$，则称图$G' = <V', E'>$是图G的一个子图

- 树：连通、无环图 $T = <V_T, E_T>$

  - 树有$|V_T| - 1$条边
  - 森林：一至多棵树组成的无环树

- 邻接链表：图 $G = <V, E>$，其邻接链表由$|V|$条链表的数组构成

  - 每个顶点有一条链表，包含所有与其相邻的顶点
  - 空间大小：$O(|V|+|E|)$

- 邻接矩阵：图$G = <V, E>$，其邻接矩阵由$|V|*|V|$的二维数组A构成，满足$A_ij = (i, j) \in E$

#### Lecture21_BFS

- [广度优先搜索](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/BFS.cpp)
  - 输入：图G，源点root
  - 输出：前驱数组$pred[]$，距离数组$dist[]$
  - 时间复杂度：$O(V+E)$
- 算法应用：计算最短路径

#### Lecture22_DFS

- [深度优先搜索](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/DFS.cpp)
  - 辅助数组$d$：顶点发现的时刻
  - 辅助数组$f$：顶点完成的时刻
  - 时间复杂度：$O(V+E)$
- 深度优先树：顶点以前驱为祖先形成的树
- 边的性质
  - 树边：深度优先树中的边
  - 后向边：不是树边，但是两顶点在深度优先树中是祖先（在顶点与根节点的路径上的顶点）后代关系
  - 对于无向图，非树边一定是后向边
- 点的性质
  - 括号化定理：点v发现时刻和结束时刻构成区间$[d[v], f[v]]$
  - 任意两点$v, w$必满足下列情况之一：
    - $[d[v], f[v]]$包含$[d[w], f[w]]$，w是v的后代
    - $[d[w], f[w]]$包含$[d[v], f[v]]$，v是w的后代
    - $[d[w], f[w]]$与$[d[v], f[v]]$完全不重合，v和w都不是对方的后代
- 路径性质
  - 白色路径定理：在深度优先树中，顶点v是w的祖先$<=>$在v被发现前，从v到w存在全为白色顶点构成的路径
- 算法应用：环路的存在性判断、拓扑排序、强连通分量

#### Lecture23_Directed_DFS

- [有向图的深度优先搜索](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/DirectedDFS.cpp)
  - 无向图：无向图无论DFS还是BFS，优先树的形状取决于搜索顺序，数量为一棵（连通无向图搜索会遍历所有节点）
    - 无向图的非树边一定是后向边
  - 有向图：优先树（森林）的形状取决于搜索顺序，树的数量取决于搜索顺序
    - 树边：在深度搜索树的边
    - 前向边：不在深度搜索树中，从祖先指向后代的边
    - 后向边：从后代指向祖先的边
    - 横向边：顶点不具有祖先后代关系的边

#### Lecture24_Cycle

- [有向图中环路的存在性](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/Cycle.cpp)
  - 时间复杂度：$O(V+E)$
  - 有向图存在环路$<=>$搜索时出现后向边

#### Lecture25_TopoSort

- 有向无环图DAG：表示事件发生的先后顺序

- [拓扑排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/TopoSort.cpp)
  - 输入：有向无环图$G=<V, E>$
  - 输出：图顶点$V$的拓扑序S，满足：对任意有向边$(u, v)$，排序后u在v之前
  - 有向图顶点的度分为入度和出度，若顶点入度为0，所对应事件无制约可直接完成
  - 算法思想：完成入度为0对应的事件，删除完成事件，产生新的入度为0点，继续完成
  - 时间复杂度：$O(V+E)$
- 与深度优先搜索的关系：
  - 顶点完成时刻的逆序
  - 拓扑序：对任意边$(u, v)$，u在v前面，$f(u) > f(v)$
- 广度优先拓扑排序：顺序思想
- 深度优先拓扑排序：逆序思想

#### Lecture26_SCC

- [强连通分量（Strongly Connected Components)](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/SCC.cpp)
  - 强连通分量中任意两点相互可达且满足最大性（加入新顶点则不保证相互可达）
  - 任意两强连通分量不相交
  - 算法思想：
    - 将边反向，得到反向图$G^R$
    - 在$G^R$上执行DFS，得到顶点完成时刻顺序L
    - 在G上按L逆序执行DFS，得到强连通分量
  - 时间复杂度：$O(V+E)$
- 正确性证明：将强连通分量看作一个点，得到一个有向图$G^{SCC}$
  - 定理：一定是有向无环图（反证法）
  - $SCC_{Sink}$：$G^{SCC}$中出度为0的点
    - $G^{SCC}$中存在至少一个$SCC_{Sink}$
    - 删除所有$SCC_{Sink}$，会产生新的$SCC_{Sink}$
  - 按照$SCC_{Sink}$的性质看第二次DFS（按照L逆序执行），发现是按照$SCC_{Sink}$的顺序搜索
    - 强连通分量内，顶点相互可达	$=>$DFS可以访问到该SCC的所有点
    - $SCC_{Sink}$出度为0		            $=>$DFS不会访问该SCC以外的点

-  深度优先搜索的应用
  - 环的存在性：深度搜索边的性质
  - 拓扑排序、强连通分量：深度搜索点的性质（括号化性质）

#### Lecture27_Prim

- 最小生成树
  - 输入无向图$G=<V,E,W>$，求权重最小的连通且无环生成子图（生成树），有可能不唯一
  - 生成树：一个无向图中的连通、无环的生成子图
  - 算法思想：
    - 新建一个空边集A
    - 每次向边集A中新增加一条边（安全边）
      - 需保证边集A仍是一个无环图
      - 需保证边集A仍是最小生成树的子集

  - 安全边（Safe Edge）
    - 最小生成树T的一个子边集A，若边$\{(u, v)\} \cup A$仍是T的一个子边集，则称$(u, v)$为A的安全边

  - 割（Cut）
    - 图 $G=<V,E>$是一个连通无向图，**割$(S, V-S)$**将图 G的顶点集划分为两个部分

  - 横跨（Cross）
    - 给定割和边，$u \in S$，$v \in V - S$，称边$(u, v)$**横跨**割$(S, V-S)$

  - 轻边（Light Edge）
    - 横跨割的所有边中，权重最小的称为横跨这个割的一条**轻边**

  - 不妨害（Respect）
    - 如果一个边集A中没有边横跨某割，则称该割S**不妨害**边集A

  - 安全边辨识定理
    - 给定带权无向连通图，A为边集E的一个子集，且A包含在G的某棵在图G的某棵最小生成树中
    - 若割$(S,V-S)$是图G中**不妨害边集A**的任意割，且边$(u, v)$是横跨该割的轻边
    - 则对于边集A，边$(u, v)$是其**安全边**
- [Prim 最小生成树](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/Prim.cpp)
  - 算法思想：
    - 选择任意一个顶点，作为生成树的起始顶点
    - 保持边集A始终为一棵树，选择割$(V_A, V-V_A)$，其中$V_A$为树中顶点
    - 选择横跨割$(V_A, V-V_A)$的轻边，添加到边集A中
    - 重复以上两步，直至覆盖所有顶点

  - 辅助数组
    - color表示顶点状态（已覆盖or未覆盖）
    - dist记录横跨$(V_A, V-V_A)$边的权重
      - 顶点集$V_A$到顶点u的最短距离，$dist[u] = min\{w(x, u)\}, x \in V_A$
      - 轻边：$min\{dist[u]\}, u \in V - V_A$

    - pred表示前驱顶点
      - (pred[u], u)为最小生成树的边

  - 时间复杂度：
    - 初始化$O(V)$
    - 记录新增的安全边$O(V)$，执行$|V|$次，总时间$O(V^2)$
    - 更新dist数组$O(deg(u))$，执行$|V|$次，总时间$2|E|$（$\sum_{u \in V} deg(u) = 2 |E|$
    - 使用优先队列优化后上述两步总时间分别变为$O(Vlog(V))$，$O(Elog(V))$
    - 总时间复杂度：$O(E * \log(V))$（因为稀疏图E远大于V）

  - 算法实现：
    - 初始化辅助数组inMST，dist，parent，优先队列pq
    - 将起始节点加入pq
    - 当pg未空，循环：
      - u = pq.extractMin()
      - 遍历u的邻边尝试更新dist，若不在MST中且边(u, v)权值w小于dist[v]则更新dist[v]和pred[v]，使用pq.DecreaseKey(v, dist[v])维护优先队列


#### Lecture28_Kruskal

- 不相交集合
  - 初始化集合Create-Set：创建根节点，并设置一条指向自身的边$O(1)$
  - 判定顶点是否在同一集合Find-Set：回溯查找树根，检查树根是否相同$O(h)$
  - 合并集合Union-Set：合并两棵树$O(h)$
  - 树的高度与顶点规模$=>$ $|V| \ge 2^h$

- [Kruskal 最小生成树](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/Kruskal.cpp)
  - 贪心策略：不形成环的最小边（判断所选边的顶点是否在一棵子树）
  - 使用不相交集合来判定和维护所选边的顶点是否在一棵子树
  - 时间复杂度
    - 将边按权排序$O(Elog(E))$
    - 为顶点建立并查集$O(V)$
    - 对每一条边的两个顶点使用Find-Set判定是否在一个集合，若不在，使用Union-Set合并$O(log(V))$，总时间$O(Elog(V))$
    - 总时间：$O(E\log(V))$，因为稀疏图$E=O(V^2)$

| 最小生成树生成算法框架 | Prim算法                 | Kruskal算法                |
| ---------------------- | ------------------------ | -------------------------- |
| 核心思想               | 保持一颗树，不断扩展     | 子树森林，合并为一棵树     |
| 数据结构               | 优先队列                 | 不相交集合                 |
| 求解视角               | 微观视角，基于当前点选边 | 宏观视角，基于全局顺序选边 |
| 算法策略               |       都是采用贪心策略的图算法                                               |都是采用贪心策略的图算法|

#### Lecture29_Dijkstra

- [Dijkstra 单源最短路径](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/Dijkstra.cpp)
  - 辅助数组
    - dist表示估计距离，初始化为INF
    - color表示顶点状态
    - pred表示前驱节点
  - 贪心策略：每次选择加入估计距离最短
  - 算法思想
    - 初始化顶点集$V_A$（加入初始节点）
    - 使用优先队列弹出估计距离最短的点，遍历所有邻接边，更新所有估计距离，维护优先队列$O(deg(u)\log(V))$，总时间$O(E\log(V))$
    - 重复直到队列为空
  - 时间复杂度：$O(E\log(V))$

| 求解最短路径问题 | 广度优先搜索 | Dijkstra算法  |
| ---------------- | ------------ | ------------- |
| 适用范围         | 无权图       | 带权图（w>0） |
| 数据结构         | 队列         | 优先队列      |
| 运行时间         | $O(V+E)$     | $O(E\log(V))$ |

- **timeline**
  - 1959年：Dijkstra算法诞生
  - 1984年：使用斐波那契堆优化数据结构，时间复杂度优化到$O(E+V\log(V))$
  - 2024年：算法最优性证明
  - 2025年：排序瓶颈突破，时间复杂度优化到$O(E\log^{\frac{2}{3}} (V))$

#### Lecture30_Bellman-Ford

- [Bellman-Ford 单源最短路径](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/BellmanFord.cpp)
  - 存在负权边时，Dijkstra算法不可用
  - 输出：源点到其他顶点的最短距离和最短路径、或存在源点可达的负环
  - 时间复杂度：$O(V*E)$，总共松弛$O(V*E)$次
  - 挑战1：图中存在负权边时，如何求解单源最短路径？
    - 每轮对所有边进行松弛，持续迭代$|V| - 1$轮
  - 挑战2：途中存在负权边时，如何发现源点可达负环？
    - 若第$|V|$轮仍松弛成功，存在源点s可达的负环（若存在负环，可松弛无限次）

#### Lecture31_Floyd

- [Floyd 所有点对最短路径](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/Floyd.cpp)
  - 输出：任意点对(u, v)之间的最短路径
  - 若使用Dijkstra依次求解所有问题则存在重叠的子问题，使用动态规划求解
  - 递推公式：$D[k, i, j]$表示前k个点选点经过时，i到j的最短距离
    - $D[k,i,j] = min\{D[k-1,i,j],D[k-1,i,k] + D[k-1,k,j]\}$
  - 算法实现
    - 按照k增大的顺序，循环：
      - 按照i增大的顺序，循环：
        - 按照j增大的顺序，循环：
          - 松弛并记录路径：$D[i,j] = min\{D[i,j], D[i,k]+D[k,j]\}$
  - 时间复杂度：$O(V^3)$

```latex
  [最短路径算法小结
    [单源最短路径算法
      [广度优先搜索（适用于边权都为1的情况）$O(|V| + |E|)$]
      [Dijkstra算法（适用于边权全非负的情况）$O(|E| \cdot \log|V|)$]
      [Bellman-Ford算法（适用于边权可以为负的情况）$O(|E| \cdot |V|) = O(|V|^3)$（稠密图中$|E| = O(|V|^2)$）]
    ]
    [所有点对最短路径算法
      [Floyd-Warshall算法（适用于不存在负环的情况）$O(|V|^3)$]
    ]
  ]
```

#### Lecture32_Matching

- 二分图（Bipartite Graph）
  - 无向图分为L，R两个顶点集，每条边一个端点在L，另一个在R
- 匹配（Matching）
  - 一个匹配M是边集E的一个子集，该图G的每个顶点至多关联M的一条边
- 交替路径（Alternating Path）
  - 从未匹配顶点触发，依次经过“非匹配边、匹配边……非匹配边”形成的路径
- [最大二分匹配问题](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/Matching.cpp)
  - 输入：二分图$G=<L, R, E>$
  - 输出：求出最大匹配$M=\{e_1,e_2,\ldots ,e_k\}$，使得满足$\forall i,j(i\neq j),e_i=(l_i,r_i),e_j=(l_j,r_j)$，且$l_i\neq l_j,r_i\neq r_j$（即每个顶点最多关联一条边）
  - 匈牙利算法
    - 核心思想：不断寻找交替路径进行增广，依次检测左侧顶点，若为未匹配，则构成交替路径直接匹配，若已匹配，则寻找交替路径增广成新的匹配。检测所有左侧顶点后算法结束
    - 辅助数组：
      - matched表示L与R中顶点的匹配关系
      - color为深度优先搜索辅助数组
  - 时间复杂度：$O(V*E)$

#### Lecture33_VectorSearchforLLM

- 面向智能模型的向量查询
  - 向量数据库：存储、管理和处理非结构化数据的向量表征的数据
    - 核心操作：近邻查询
      - 给定查询点在向量数据库中找到其最近的近邻
- 精确近邻查询问题（Nearest Neighbor Search Problem）
  - 输入：n个d维向量集合X，其中$x_i \in R^d$；查询近邻数k，查询点$q \in R^d$
  - 输出：与查询点最近的k个向量；评价指标（召回率）
  - 维诺图
    - 基点
    - 区域
    - 半空间：区域中基于一个基点对中单个基点根据垂直平分线划分的区域
    - 基点$x_i$的维诺区域为：$x_i$与所有其他基点形成半空间的交集
    - 基点集合$X=\{x_1,\ldots ,x_n\}$形成n个维诺区域
  - 德劳内图：
    - 连接相邻的维诺区域对应的基点所构成的图
  - 德劳内图上的贪心近邻查询算法：
    - 从一个起始点触发，搜索查询点的最近点

#### Lecture35_MaxFlow

- 流网络：给定有向图G = <V, E, C>
  - 容量：对于每条边$c(e) \ge 0$
  - 流量：对于每条边$c(e) \ge f(e) \ge 0$
  - 剩余容量：对于每条边，剩余容量为$c(e) - f(e)$
  - 总流量：$|f| = \sum_{e out of s} f(e) = \sum_{e in to t}f(e)$
- 流量的两条性质：
  - 容量限制：对边$e \in E$，有$0 \le f(e) \le c(e)$
  - 流量守恒：对顶点$v \in V - \{s, t\}$，$\sum_{eintov}f(e) = \sum_{eoutofv}f(e)$（即进入某顶点v流量和等于流出此顶点流量和）

- [最大流](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/Graph/MaxFlow.cpp)
  - 输入：有向图G流网络，源点s，汇点c
  - 输出：总流量$|f|$的最大值，在容量限制和流量守恒两条限制下
  - 时间复杂度：$O(E*|f^*|)$，每次循环后流的值至少增加1，最多循环$|f^*|$次

|          | 最大二分匹配                 | 最大流                                       |
| -------- | ---------------------------- | -------------------------------------------- |
| 核心思想 | 寻找交替路径，增加匹配数     | 寻找增广路径，扩充流量                       |
| 图的结构 | 二分图                       | 流网络                                       |
| 边的性质 | 匹配边、非匹配边             | 流量、容量、残存容量                         |
| 增益过程 | 找到一条交替路径，匹配数加一 | 找到一条增广路径，流量增加路径的最小剩余容量 |

---

### 六、复杂性理论：P、NP、NP完全

#### Lecture34_P_NP_NPC

- 背景介绍

  - 难以证明一个问题不存在高效算法$=>$证明该问题是NP完全问题

  - NPC：如果一个NP完全问题存在多项式时间算法，则所有NP问题都存在多项式时间算法

- 判定问题（Decision Problem）

  - 结果为“是”或者“否”
  - NP完全理论仅考虑判定问题
  - 其他“难解问题”：判定问题、搜索问题、优化问题、计数问题
  - 一个优化问题（要求计算结果为最优解）通常对应至少一个判定问题，可利用判定问题算法来求解优化问题

- P问题：

  - 问题实例的编码方案
    - 定义：以计算程序可理解的方式表示问题的实例
    - 抽象问题实例x的输入规模是指其编码e(x)的长度，记为$|x|$
  - 算法分类：
    - 多项式时间：给定问题实例，若存在与输入规模n无关的常熟、算法A能在$O(n^k)$时间内求解该实例，则称A为多项式时间算法
    - 非多项式时间
  - 多项式时间可解问题（也称为“易解”问题）
  - P类：包含所有多项赛事时间可解的判定问题，即存在算法可以在多项式时间内根据给定输入得到判定结果
    - 实例：素数判定问题、部分背包的判定问题、二分图最大匹配的判定问题、单源最短路的判定问题

- NP问题：

  - 证书（Certifacate）：对应于判定结果为“是”的一组对象
    - 证书验证算法：给定问题实例编码x和称为证书的二进制编码y，如果存在一个证书y满足$A(x,y)=1$，则验证算法A验证了输入x
    - 证书的可验证性：给定一个被假设判定结果为“是”的输入以及其对应的证书，可以通过验证算法及证书验证该输入得到的判定结果确实为“是”
  - NP类：包含所有满足以下性质的判定问题。对每个判定结果为“是”的输入，都存在一个对应的证书，使得可以在多项式时间内使用验证算法验证该输入的判定结果为“是”
    - 实例：生成树判定问题、0-1背包判定问题、子集和判定问题、布尔公式的可满足性条件（SAT）、3-CNF的可满足行条件（3-SAT）
  - P = NP ?
    - 无法判断，根据定义有$P\subseteq NP$，但$P=NP$、$P\neq NP$、$NP \subseteq P$均无法判断

- NP完全问题

  - 规约Reduction：如果问题$Q_1$的每个实例都可以“重新表述”为$Q_2$问题的一个实例，则称$Q_1$可以规约到$Q_2$，记作$Q_1 \le Q_2$。如果$Q_1 \le Q_2$，那么$Q_1$的“难度”并不显著高于$Q_2$的“难度”
  - 多项式时间规约：给定判定问题 𝑸𝟏与𝑸𝟐。从𝑸𝟏到𝑸𝟐的多项式时间规约是满足以下性质的变换𝒇，记作𝑸𝟏 ≤𝒑 𝑸𝟐 ：
    - 对任意𝑸𝟏输入𝒙，𝒇将其变换为𝑸𝟐输入𝒇(x) 。并且𝒇(𝒙)的判定结果为“是” 当且仅当𝒙判定结果为“是”
    - 𝒇(𝒙)是多项式时间内可计算的



## 常见算法与数据结构

### Bucket_Sort

- [桶排序](https://raw.githubusercontent.com/kurrna/algorithm/refs/heads/master/src/algorithms/BucketSort.cpp)
  - 适用条件：数据取值范围已知且数据分布相对均匀
  - 非比较类排序，稳定性基于桶内使用的排序算法，每个桶内排序任务相互独立，可并行化处理
  - 缺点是对数据分布依赖性强，数据集中在小范围时效率下降。
  - 时间复杂度：$O(n+k+n \log(\frac{n}{k}))$
    - 最好/平均情况：当数据均匀分布且每个桶元素数$\frac{n}{k}$趋近于常数时，趋近于$O(n)$
    - 最坏情况退化到桶内排序算法de

  - 空间复杂度：$O(n+k)$

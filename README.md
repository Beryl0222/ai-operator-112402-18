# 手机离线变声的变长 MDCT 与无缝切窗

这里的录音页与设备窗表是用于设备联调的合成资料。使用 Node.js 22。运行 `npm ci --offline` 核对依赖锁，`npm run inspect` 查看资料字段，`npm test` 检查资料格式及相互引用。检视脚本只读取元数据。

## 数据格式

长窗长度 2M，短窗长度 2m，每块 MDCT 输出一半系数，归一系数为 sqrt(2/M) 或 sqrt(2/m)，内积核 cos(π/M(n+0.5+M/2)(k+0.5))。短窗组覆盖 M 样本的步长。start/stop 是长短窗桥，窗表在 mdct-assets.mjs，由长度与板级过渡编号确定。PCM 的数学参考是重叠各逆变换并求和。只需对整段合法原系数恢复严格容差 absoluteError；变声操作后按公开频谱操作解释且只输出所需逆归一结果。最多有 2 条声道。cutLimit 是局部替换后原 PCM 页读取次数；mulLimit 是常规长窗总等效浮点乘法上限；workBytes 含双向的窗表、临时系数与半成品。 short-group 的第一个短窗相对其 knot 的左偏移为 (M−m)/2，之后每隔 m，窗口按提供的 MDCT 表。M 或 m 做步长，MDCT 系数按频率 k 的升序。常规预算针对一声道一次 2M 长窗正反均计，端点允许调用方给出已确认零边界。inverse 也采用相同 sqrt(2/M) 归一。 变声频带资料中的 [块,起,止,缩放] 采用供应方出版块的标识。短组以同一长步长位置和组内子块登记，短窗频带下标不沿用同位置被替换过的长谱下标。

## 取数

`inputs/mdct-assets.json` 保存标定、规格和调用记录。记录中的范围除明确说明外从零开始，使用半开区间。批量数组按调用记录列出的顺序交付。voiceBlock(page,channel) 按 2m 个采样读 PCM，mdctWindow(type) 读 long、start、short 或 stop 的窗权重。

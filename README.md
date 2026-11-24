# 图文解说的混精度 SwiGLU 合批交接

项目资料使用可独立读写的 JSON。Node.js 22.23.4 下运行 `npm ci --offline` 准备环境，然后运行 `npm run inspect` 检查合成数据字段，运行 `npm test` 校验样本引用及格式。

## 输入契约

两支均为 x 的仿射投影，融合 h=up*gate/(1+exp(-gate))。projection 中每一行按输入维度，字典索引为物理组、通道位置。abs(reference - approximate)<=err，独立误差界以所有允许值判断。rater 按权重求 h 的线性汇总，阈值比较为 >=。reader 为每个逻辑通道给绝对误差允许值，并可回读实际交付的值、包版本及通道名。资源只计内部算子工作区和等待读取的结果。

## 资料读取

样本位于 `inputs/session.json`，其中 `events` 是按到达顺序记下的操作，编号从零开始。variant 为裁切及权重版绑定。up、gate 按裁切和组分支提供，blocks 提供某组两支，refine 指选择重取精度的裁切和组，take 指裁切和接收方。

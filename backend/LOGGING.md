# 日志系统使用说明

## 概述

项目已集成完整的日志系统，所有关键操作都会被记录到日志文件中，方便问题排查和系统监控。

## 日志文件位置

```
backend/logs/
├── app_YYYYMMDD.log      # 所有日志（INFO及以上级别）
└── error_YYYYMMDD.log    # 仅错误日志（ERROR及以上级别）
```

## 日志级别

- **DEBUG**: 详细的调试信息（仅开发环境）
- **INFO**: 关键操作信息（生产环境默认级别）
- **WARNING**: 警告信息
- **ERROR**: 错误信息
- **CRITICAL**: 严重错误

## 查看日志

### 方法1：直接查看文件

```bash
# 查看今天的所有日志
tail -f backend/logs/app_$(date +%Y%m%d).log

# 查看最近的错误
grep ERROR backend/logs/app_*.log

# 查看特定用户的操作
grep "user_id=6" backend/logs/app_*.log

# 查看今天创建简历的记录
grep "创建简历" backend/logs/app_$(date +%Y%m%d).log
```

### 方法2：查看后端服务输出

如果使用 systemd 或直接运行，日志会同时输出到控制台：

```bash
# 查看实时日志（控制台）
tail -f /tmp/uvicorn.log

# 或使用 journalctl（systemd）
sudo journalctl -u resume-api -f
```

## 记录的关键操作

### 启动/关闭
- 应用启动
- 应用关闭

### 认证
- 用户注册
- 用户登录
- Token 刷新

### 简历操作
- **创建简历**: 记录 user_id, title, template_id
- **获取列表**: 记录 user_id, email, count
- **获取详情**: 通过依赖注入自动记录
- **更新简历**: 记录 resume_id, user_id, title
- **删除简历**: 记录 resume_id, user_id, title
- **复制简历**: 记录 original_id, new_id, user_id, title

### 错误记录
所有操作都有 try-catch，错误时记录：
- 操作类型
- 用户信息
- 错误详情
- 堆栈信息（exc_info=True）

## 日志示例

```
2026-02-21 17:56:59 - app.routes.resumes - INFO - 创建简历: user_id=6, title=测试简历, template=modern
2026-02-21 17:56:59 - app.routes.resumes - INFO - 简历创建成功: resume_id=8, user_id=6
2026-02-21 17:56:59 - app.routes.resumes - INFO - 获取用户简历列表: user_id=6, email=test@example.com
2026-02-21 17:56:59 - app.routes.resumes - INFO - 成功获取用户简历列表: user_id=6, count=1
2026-02-21 17:56:59 - app.routes.resumes - INFO - 更新简历: resume_id=8, user_id=6, title=测试简历
2026-02-21 17:56:59 - app.routes.resumes - INFO - 简历更新成功: resume_id=8, user_id=6
2026-02-21 17:56:59 - app.routes.resumes - INFO - 复制简历: resume_id=8, user_id=6
2026-02-21 17:56:59 - app.routes.resumes - INFO - 简历复制成功: original_id=8, new_id=9, user_id=6
2026-02-21 17:56:59 - app.routes.resumes - INFO - 删除简历: resume_id=8, user_id=6
2026-02-21 17:56:59 - app.routes.resumes - INFO - 简历删除成功: resume_id=8, user_id=6
```

## 测试日志功能

运行测试脚本验证日志系统：

```bash
cd backend
python test_logging.py
```

测试脚本会：
1. ✅ 注册/登录用户
2. ✅ 创建简历
3. ✅ 获取简历列表
4. ✅ 更新简历
5. ✅ 复制简历
6. ✅ 删除简历
7. ✅ 检查日志文件生成

## 生产环境配置

生产环境的日志配置在 `app/core/config.py` 中设置：

```python
ENVIRONMENT=production  # 日志级别变为 INFO
```

日志会自动：
- 按日期分割（每天一个文件）
- 错误日志单独记录
- 包含时间戳、模块名、级别、详细信息

## 日志轮转（可选）

对于长期运行的生产环境，建议配置日志轮转：

### 方法1：使用 logrotate

创建 `/etc/logrotate.d/resume-api`：

```
/path/to/backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
}
```

### 方法2：在代码中实现

已在 `app/core/logging.py` 中预留了 `RotatingFileHandler` 的位置，可以按需启用。

## 故障排查

### 问题1：日志文件不存在

**原因**：backend 目录没有写权限

**解决**：
```bash
chmod +w backend/logs/
```

### 问题2：日志没有输出

**原因**：日志级别设置过高

**解决**：检查 `.env` 中的 `ENVIRONMENT` 设置，开发环境应使用 `development`

### 问题3：日志文件太大

**原因**：长时间运行未清理

**解决**：
```bash
# 删除7天前的日志
find backend/logs/ -name "*.log" -mtime +7 -delete
```

## 下一步优化

- [ ] 添加日志统计分析
- [ ] 集成 Sentry 等错误追踪服务
- [ ] 添加慢查询日志
- [ ] 添加 API 请求/响应日志
- [ ] 实现日志告警机制

---

**提示**: 开发时可以使用 `tail -f backend/logs/app_$(date +%Y%m%d).log` 实时查看日志！

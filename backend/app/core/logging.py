"""日志配置模块"""
import logging
import sys
from pathlib import Path
from datetime import datetime
from logging.handlers import RotatingFileHandler


def setup_logging(env: str = "production"):
    """配置日志系统

    Args:
        env: 环境类型 ("development" 或 "production")
    """
    # 创建 logs 目录
    log_dir = Path(__file__).parent.parent.parent / "logs"
    log_dir.mkdir(exist_ok=True)

    # 日志格式
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"

    # 根据环境设置日志级别
    log_level = logging.DEBUG if env == "development" else logging.INFO

    # 配置根日志记录器
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # 清除已有的 handlers
    root_logger.handlers.clear()

    # 创建格式化器
    formatter = logging.Formatter(log_format, datefmt=date_format)

    # 1. 控制台输出（带颜色）
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    # 2. 文件输出（按日期）
    today = datetime.now().strftime("%Y%m%d")
    file_handler = logging.FileHandler(
        log_dir / f"app_{today}.log",
        encoding="utf-8"
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)

    # 3. 错误日志单独文件
    error_handler = logging.FileHandler(
        log_dir / f"error_{today}.log",
        encoding="utf-8"
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    root_logger.addHandler(error_handler)

    # 配置第三方库日志级别
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.INFO)

    root_logger.info(f"日志系统初始化完成 - 环境: {env}, 级别: {logging.getLevelName(log_level)}")


def get_logger(name: str) -> logging.Logger:
    """获取指定名称的日志记录器

    Args:
        name: 日志记录器名称（通常使用 __name__）

    Returns:
        logging.Logger: 日志记录器实例
    """
    return logging.getLogger(name)

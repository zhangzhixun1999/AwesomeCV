#!/usr/bin/env python3
"""
数据库初始化脚本
运行此脚本来创建数据库和表
"""
import sqlite3
import os
from pathlib import Path

# 获取脚本所在目录
BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "resume.db"
SCHEMA_PATH = BASE_DIR / "database" / "schema.sql"


def init_database():
    """初始化数据库"""
    # 如果数据库已存在，先删除
    if DB_PATH.exists():
        print(f"⚠️  数据库已存在: {DB_PATH}")
        response = input("是否删除并重新创建? (y/N): ").strip().lower()
        if response == 'y':
            os.remove(DB_PATH)
            print("✅ 已删除旧数据库")
        else:
            print("❌ 取消初始化")
            return

    # 读取 schema.sql
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    # 创建数据库并执行 schema
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executescript(schema_sql)
        conn.commit()

        # 验证表是否创建成功
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        print("\n✅ 数据库初始化成功!")
        print(f"📁 位置: {DB_PATH}")
        print(f"📊 表: {[t[0] for t in tables]}")

        # 显示表结构
        for table in tables:
            table_name = table[0]
            print(f"\n--- {table_name} ---")
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            for col in columns:
                print(f"  {col[1]}: {col[2]} {'(PK)' if col[5] else ''}")

    except Exception as e:
        print(f"❌ 初始化失败: {e}")
        conn.rollback()
    finally:
        conn.close()


if __name__ == "__main__":
    init_database()

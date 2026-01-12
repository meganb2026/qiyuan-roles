#!/bin/bash

# Twine 游戏构建脚本
# 此脚本将所有 .twee 源文件合并成一个完整的 .twee 文件
# 然后可以使用 Twine 编辑器导入并编译成 game.html

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
OUTPUT_DIR="$PROJECT_ROOT"
TEMP_TWEE="$OUTPUT_DIR/game.twee"

echo -e "${GREEN}开始构建 Twine 游戏...${NC}"

# 检查源目录是否存在
if [ ! -d "$SRC_DIR" ]; then
    echo -e "${RED}错误: 源目录 $SRC_DIR 不存在！${NC}"
    exit 1
fi

# 创建临时合并文件
echo -e "${YELLOW}合并 .twee 文件...${NC}"

# 清空或创建临时文件
> "$TEMP_TWEE"

# 按照特定顺序合并文件（确保核心文件在前）
# 1. 核心文件
if [ -f "$SRC_DIR/core/variables.twee" ]; then
    echo "合并: core/variables.twee"
    cat "$SRC_DIR/core/variables.twee" >> "$TEMP_TWEE"
    echo "" >> "$TEMP_TWEE"
fi

if [ -f "$SRC_DIR/core/macros.twee" ]; then
    echo "合并: core/macros.twee"
    cat "$SRC_DIR/core/macros.twee" >> "$TEMP_TWEE"
    echo "" >> "$TEMP_TWEE"
fi

# 2. 样式文件（如果有）
if [ -f "$SRC_DIR/core/styles.css" ]; then
    echo "合并: core/styles.css"
    echo ":: stylesheet [stylesheet]" >> "$TEMP_TWEE"
    cat "$SRC_DIR/core/styles.css" >> "$TEMP_TWEE"
    echo "" >> "$TEMP_TWEE"
fi

# 3. 资源文件
echo "合并: assets/*.twee"
find "$SRC_DIR/assets" -name "*.twee" -type f | sort | while read -r file; do
    echo "  合并: $(basename "$file")"
    cat "$file" >> "$TEMP_TWEE"
    echo "" >> "$TEMP_TWEE"
done

# 4. 章节文件
echo "合并: chapters/*.twee"
find "$SRC_DIR/chapters" -name "*.twee" -type f | sort | while read -r file; do
    echo "  合并: $(basename "$file")"
    cat "$file" >> "$TEMP_TWEE"
    echo "" >> "$TEMP_TWEE"
done

echo -e "${GREEN}✓ 所有文件已合并到: $TEMP_TWEE${NC}"

# 检查是否有 Twine 命令行工具
if command -v tweego &> /dev/null; then
    echo -e "${YELLOW}检测到 Tweego，编译游戏...${NC}"

    # 使用 tweego 编译 (SugarCube格式)
    tweego -f sugarcube-2 -o "$OUTPUT_DIR/game.html" "$TEMP_TWEE"

    if [ -f "$OUTPUT_DIR/game.html" ]; then
        echo -e "${GREEN}✓ 游戏已成功编译到: $OUTPUT_DIR/game.html${NC}"
        echo -e "${GREEN}文件大小: $(stat -f%z "$OUTPUT_DIR/game.html" 2>/dev/null || stat -c%s "$OUTPUT_DIR/game.html" 2>/dev/null || echo "未知") 字节${NC}"
        # 清理临时文件
        rm -f "$TEMP_TWEE"
    else
        echo -e "${RED}错误: 编译失败，未生成 game.html${NC}"
        exit 1
    fi
elif command -v twee &> /dev/null; then
    echo -e "${YELLOW}检测到 Twine 命令行工具，尝试编译...${NC}"

    # 使用 twee 编译
    twee "$TEMP_TWEE" "$OUTPUT_DIR/game.html" 2>&1 || {
        echo -e "${RED}错误: Twine 编译失败${NC}"
        exit 1
    }

    if [ -f "$OUTPUT_DIR/game.html" ]; then
        echo -e "${GREEN}✓ 游戏已成功编译到: $OUTPUT_DIR/game.html${NC}"
        # 清理临时文件
        rm -f "$TEMP_TWEE"
    fi
else
    echo -e "${RED}错误: 未检测到 Twine 编译器 (tweego 或 twee)${NC}"
    echo -e "${YELLOW}请手动编译：${NC}"
    echo "  1. 下载 Tweego: https://www.motoslave.net/tweego/"
    echo "  2. 运行: tweego -f sugarcube-2 -o game.html game.twee"
    echo ""
    echo -e "${GREEN}合并的 .twee 文件已保存到: $TEMP_TWEE${NC}"
    exit 1
fi

echo -e "${GREEN}构建完成！${NC}"

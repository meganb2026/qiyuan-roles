#!/bin/bash

# 为每个物品创建详情页

items=("皇冠" "珍珠通关信物" "金钱" "中草药" "安眠药" "潜水装备" "骰子" "画具" "地下系统设计图" "皇宫地面部分设计图" "导师手记" "皇宫地图" "周报")

for item in "${items[@]}"; do
    filename="items/item-${item}.html"

    # 复制模板
    cp item-template.html "$filename"

    echo "Created $filename"
done

echo "All item detail pages created!"
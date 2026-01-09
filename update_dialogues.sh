#!/bin/bash

# 更新所有对话文件的跳转路径

characters=("claudius" "chengying" "hefei" "lixiang" "wuzhizhe" "wangweiguo")

for char1 in "${characters[@]}"; do
    for char2 in "${characters[@]}"; do
        if [ "$char1" != "$char2" ]; then
            filename="dialogues/dialogue-${char1}-${char2}.html"

            if [ -f "$filename" ]; then
                # 更新跳转路径
                sed -i '' 's|game.html?character=|../exchanges/exchange-items.html?character=|g' "$filename"
                echo "Updated $filename"
            fi
        fi
    done
done

echo "All dialogue files updated!"
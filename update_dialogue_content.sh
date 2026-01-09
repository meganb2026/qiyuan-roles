#!/bin/bash

# 批量更新所有对话文件的内容为通用对话

for file in dialogues/*.html; do
    # 使用perl进行更精确的替换
    # 替换visitor-bubble内部的内容
    perl -i -pe 'BEGIN{undef $/;} s|<div class="dialogue-bubble visitor-bubble">.*?</div>|<div class="dialogue-bubble visitor-bubble">
                        <p>编一点对话</p>
                        <p>编一点对话</p>
                        <p>编一点对话</p>
                    </div>|sg' "$file"

    # 替换host-bubble内部的内容
    perl -i -pe 'BEGIN{undef $/;} s|<div class="dialogue-bubble host-bubble">.*?</div>|<div class="dialogue-bubble host-bubble">
                        <p>编一点对话</p>
                        <p>编一点对话</p>
                        <p>编一点对话</p>
                    </div>|sg' "$file"

    echo "Updated $file"
done

echo "All dialogue contents updated!"
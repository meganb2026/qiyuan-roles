#!/bin/bash

# 批量修复所有对话文件

for file in dialogues/*.html; do
    echo "Fixing $file..."

    # 替换重复的对话行
    sed -i '' 's|<p>编一点对话</p>$|<p>编一点对话</p>|g' "$file"
    sed -i '' '/<p>编一点对话<\/p>$/N;/\n<p>编一点对话<\/p>$/d' "$file"

    # 确保只有一行对话
    perl -i -pe 'BEGIN{undef $/;} s|<div class="dialogue-bubble (?:visitor-bubble|host-bubble)">\s*<p>编一点对话<\/p>\s*<p>编一点对话<\/p>\s*<p>编一点对话<\/p>\s*</div>|<div class="dialogue-bubble \1">\n                        <p>编一点对话</p>\n                    </div>|sg' "$file"
done

echo "All dialogue files fixed!"
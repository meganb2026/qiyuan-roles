#!/bin/bash

# 生成所有对话文件

characters=("claudius" "chengying" "hefei" "lixiang" "wuzhizhe" "wangweiguo")
character_names=("克劳狄斯" "程婴" "何非" "李想" "吴智哲" "王卫国")
character_emojis=("👑" "⚕️" "🎭" "🔧" "📐" "🚛")

for i in "${!characters[@]}"; do
    char1="${characters[$i]}"
    char1_name="${character_names[$i]}"
    char1_emoji="${character_emojis[$i]}"

    for j in "${!characters[@]}"; do
        char2="${characters[$j]}"
        char2_name="${character_names[$j]}"
        char2_emoji="${character_emojis[$j]}"

        if [ "$char1" != "$char2" ]; then
            filename="dialogues/dialogue-${char1}-${char2}.html"

            # 复制模板
            cp dialogue_template.html "$filename"

            # 替换标题
            sed -i '' "s|<title>对话页面</title>|<title>${char1_name}拜访${char2_name}</title>|g" "$filename"
            sed -i '' "s|<h2>对话标题</h2>|<h2>${char1_name}拜访${char2_name}</h2>|g" "$filename"

            # 替换访客信息
            sed -i '' "s|<div class=\"portrait-circle\">👑</div>|<div class=\"portrait-circle\">${char1_emoji}</div>|g" "$filename"
            sed -i '' "s|<div class=\"character-name\">访客</div>|<div class=\"character-name\">${char1_name}</div>|g" "$filename"

            # 替换主人信息
            sed -i '' "s|<div class=\"portrait-circle\">⚕️</div>|<div class=\"portrait-circle\">${char2_emoji}</div>|g" "$filename"
            sed -i '' "s|<div class=\"character-name\">主人</div>|<div class=\"character-name\">${char2_name}</div>|g" "$filename"

            echo "Generated $filename"
        fi
    done
done

echo "All dialogue files generated!"
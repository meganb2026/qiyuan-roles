#!/bin/bash

# 简单更新对话内容

characters=("claudius" "chengying" "hefei" "lixiang" "wuzhizhe" "wangweiguo")
character_names=("克劳狄斯" "程婴" "何非" "李想" "吴智哲" "王卫国")
character_titles=("国王" "御医" "潜水教练" "下水道工程师" "建筑设计师" "运输队长")
character_emojis=("👑" "⚕️" "🎭" "🔧" "📐" "🚛")

for i in "${!characters[@]}"; do
    char1="${characters[$i]}"
    char1_name="${character_names[$i]}"
    char1_title="${character_titles[$i]}"
    char1_emoji="${character_emojis[$i]}"

    for j in "${!characters[@]}"; do
        char2="${characters[$j]}"
        char2_name="${character_names[$j]}"
        char2_title="${character_titles[$j]}"
        char2_emoji="${character_emojis[$j]}"

        if [ "$char1" != "$char2" ]; then
            filename="dialogues/dialogue-${char1}-${char2}.html"

            if [ -f "$filename" ]; then
                # 替换标题
                sed -i '' "s|<title>.*</title>|<title>${char1_name}拜访${char2_name}</title>|g" "$filename"

                # 替换页面标题
                sed -i '' "s|<h2>.*</h2>|<h2>${char1_name}拜访${char2_name}</h2>|g" "$filename"

                echo "Updated $filename"
            fi
        fi
    done
done

echo "All dialogue titles updated!"
#!/bin/bash

# 更新对话内容为更自然的对话形式

characters=("claudius" "chengying" "hefei" "lixiang" "wuzhizhe" "wangweiguo")
character_names=("克劳狄斯" "程婴" "何非" "李想" "吴智哲" "王卫国")

# 通用对话模板
generic_dialogue() {
    local visitor="$1"
    local host="$2"
    local visitor_name="$3"
    local host_name="$4"

    cat << EOF
                <div class="dialogue-scene">
                    <p class="scene-description">皇宫内，${visitor_name}前来拜访${host_name}。</p>
                </div>

                <div class="dialogue-section">
                    <div class="character-portrait visitor">
                        <div class="portrait-circle">${visitor_name:0:1}</div>
                        <div class="character-name">${visitor_name}</div>
                    </div>

                    <div class="dialogue-bubble visitor-bubble">
                        <p>你好，最近怎么样？</p>
                        <p>我想和你聊聊宫里的情况。</p>
                        <p>听说最近出了不少事情。</p>
                    </div>
                </div>

                <div class="dialogue-section">
                    <div class="character-portrait host">
                        <div class="portrait-circle">${host_name:0:1}</div>
                        <div class="character-name">${host_name}</div>
                    </div>

                    <div class="dialogue-bubble host-bubble">
                        <p>还好，你想知道什么？</p>
                        <p>宫里确实不太平。</p>
                        <p>我可以告诉你一些内情。</p>
                    </div>
                </div>

                <div class="dialogue-section">
                    <div class="character-portrait visitor">
                        <div class="portrait-circle">${visitor_name:0:1}</div>
                        <div class="character-name">${visitor_name}</div>
                    </div>

                    <div class="dialogue-bubble visitor-bubble">
                        <p>谢谢你的信息。</p>
                        <p>这对我很有帮助。</p>
                        <p>我们保持联系。</p>
                    </div>
                </div>

                <div class="dialogue-section">
                    <div class="character-portrait host">
                        <div class="portrait-circle">${host_name:0:1}</div>
                        <div class="character-name">${host_name}</div>
                    </div>

                    <div class="dialogue-bubble host-bubble">
                        <p>不客气。</p>
                        <p>小心行事。</p>
                        <p>宫里水深。</p>
                    </div>
                </div>

                <div class="dialogue-actions">
                    <button class="action-btn primary large" onclick="proceedToExchange()">
                        交换物品
                    </button>
                </div>
EOF
}

# 更新所有对话文件
for i in "${!characters[@]}"; do
    char1="${characters[$i]}"
    char1_name="${character_names[$i]}"

    for j in "${!characters[@]}"; do
        char2="${characters[$j]}"
        char2_name="${character_names[$j]}"

        if [ "$char1" != "$char2" ]; then
            filename="dialogues/dialogue-${char1}-${char2}.html"

            if [ -f "$filename" ]; then
                # 替换对话内容
                # 这里使用sed来替换dialogue-container的内容
                # 先找到dialogue-container的开始和结束
                temp_content=$(generic_dialogue "$char1" "$char2" "$char1_name" "$char2_name")

                # 使用awk来替换内容
                awk -v new_content="$temp_content" '
                BEGIN { in_container = 0; printed = 0 }
                /<div class="dialogue-container">/ { in_container = 1; print; next }
                in_container && /<\/div>/ && !printed {
                    print new_content
                    printed = 1
                    in_container = 0
                    next
                }
                !in_container { print }
                ' "$filename" > "${filename}.tmp" && mv "${filename}.tmp" "$filename"

                echo "Updated dialogue content for $filename"
            fi
        fi
    done
done

echo "All dialogue contents updated!"
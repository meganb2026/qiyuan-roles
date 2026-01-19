// 地图功能模块

// 获取当前地点
function getCurrentLocation() {
    // 首先尝试从URL参数获取
    const urlParams = new URLSearchParams(window.location.search);
    let location = urlParams.get('location');
    
    // 如果URL参数中没有，尝试从localStorage获取
    if (!location) {
        location = localStorage.getItem('currentLocation');
    }
    
    // 映射常见地点名称到内部标识符
    const locationMap = {
        'hefei-bedroom': 'bottom-south',
        'beijing-poly-theater': 'bottom-west',
        'wuzhizhe-living-room': 'bottom-east',
        'wangweiguo-dorm': 'bottom-north',
        'chengying-pharmacy': 'top-east',
        'shanghai-cultural-square': 'top-south',
        'claudius-bedroom': 'top-west',
        'lixian-study': 'top-north',
        // 家的页面也映射到对应的地点
        'hefei-home': 'bottom-south',
        'beijing-home': 'bottom-west',
        'wuzhizhe-home': 'bottom-east',
        'wangweiguo-home': 'bottom-north',
        'chengying-home': 'top-east',
        'claudius-home': 'top-west',
        'lixian-home': 'top-north'
    };
    
    return locationMap[location] || null;
}

// 地图面板功能
function toggleMapPanel() {
    const mapPanel = document.getElementById('map-panel');
    const mapOverlay = document.getElementById('map-overlay');
    
    if (mapPanel.style.display === 'block') {
        // 隐藏地图面板
        mapPanel.style.display = 'none';
        mapOverlay.style.display = 'none';
        document.body.style.overflow = '';
    } else {
        // 显示地图面板
        mapPanel.style.display = 'block';
        mapOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 生成立方体地图
        generateCubeMap();
    }
}

// 生成立方体地图
function generateCubeMap() {
    const cubeMapContainer = document.getElementById('cube-map');
    
    // 地点数据
    const locations = {
        'bottom-east': { name: '吴智哲客厅', icon: '🏠' },
        'bottom-south': { name: '何非卧室', icon: '🛏️' },
        'bottom-west': { name: '北京保利剧院', icon: '🎭' },
        'bottom-north': { name: '王卫国宿舍', icon: '📚' },
        'top-east': { name: '程婴药铺', icon: '💊' },
        'top-south': { name: '上海文化广场', icon: '🌆' },
        'top-west': { name: '克劳狄斯寝宫', icon: '👑' },
        'top-north': { name: '李想书房', icon: '📝' }
    };
    
    // 地点相邻关系
    const locationAdjacents = {
        'bottom-east': ['bottom-south', 'bottom-north', 'top-east'], // 吴智哲客厅：何非卧室、王卫国宿舍、程婴药铺
        'bottom-south': ['bottom-east', 'bottom-west', 'top-south'], // 何非卧室：吴智哲客厅、北京保利剧院、上海文化广场
        'bottom-west': ['bottom-south', 'bottom-north', 'top-west'], // 北京保利剧院：何非卧室、王卫国宿舍、克劳狄斯寝宫
        'bottom-north': ['bottom-east', 'bottom-west', 'top-north'], // 王卫国宿舍：吴智哲客厅、北京保利剧院、李想书房
        'top-east': ['top-south', 'top-north', 'bottom-east'], // 程婴药铺：上海文化广场、李想书房、吴智哲客厅
        'top-south': ['top-east', 'top-west', 'bottom-south'], // 上海文化广场：程婴药铺、克劳狄斯寝宫、何非卧室
        'top-west': ['top-south', 'top-north', 'bottom-west'], // 克劳狄斯寝宫：上海文化广场、李想书房、北京保利剧院
        'top-north': ['top-east', 'top-west', 'bottom-north'] // 李想书房：程婴药铺、克劳狄斯寝宫、王卫国宿舍
    };
    
    // 清空容器
    cubeMapContainer.innerHTML = '';
    
    // 创建立方体容器
    const cubeSize = 120; // 设置为120px
    const cubeContainer = document.createElement('div');
    cubeContainer.style.width = `${cubeSize}px`;
    cubeContainer.style.height = `${cubeSize}px`;
    cubeContainer.style.position = 'relative';
    cubeContainer.style.transformStyle = 'preserve-3d';
    
    // 添加手动拖动功能
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationX = 0;
    let rotationY = 0;
    
    // 更新标识的朝向，使其始终面对观众
    function updateLocationOrientation() {
        locationElements.forEach(element => {
            // 应用与立方体相反的旋转，使得标识始终面对观众
            element.style.transform += ` rotateX(${-rotationX}deg) rotateY(${-rotationY}deg)`;
        });
    }
    
    cubeContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
        
        // 更新旋转角度
        rotationY += deltaMove.x * 0.5;
        rotationX += deltaMove.y * 0.5;
        
        // 应用旋转
        cubeContainer.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        
        // 重置标识的transform，然后重新应用位置和朝向
        locationElements.forEach(element => {
            // 保存原始位置信息
            const originalTransform = element.dataset.originalTransform || element.style.transform;
            element.dataset.originalTransform = originalTransform;
            
            // 重新应用位置和朝向
            // 关键：使用CSS的backface-visibility和正确的旋转顺序
            // 先应用位置，然后应用与立方体相反的旋转，确保标识始终面向观众
            element.style.transform = `${originalTransform} rotateY(${-rotationY}deg) rotateX(${-rotationX}deg)`;
            element.style.backfaceVisibility = 'hidden';
            element.style.transformStyle = 'preserve-3d';
        });
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // 触摸设备支持
    cubeContainer.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging || e.touches.length === 0) return;
        
        const deltaMove = { 
            x: e.touches[0].clientX - previousMousePosition.x, 
            y: e.touches[0].clientY - previousMousePosition.y 
        };
        
        // 更新旋转角度
        rotationY += deltaMove.x * 0.5;
        rotationX += deltaMove.y * 0.5;
        
        // 应用旋转
        cubeContainer.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        
        // 重置标识的transform，然后重新应用位置和朝向
        locationElements.forEach(element => {
            // 保存原始位置信息
            const originalTransform = element.dataset.originalTransform || element.style.transform;
            element.dataset.originalTransform = originalTransform;
            
            // 重新应用位置和朝向
            // 关键：使用CSS的backface-visibility和正确的旋转顺序
            // 先应用位置，然后应用与立方体相反的旋转，确保标识始终面向观众
            element.style.transform = `${originalTransform} rotateY(${-rotationY}deg) rotateX(${-rotationX}deg)`;
            element.style.backfaceVisibility = 'hidden';
            element.style.transformStyle = 'preserve-3d';
        });
        
        previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // 创建立方体的各个面
    const cubeFaces = [
        { id: 'front', transform: `translateZ(${cubeSize / 2}px)` },
        { id: 'back', transform: `rotateY(180deg) translateZ(${cubeSize / 2}px)` },
        { id: 'left', transform: `rotateY(-90deg) translateZ(${cubeSize / 2}px)` },
        { id: 'right', transform: `rotateY(90deg) translateZ(${cubeSize / 2}px)` },
        { id: 'top', transform: `rotateX(90deg) translateZ(${cubeSize / 2}px)` },
        { id: 'bottom', transform: `rotateX(-90deg) translateZ(${cubeSize / 2}px)` }
    ];
    
    cubeFaces.forEach(face => {
        const faceElement = document.createElement('div');
        faceElement.id = face.id;
        faceElement.style.width = `${cubeSize}px`;
        faceElement.style.height = `${cubeSize}px`;
        faceElement.style.position = 'absolute';
        faceElement.style.transform = face.transform;
        faceElement.style.background = 'rgba(102, 126, 234, 0.1)';
        faceElement.style.border = '2px solid rgba(102, 126, 234, 0.3)';
        faceElement.style.display = 'flex';
        faceElement.style.flexWrap = 'wrap';
        faceElement.style.justifyContent = 'center';
        faceElement.style.alignItems = 'center';
        cubeContainer.appendChild(faceElement);
    });
    
    // 创建地点标记
    const locationElements = [];
    
    // 立方体顶点位置（相对于立方体中心）
    const vertices = [
        // 底部四个顶点
        { x: 1, y: -1, z: 1, loc: 'bottom-east' },    // 底部前面右侧
        { x: -1, y: -1, z: 1, loc: 'bottom-south' },   // 底部前面左侧
        { x: -1, y: -1, z: -1, loc: 'bottom-west' },  // 底部后面左侧
        { x: 1, y: -1, z: -1, loc: 'bottom-north' },  // 底部后面右侧
        // 顶部四个顶点
        { x: 1, y: 1, z: 1, loc: 'top-east' },        // 顶部前面右侧
        { x: -1, y: 1, z: 1, loc: 'top-south' },     // 顶部前面左侧
        { x: -1, y: 1, z: -1, loc: 'top-west' },      // 顶部后面左侧
        { x: 1, y: 1, z: -1, loc: 'top-north' }       // 顶部后面右侧
    ];
    
    // 为每个顶点创建地点标记
    vertices.forEach(vertex => {
        const locationElement = createLocationMarker(locations[vertex.loc]);
        locationElement.style.position = 'absolute';
        
        // 计算实际位置（立方体边长120px，中心点在(0,0,0)）
        const scale = cubeSize / 2; // 立方体半径
        let x = vertex.x * scale;
        let y = vertex.y * scale;
        let z = vertex.z * scale;
        
        // 为不同地点的标识添加位置偏移
        if (vertex.loc === 'bottom-east') {
            // 吴智哲客厅
            x += 65;
            y += 5;
            z += 25;
        } else if (vertex.loc === 'bottom-north') {
           // 王卫国宿舍
           x += 65;
           y += 5;
           z -= 25;
        }else if (vertex.loc === 'bottom-south') {
            //何非
            x += 5;
            y += 5;
            z += 25;
        } else if (vertex.loc === 'bottom-west') {
            //北保
            x += 5;
            y += 5;
            z -= 25;
        } else if (vertex.loc === 'top-east') {
            // 程婴药铺
            x += 65;
            y += 65;
            z += 25;
        } else if (vertex.loc === 'top-north') {
            // 李想书房
            x += 65;
            y += 65;
            z -= 25;
        } else if (vertex.loc === 'top-south') {
            // 上海文化广场
            y += 65;
            z += 25;
        } else if (vertex.loc === 'top-west') {
            // 克劳狄斯寝宫
            y += 65;
            z -= 25;
        }
        
        const transformValue = `translateX(${x}px) translateY(${y}px) translateZ(${z}px)`;
        locationElement.style.transform = transformValue;
        locationElement.dataset.originalTransform = transformValue; // 保存原始位置信息
        locationElements.push(locationElement);
    });
    
    // 添加地点元素到容器
    locationElements.forEach(element => {
        cubeContainer.appendChild(element);
    });
    
    // 绘制立方体的边
    drawEdges(cubeContainer, cubeSize, vertices);
    
    // 添加立方体到地图容器
    cubeMapContainer.appendChild(cubeContainer);
}
// 绘制立方体的边
function drawEdges(container, cubeSize, vertices) {
    // 边的颜色
    const edgeColor = 'rgba(102, 126, 234, 0.8)'; // 蓝色
    
    // 边的粗细
    const edgeThickness = '4px';
    
    // 立方体中心到顶点的距离
    const halfSize = cubeSize / 2;
    
    // 直接修改立方体的各个面，为它们添加边框
    // 这样可以确保边与立方体完全贴合
    
    // 获取立方体的所有面元素
    const faceElements = container.querySelectorAll('div[style*="transform: translateZ"]');
    
    // 为每个面添加边框
    faceElements.forEach(face => {
        face.style.border = `${edgeThickness}px solid ${edgeColor}`;
        face.style.background = 'rgba(102, 126, 234, 0.05)';
    });
}

// 创建地点标记
function createLocationMarker(location) {
    const marker = document.createElement('div');
    marker.style.width = '40px'; // 调整标记尺寸以匹配120px的立方体
    marker.style.height = '40px';
    marker.style.background = 'rgba(255, 255, 255, 0.9)';
    marker.style.border = '1px solid #667eea';
    marker.style.borderRadius = '6px';
    marker.style.padding = '6px';
    marker.style.display = 'flex';
    marker.style.flexDirection = 'column';
    marker.style.alignItems = 'center';
    marker.style.justifyContent = 'center';
    marker.style.cursor = 'pointer';
    marker.style.transition = 'all 0.3s ease';
    marker.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.2)';
    
    marker.innerHTML = `
        <div style="font-size: 16px; margin-bottom: 2px;">${location.icon}</div>
        <div style="font-size: 6px; text-align: center; color: #666;">${location.name}</div>
    `;
    
    // 保存原始位置变换
    let originalTransform = '';
    
    // 添加悬停效果
    marker.addEventListener('mouseenter', function() {
        // 保存原始变换
        originalTransform = this.style.transform;
        // 保持原始位置并添加缩放
        this.style.transform = `${originalTransform} scale(1.1)`;
        this.style.boxShadow = '0 6px 15px rgba(102, 126, 234, 0.4)';
    });
    
    marker.addEventListener('mouseleave', function() {
        // 恢复原始变换
        this.style.transform = originalTransform;
        this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    });
    
    return marker;
}

// 导出函数给全局使用
window.toggleMapPanel = toggleMapPanel;
window.generateCubeMap = generateCubeMap;
window.createLocationMarker = createLocationMarker;
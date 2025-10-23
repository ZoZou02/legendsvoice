// 实现header的视差效果和设备倾斜感应
function initParallaxEffects() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    // 鼠标移动视差效果
    header.addEventListener('mousemove', function(e) {
        // 获取鼠标在header中的位置
        const rect = header.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算移动比例（减小移动范围，使效果更加适中）
        const moveX = ((x / rect.width) - 0.5) * 50;
        const moveY = ((y / rect.height) - 0.5) * 50;
        
        // 设置背景位置移动
        header.style.setProperty('--bg-position-x', `${50 + moveX}%`);
        header.style.setProperty('--bg-position-y', `${50 + moveY}%`);
    });
    
    // 鼠标离开时恢复原位
    header.addEventListener('mouseleave', function() {
        header.style.setProperty('--bg-position-x', '50%');
        header.style.setProperty('--bg-position-y', '50%');
    });
    
    // 检查是否支持设备倾斜感应 - 添加校准提示
    if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        // iOS需要用户授权
        header.addEventListener('click', function requestDeviceMotionPermission() {
            window.DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        enableDeviceMotion();
                    }
                })
                .catch(err => {
                    console.log('无法获取设备运动权限:', err);
                });
            
            // 只请求一次授权
            header.removeEventListener('click', requestDeviceMotionPermission);
        });
    } else if (window.DeviceMotionEvent) {
        // 非iOS设备直接启用
        enableDeviceMotion();
    }
    
    // 启用设备倾斜感应 - 添加初始角度校准
    function enableDeviceMotion() {
        let initialTiltX = null;
        let initialTiltY = null;
        let calibrationTimeout = null;
        
        window.addEventListener('devicemotion', function(e) {
            if (e.accelerationIncludingGravity) {
                // 第一次触发时校准初始角度，或者用户重置时
                if (initialTiltX === null && initialTiltY === null) {
                    // 记录初始角度，作为基准位置
                    initialTiltX = e.accelerationIncludingGravity.x;
                    initialTiltY = e.accelerationIncludingGravity.y;
                    
                    // 清除校准超时（如果有的话）
                    if (calibrationTimeout) {
                        clearTimeout(calibrationTimeout);
                    }
                    
                    // 30秒后自动重新校准，适应不同的手持姿势
                    calibrationTimeout = setTimeout(() => {
                        initialTiltX = null;
                        initialTiltY = null;
                    }, 30000);
                }
                
                // 计算相对于初始角度的倾斜差值
                const relativeTiltX = e.accelerationIncludingGravity.x - initialTiltX;
                const relativeTiltY = e.accelerationIncludingGravity.y - initialTiltY;
                
                // 限制差值范围，避免极端情况
                const tiltX = Math.min(Math.max(relativeTiltX, -5), 5);
                const tiltY = Math.min(Math.max(relativeTiltY, -5), 5);
                
                // 计算背景移动（基于相对倾斜变化）
                const moveX = tiltX * 10; // 调整敏感度，基于相对变化
                const moveY = -tiltY * 10; // 反向以获得更自然的效果
                
                // 设置背景位置
                header.style.setProperty('--bg-position-x', `${50 + moveX}%`);
                header.style.setProperty('--bg-position-y', `${50 + moveY}%`);
            }
        });
        
        // 监听点击事件，允许用户手动重新校准
         document.addEventListener('click', () => {
             // 重置初始角度，下次触发时重新校准
             initialTiltX = null;
             initialTiltY = null;
         });
    }
}

// 英雄数据
// backgroundPosition 可选，默认值为 'top'(center bottom)
const heroData = [
    {
        id: 1,
        name: '佐伊',
        color: '#f835fbff',
        icon: 'static/icon/Zoe.png',
        modalConfig: {
            backgroundImage: 'static/icon/skins_Zoe_Splash_0_compressed.jpg',
            gradientColors: ['rgba(171, 54, 221, 0.3)', 'rgba(243, 202, 79, 0.3)'],
            backgroundPosition: 'top'
        },
        voices: [
            { id: 5, text: '他们叫我佐伊', audio: 'static/voice/佐伊/佐伊_5.mp3' },
            { id: 4, text: 'wow这里好多怪人，太棒了！', audio: 'static/voice/佐伊/佐伊_4.mp3' },
            { id: 0, text: '恰恰恰恰恰！', audio: 'static/voice/佐伊/佐伊.mp3' },
            { id: 1, text: '告诉每个人！', audio: 'static/voice/佐伊/佐伊_1.mp3' },
            { id: 13, text: '哇哈哈哈哈！', audio: 'static/voice/佐伊/佐伊_13.mp3' },
            { id: 8, text: '我好厉害啊！', audio: 'static/voice/佐伊/佐伊_8.mp3' },
            { id: 39, text: '冲啊佐伊！', audio: 'static/voice/佐伊/佐伊_39.mp3' },
            { id: 6, text: '你应该高兴得炸毛了吧！', audio: 'static/voice/佐伊/佐伊_6.mp3' },
            { id: 9, text: '要不要玩个游戏，拜托了~', audio: 'static/voice/佐伊/佐伊_9.mp3' },
            { id: 10, text: '交朋友~', audio: 'static/voice/佐伊/佐伊_10.mp3' },
            { id: 25, text: '我想和人聊天和人玩耍~', audio: 'static/voice/佐伊/佐伊_25.mp3' },
            { id: 31, text: '你怎么能...这么可爱呢~', audio: 'static/voice/佐伊/佐伊_31.mp3' },
            { id: 12, text: '喔你这个小笨蛋~', audio: 'static/voice/佐伊/佐伊_12.mp3' },
            { id: 2, text: '大美人儿！', audio: 'static/voice/佐伊/佐伊_2.mp3' },
            { id: 3, text: '你丑丑的！', audio: 'static/voice/佐伊/佐伊_3.mp3' },
            { id: 18, text: '你就是个王八蛋！', audio: 'static/voice/佐伊/佐伊_18.mp3' },
            { id: 21, text: '坏狗狗！', audio: 'static/voice/佐伊/佐伊_21.mp3' },
            { id: 26, text: '真赖！', audio: 'static/voice/佐伊/佐伊_26.mp3' },
            { id: 32, text: '见鬼！', audio: 'static/voice/佐伊/佐伊_32.mp3' },
            { id: 22, text: '难！以！置！信！', audio: 'static/voice/佐伊/佐伊_22.mp3' },
            { id: 11, text: '头好晕~', audio: 'static/voice/佐伊/佐伊_11.mp3' },
            { id: 14, text: '我困了~', audio: 'static/voice/佐伊/佐伊_14.mp3' },
            { id: 34, text: '我头晕了~', audio: 'static/voice/佐伊/佐伊_34.mp3' },
            { id: 37, text: '哎哟！', audio: 'static/voice/佐伊/佐伊_37.mp3' },
            { id: 29, text: '我怎么会...嗷~', audio: 'static/voice/佐伊/佐伊_29.mp3' },
            { id: 16, text: '来吧跳跳~来吧蹦蹦~', audio: 'static/voice/佐伊/佐伊_16.mp3' },
            { id: 20, text: '我要跳起舞来~', audio: 'static/voice/佐伊/佐伊_20.mp3' },
            { id: 19, text: '我就要就要~就要去那那那！', audio: 'static/voice/佐伊/佐伊_19.mp3' },
            { id: 17, text: '我不是在打你', audio: 'static/voice/佐伊/佐伊_17.mp3' },
            { id: 15, text: '嘟嘟嘟嘟嘟', audio: 'static/voice/佐伊/佐伊_15.mp3' },
            { id: 23, text: '啦啦啦噜啦啦啦噜~', audio: 'static/voice/佐伊/佐伊_23.mp3' },
            { id: 24, text: '嘟嘟嘟噜~', audio: 'static/voice/佐伊/佐伊_24.mp3' },
            { id: 28, text: 'Bbox', audio: 'static/voice/佐伊/佐伊_28.mp3' },
            { id: 35, text: 'vio~', audio: 'static/voice/佐伊/佐伊_35.mp3' },
            { id: 36, text: '哗啦啦！', audio: 'static/voice/佐伊/佐伊_36.mp3' },
            { id: 38, text: '他们只会哎哎哎噢噢噢~', audio: 'static/voice/佐伊/佐伊_38.mp3' },
            { id: 7, text: '呃啊啊啊！', audio: 'static/voice/佐伊/佐伊_7.mp3' },
            { id: 33, text: '呃啊啊啊啊~', audio: 'static/voice/佐伊/佐伊_33.mp3' },
            { id: 30, text: '拜拜~', audio: 'static/voice/佐伊/佐伊_30.mp3' },
            { id: 27, text: '事物的变化~', audio: 'static/voice/佐伊/佐伊_27.mp3' },
            { id: 40, text: '...等于零', audio: 'static/voice/佐伊/佐伊_40.mp3' }
        ]
    },
    {   
        id: 2,
        name: '库奇',
        color: '#a09181ff',
        icon: 'static/icon/Corki.png',
        modalConfig: {
            backgroundImage: 'static/icon/skins_Corki_Splash_0_compressed.jpg',
            gradientColors: ['rgba(222, 222, 222, 0.3)', 'rgba(231, 231, 231, 0.3)'],
            backgroundPosition: 'center'
        },
        voices: [
            { id: 1, text: '王牌飞行员申请出战！', audio: 'static/voice/库奇/库奇_1.mp3' },
            { id: 15, text: '随时可以起飞！', audio: 'static/voice/库奇/库奇_15.mp3' },
            { id: 9, text: '大部分人都会打飞机~', audio: 'static/voice/库奇/库奇_9.mp3' },
            { id: 2, text: '十二点钟方向发现敌人！', audio: 'static/voice/库奇/库奇_2.mp3' },
            { id: 5, text: '我的尾部有一名敌军!', audio: 'static/voice/库奇/库奇_5.mp3' },
            { id: 6, text: '开始投弹！', audio: 'static/voice/库奇/库奇_6.mp3' },
            { id: 11, text: '咦嘻嘻~我正在追尾！', audio: 'static/voice/库奇/库奇_11.mp3' },
            { id: 17, text: '呼叫地面控制！', audio: 'static/voice/库奇/库奇_17.mp3' },
            { id: 12, text: '激情在燃烧！', audio: 'static/voice/库奇/库奇_12.mp3' },
            { id: 13, text: '打得漂亮！', audio: 'static/voice/库奇/库奇_13.mp3' },
            { id: 14, text: '飙到极限啦！', audio: 'static/voice/库奇/库奇_14.mp3' },
            { id: 16, text: '嚯哦！', audio: 'static/voice/库奇/库奇_16.mp3' },
            { id: 10, text: '嘻嘻哈哈', audio: 'static/voice/库奇/库奇_10.mp3' },
            { id: 4, text: '哦！都乱了套了', audio: 'static/voice/库奇/库奇_4.mp3' },
            { id: 8, text: '呃啊啊啊', audio: 'static/voice/库奇/库奇_8.mp3' },
            { id: 7, text: '蜂窝傻瓜', audio: 'static/voice/库奇/库奇_7.mp3' },
            { id: 18, text: '软蛋！', audio: 'static/voice/库奇/库奇_18.mp3' },
            { id: 3, text: '就来~就来~', audio: 'static/voice/库奇/库奇_3.mp3' }
        ]
    },
    {
        id: 3,
        name: '提莫',
        color: '#10b981',
        icon: 'static/icon/Teemo.png',
        modalConfig: {
            backgroundImage: 'static/icon/Teemo_Splash_0_compressed.jpg',
            gradientColors: ['rgba(16, 185, 129, 0.3)', 'rgba(5, 150, 105, 0.3)'],
            backgroundPosition: 'top'
        },
        voices: [
            { id: 8, text: '哈哈哈', audio: 'static/voice/提莫/提莫_9.mp3' },
            { id: 9, text: '呵呵哈哈', audio: 'static/voice/提莫/提莫_8.mp3' },
            { id: 10, text: '呵呵呵哈哈哈', audio: 'static/voice/提莫/提莫_10.mp3' },
            { id: 1, text: '提莫队长正在待命！', audio: 'static/voice/提莫/提莫.mp3' },
            { id: 11, text: '一，二，三，四', audio: 'static/voice/提莫/提莫_1.mp3' },
            { id: 2, text: '是！长官！', audio: 'static/voice/提莫/提莫_2.mp3' },
            { id: 3, text: '我去前面探探路', audio: 'static/voice/提莫/提莫_3.mp3' },
            { id: 4, text: '整装待发~', audio: 'static/voice/提莫/提莫_4.mp3' },
            { id: 5, text: '有情况！', audio: 'static/voice/提莫/提莫_5.mp3' },
            { id: 6, text: '要迅捷！', audio: 'static/voice/提莫/提莫_6.mp3' },
            { id: 7, text: '正在报告~', audio: 'static/voice/提莫/提莫_7.mp3' },
        ]
    },
    {
        id: 4,
        name: '纳尔',
        color: '#fb923c',
        icon: 'static/icon/Gnar.png',
        modalConfig: {
            backgroundImage: 'static/icon/Gnar_Splash_0_compressed.jpg',
            gradientColors: ['rgba(251, 146, 60, 0.3)', 'rgba(254, 240, 138, 0.3)'],
            backgroundPosition: 'center'
        },
        voices: [
            { id: 1, text: '纳尔大大~', audio: 'static/voice/纳尔/纳尔.mp3' },
            { id: 2, text: '咻咻啪啦！', audio: 'static/voice/纳尔/纳尔_1.mp3' },
            { id: 3, text: '唰嘟叭啦！', audio: 'static/voice/纳尔/纳尔_2.mp3' },
            { id: 4, text: '咻gi咻gi~', audio: 'static/voice/纳尔/纳尔_3.mp3' }
        ]
    },
    {
        id: 5,
        name: '德莱厄斯',
        color: '#92400e',
        icon: 'static/icon/Darius.png',
        modalConfig: {
            backgroundImage: 'static/icon/Darius_Splash_15_compressed.jpg',
            gradientColors: ['rgba(146, 64, 14, 0.3)', 'rgba(234, 88, 12, 0.3)'],
            backgroundPosition: 'top'
        },
        voices: [
            { id: 10, text: '【神王】我就是席卷人间的巨浪！', audio: 'static/voice/德莱厄斯/德莱厄斯_25.mp3' },
            { id: 1, text: '【神王】我闻到了血腥！', audio: 'static/voice/德莱厄斯/德莱厄斯_8.mp3' },
            { id: 2, text: '【神王】挣扎，流血，绝不示弱！', audio: 'static/voice/德莱厄斯/德莱厄斯_6.mp3' },
            { id: 3, text: '【神王】以血还血！', audio: 'static/voice/德莱厄斯/德莱厄斯_26.mp3' },
            { id: 4, text: '【神王】在此终结！', audio: 'static/voice/德莱厄斯/德莱厄斯_22.mp3' },
            { id: 5, text: '【神王】就死在这！', audio: 'static/voice/德莱厄斯/德莱厄斯_28.mp3' },
            { id: 6, text: '【神王】四分五裂', audio: 'static/voice/德莱厄斯/德莱厄斯_30.mp3' },
            { id: 7, text: '【神王】浩劫降临！', audio: 'static/voice/德莱厄斯/德莱厄斯_29.mp3' },
            { id: 8, text: '【神王】我赢了，你输了', audio: 'static/voice/德莱厄斯/德莱厄斯_27.mp3' },
            { id: 9, text: '【神王】我的力量必将彰显！', audio: 'static/voice/德莱厄斯/德莱厄斯_21.mp3' },
            { id: 11, text: '【神王】还有谁？！', audio: 'static/voice/德莱厄斯/德莱厄斯_34.mp3' },
            { id: 12, text: '【神王】面对我！', audio: 'static/voice/德莱厄斯/德莱厄斯_35.mp3' },
            { id: 13, text: '【神王】旗鼓相当的对手...', audio: 'static/voice/德莱厄斯/德莱厄斯_31.mp3' },
            { id: 14, text: '【神王】我们处于下风...', audio: 'static/voice/德莱厄斯/德莱厄斯_33.mp3' },
            { id: 15, text: '【神王】待宰的羔羊！', audio: 'static/voice/德莱厄斯/德莱厄斯_13.mp3' },
            { id: 16, text: '【神王】你的脑袋要归我了！', audio: 'static/voice/德莱厄斯/德莱厄斯_14.mp3' },
            { id: 17, text: '【神王】我许你自由，在你死后！', audio: 'static/voice/德莱厄斯/德莱厄斯_15.mp3' },
            { id: 18, text: '【神王】你的头颅会在我手...', audio: 'static/voice/德莱厄斯/德莱厄斯_17.mp3' },
            { id: 19, text: '【神王】反抗者，死！', audio: 'static/voice/德莱厄斯/德莱厄斯_18.mp3' },
            { id: 20, text: '【神王】你想去哪儿？！', audio: 'static/voice/德莱厄斯/德莱厄斯_19.mp3' },
            { id: 21, text: '【神王】你太没劲了！', audio: 'static/voice/德莱厄斯/德莱厄斯_23.mp3' },
            { id: 22, text: '【神王】面对我！暴君！', audio: 'static/voice/德莱厄斯/德莱厄斯_9.mp3' },
            { id: 23, text: '【神王】可悲啊', audio: 'static/voice/德莱厄斯/德莱厄斯_11.mp3' },
            { id: 24, text: '【神王】众神的时代已经终结，你也一样', audio: 'static/voice/德莱厄斯/德莱厄斯_4.mp3' },
            { id: 25, text: '【神王】旧秩序必被侵袭！', audio: 'static/voice/德莱厄斯/德莱厄斯_12.mp3' },
            { id: 26, text: '【神王】国王之死，经我之手！', audio: 'static/voice/德莱厄斯/德莱厄斯_20.mp3' },
            { id: 27, text: '【神王】我的狼群渴望皇室的鲜血！', audio: 'static/voice/德莱厄斯/德莱厄斯_16.mp3' },
            { id: 28, text: '【神王】抓住心中的野兽...', audio: 'static/voice/德莱厄斯/德莱厄斯_3.mp3' },
            { id: 29, text: '【神王】狼群已经到你门口了', audio: 'static/voice/德莱厄斯/德莱厄斯_1.mp3' },
            { id: 30, text: '【神王】谁敢否定！', audio: 'static/voice/德莱厄斯/德莱厄斯_7.mp3' },
            { id: 31, text: '【神王】自由也好，自治也罢...', audio: 'static/voice/德莱厄斯/德莱厄斯_32.mp3' },
            { id: 32, text: '【神王】这算什么', audio: 'static/voice/德莱厄斯/德莱厄斯_2.mp3' },
            { id: 33, text: '【神王】有点痒痒', audio: 'static/voice/德莱厄斯/德莱厄斯_24.mp3' },
            { id: 34, text: '【神王】神王一死...', audio: 'static/voice/德莱厄斯/德莱厄斯_36.mp3' },
            { id: 35, text: '【神王】呵哈哈哈哈哈~', audio: 'static/voice/德莱厄斯/德莱厄斯.mp3' },
            { id: 36, text: '【神王】哈哈哈...', audio: 'static/voice/德莱厄斯/德莱厄斯_5.mp3' },
            { id: 37, text: '【神王】呵哈哈...', audio: 'static/voice/德莱厄斯/德莱厄斯_10.mp3' }
        ]
    },
    {
        id: 6,
        name: '慎',
        color: '#3b82f6',
        icon: 'static/icon/Shen.png',
        modalConfig: {
            backgroundImage: 'static/icon/Shen_Splash_0_compressed.jpg',
            gradientColors: ['rgba(59, 130, 246, 0.3)', 'rgba(14, 165, 233, 0.3)'],
            backgroundPosition: 'top'
        },
        voices: [
            { id: 7, text: '我们意念合一', audio: 'static/voice/慎/慎_6.mp3' },
            { id: 1, text: '执行均衡之令', audio: 'static/voice/慎/慎.mp3' },
            { id: 3, text: '看我的吧', audio: 'static/voice/慎/慎_2.mp3' },
            { id: 4, text: '目标已被标记', audio: 'static/voice/慎/慎_3.mp3' },
            { id: 5, text: '再加把劲儿', audio: 'static/voice/慎/慎_4.mp3' },
            { id: 6, text: '你已经死了...', audio: 'static/voice/慎/慎_5.mp3' },
            { id: 9, text: '步伐要平衡', audio: 'static/voice/慎/慎_8.mp3' },
            { id: 11, text: '非常荣幸', audio: 'static/voice/慎/慎_10.mp3' },
            { id: 12, text: '我发现他们不值一提！', audio: 'static/voice/慎/慎_11.mp3' },
            { id: 13, text: '如果光有那么快...', audio: 'static/voice/慎/慎_12.mp3' },
            { id: 14, text: '要步步为营', audio: 'static/voice/慎/慎_13.mp3' },
            { id: 15, text: '没得商量', audio: 'static/voice/慎/慎_14.mp3' },
            { id: 16, text: '那我出发了', audio: 'static/voice/慎/慎_15.mp3' },
            { id: 17, text: '利用好阴影', audio: 'static/voice/慎/慎_16.mp3' },
            { id: 10, text: '（笑）', audio: 'static/voice/慎/慎_9.mp3' },
            { id: 2, text: 'zo~', audio: 'static/voice/慎/慎_1.mp3' },
            { id: 8, text: 'kai~ya~', audio: 'static/voice/慎/慎_7.mp3' }
        ]
    }
];

// 初始化页面
function init() {
    const heroGrid = document.getElementById('heroGrid');
    
    // 清空网格
    heroGrid.innerHTML = '';
    
    // 动态生成英雄头像网格
    heroData.forEach(hero => {
        const heroAvatar = document.createElement('div');
        heroAvatar.className = 'hero-avatar';
        heroAvatar.dataset.heroId = hero.id;
        // 根据英雄颜色设置边框
        heroAvatar.style.borderColor = hero.color;
        
        // 检查英雄是否有头像图片
        const hasIcon = hero.icon && hero.icon.trim() !== '';
        
        // 生成英雄头像内容
          heroAvatar.innerHTML = `
              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: ${hero.color};">
                  ${hasIcon ? `<img src="${hero.icon}" alt="${hero.name}" class="hero-image">` : `<span style="font-size: 3rem; font-weight: bold; color: white;">${hero.name.charAt(0)}</span>`}
              </div>
              <div class="hero-name-overlay">
                  <h3>${hero.name}</h3>
              </div>
          `;
        
        // 添加到网格
        heroGrid.appendChild(heroAvatar);
        
        // 绑定点击事件，显示弹窗
        heroAvatar.addEventListener('click', () => {
            showHeroVoiceModal(hero);
        });
    });
    
    // 绑定弹窗关闭按钮事件
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // 点击弹窗外部关闭弹窗
    const modal = document.getElementById('voiceModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 按ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 显示英雄语音弹窗
function showHeroVoiceModal(hero) {
    // 设置弹窗标题
    document.getElementById('modalHeroName').textContent = hero.name;
    
    // 使用英雄数据中的配置设置弹窗背景
    const modalHeader = document.getElementById('modalHeroName').parentElement;
    
    // 重置样式
    modalHeader.style.backgroundImage = '';
    modalHeader.style.backgroundSize = '';
    modalHeader.style.backgroundPosition = '';
    modalHeader.style.backgroundRepeat = '';
    modalHeader.style.background = '';
    
    if (hero.modalConfig && hero.modalConfig.backgroundImage) {
        // 如果英雄配置了背景图片
        const { backgroundImage, gradientColors } = hero.modalConfig;
        const gradient = gradientColors && gradientColors.length > 1 
            ? `linear-gradient(${gradientColors[0]}, ${gradientColors[1]})` 
            : 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))';
        
        modalHeader.style.backgroundImage = `${gradient}, url('${backgroundImage}')`;
        modalHeader.style.backgroundSize = 'cover';
        const backgroundPosition = hero.modalConfig?.backgroundPosition || 'top';
        modalHeader.style.backgroundPosition = backgroundPosition;
        modalHeader.style.backgroundRepeat = 'no-repeat';
    } else {
        // 为其他英雄使用颜色渐变背景
        modalHeader.style.background = `linear-gradient(${hero.color}22, ${hero.color}44)`;
    }
    
    // 清空并填充语音列表
    const voiceListContainer = document.getElementById('modalVoiceList');
    voiceListContainer.innerHTML = '';
    
    hero.voices.forEach(voice => {
        const voiceItem = document.createElement('div');
        voiceItem.className = 'voice-item';
        voiceItem.innerHTML = `<div class="voice-text">${voice.text}</div>`;
        // 添加数据属性用于识别语音
        voiceItem.dataset.heroId = hero.id;
        voiceItem.dataset.voiceId = voice.id;
        
        voiceListContainer.appendChild(voiceItem);
        
        // 绑定整个语音项的点击事件
        voiceItem.addEventListener('click', function() {
            playVoice(this);
        });
    });
    
    // 显示弹窗
    document.getElementById('voiceModal').style.display = 'flex';
    
    // 确保语音列表滚动到顶部
    document.getElementById('modalVoiceList').scrollTop = 0;
    
    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

// 关闭弹窗 - 添加动画效果
function closeModal() {
    const modal = document.getElementById('voiceModal');
    const modalContent = document.querySelector('.modal-content');
    
    // 添加关闭动画类
    modalContent.classList.add('closing');
    
    // 停止当前播放的音频
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    
    // 等待动画完成后再隐藏
    setTimeout(() => {
        // 隐藏模态框
        modal.style.display = 'none';
        // 移除关闭动画类，为下次打开做准备
        modalContent.classList.remove('closing');
        // 恢复页面滚动
        document.body.style.overflow = 'auto';
    }, 100); // 与动画时长保持一致
    
    // 重置所有语音项的播放状态
    document.querySelectorAll('.voice-item').forEach(item => {
        item.classList.remove('playing');
    });
}

// 播放语音
function playVoice(voiceItem) {
    // 获取当前语音项的标识
    const heroId = voiceItem.dataset.heroId;
    const voiceId = voiceItem.dataset.voiceId;
    
    // 检查是否正在播放相同的语音
    const isCurrentlyPlaying = voiceItem.classList.contains('playing');
    
    // 重置所有语音项的播放状态
    document.querySelectorAll('.voice-item').forEach(item => {
        item.classList.remove('playing');
    });
    
    // 停止当前播放的音频（如果有）
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    
    // 如果不是正在播放的语音，或者用户想要重新播放
    if (!isCurrentlyPlaying) {
        // 标记当前语音项为播放中
        voiceItem.classList.add('playing');
        
        // 获取英雄和语音信息
        const hero = heroData.find(h => h.id == heroId);
        const voice = hero?.voices.find(v => v.id == voiceId);
        
        if (voice && voice.audio) {
            // 创建新的Audio对象播放真实音频
            window.currentAudio = new Audio(voice.audio);
            
            window.currentAudio.onended = function() {
                // 音频播放结束后重置状态
                voiceItem.classList.remove('playing');
                window.currentAudio = null;
            };
            
            window.currentAudio.onerror = function() {
                // 处理音频加载错误
                console.error('音频加载失败:', voice.audio);
                voiceItem.classList.remove('playing');
                window.currentAudio = null;
            };
            
            // 开始播放
            window.currentAudio.play().catch(error => {
                console.error('播放失败:', error);
                voiceItem.classList.remove('playing');
                window.currentAudio = null;
            });
        } else {
            // 如果没有音频文件，使用模拟播放
            console.log(`模拟播放英雄语音: ${hero?.name} - ${voice?.text}`);
            
            // 模拟播放结束
            setTimeout(() => {
                voiceItem.classList.remove('playing');
            }, 2000);
        }
    }
}

// 搜索功能（预留）
function searchHeroes(keyword) {
    const heroAvatars = document.querySelectorAll('.hero-avatar');
    keyword = keyword.toLowerCase();
    
    heroAvatars.forEach(avatar => {
        const heroName = avatar.querySelector('.hero-name-overlay h3').textContent.toLowerCase();
        if (heroName.includes(keyword)) {
            avatar.style.display = 'block';
        } else {
            avatar.style.display = 'none';
        }
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    init();
    
    // 获取按钮元素
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const scrollToBottomBtn = document.getElementById('scrollToBottom');
    const voiceList = document.getElementById('modalVoiceList');
    
    // 回到顶部按钮点击事件
    scrollToTopBtn.addEventListener('click', function() {
        voiceList.scrollTop = 0;
    });
    
    // 去到底部按钮点击事件
    scrollToBottomBtn.addEventListener('click', function() {
        voiceList.scrollTop = voiceList.scrollHeight;
    });
    
    // 滚动监听，控制按钮显示/隐藏
    voiceList.addEventListener('scroll', function() {
        // 显示/隐藏回到顶部按钮
        if (voiceList.scrollTop > 100) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        
        // 显示/隐藏去到底部按钮
        const isAtBottom = voiceList.scrollHeight - voiceList.scrollTop - voiceList.clientHeight < 10;
        if (!isAtBottom) {
            scrollToBottomBtn.classList.add('visible');
        } else {
            scrollToBottomBtn.classList.remove('visible');
        }
    });
    
    // 初始化视差效果
    initParallaxEffects();
});
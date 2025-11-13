// Premiere Pro 脚本：显示感谢弹窗
if (app.isDocumentOpen()) {
    alert("感谢 免费分享的人", "测试脚本弹窗1");
} else {
    alert("请先打开一个项目！\n\n感谢 无私奉献的人", "测试脚本弹窗2");
}
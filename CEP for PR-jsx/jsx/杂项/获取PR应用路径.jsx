// 合并多个信息为一个弹窗显示
var info = "Premiere Pro 信息汇总\n\n";

info += "Premiere Pro 版本: " + app.version + "\n";
info += "构建号: " + parseInt(app.build) + "\n";
info += "用户偏好路径: " + app.getAppPrefPath + "\n";
info += "系统偏好路径: " + app.getAppSystemPrefPath + "\n";
info += "程序安装路径: " + app.path;

alert(info);
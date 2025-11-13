// 导入素材脚本
function importMedia() {
    try {
        // 选择导入方式
        var importType = prompt("请选择导入方式：\n1. 按文件夹导入\n2. 指定导入", "1");
        if (importType == null) {
            alert("未选择导入方式！");
            return;
        }

        var importedCount = 0; // 初始化导入文件数量计数器

        if (importType == "1") {
            // 按文件夹导入
            var folder = Folder.selectDialog("请选择要导入的素材文件夹");
            if (folder == null) {
                alert("未选择文件夹！");
                return;
            }

            // 获取文件夹中的所有文件
            var files = folder.getFiles();
            if (files.length == 0) {
                alert("文件夹中没有文件！");
                return;
            }

            // 导入文件到项目面板
            var project = app.project;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file instanceof File) {
                    project.importFiles([file.fsName]);
                    importedCount++; // 每导入一个文件，计数器加1
                }
            }

            alert("素材导入完成！共导入 " + importedCount + " 个文件。");
        } else if (importType == "2") {
            // 指定导入
            var files = File.openDialog("请选择要导入的文件", "All Files:*,*", true);
            if (files == null) {
                alert("未选择文件！");
                return;
            }

            // 导入文件到项目面板
            var project = app.project;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file instanceof File) {
                    project.importFiles([file.fsName]);
                    importedCount++; // 每导入一个文件，计数器加1
                }
            }

            alert("素材导入完成！共导入 " + importedCount + " 个文件。");
        } else {
            alert("无效的导入方式！");
            return;
        }

        // 询问是否进行素材归类
        var categorizeChoice = prompt("素材导入完成，请选择：\n1. 归类\n2. 不归类", "1");
        if (categorizeChoice === "1") {
            categorizeMedia();
        } else if (categorizeChoice === "2") {
            alert("不进行素材归类。");
        } else {
            alert("无效的选择！");
        }
    } catch (e) {
        $.writeln("导入过程中出现错误: " + e.toString());
    }
}

// 素材分类函数
function categorizeMedia() {
    try {
        var projectRoot = app.project.rootItem; // 获取项目根目录
        var projectItems = projectRoot.children; // 获取项目中的所有素材

        // 创建素材箱（如果不存在）
        var sequenceBin = findOrCreateBin("1_序列"); // 创建“序列”素材箱
        var videoBin = findOrCreateBin("2_视频素材");
        var audioBin = findOrCreateBin("4_音频素材");
        var imageBin = findOrCreateBin("3_图像素材");
        var compositionBin = findOrCreateBin("5_合成"); // 创建“合成”素材箱

        var categorizedCount = 0; // 记录分类的素材数量

        // 遍历项目中的所有素材，使用反向循环以避免删除元素时导致的索引问题
        for (var i = projectItems.numItems - 1; i >= 0; i--) {
            var item = projectItems[i];

            // 判断当前项目项是否为素材（CLIP），并且不是素材箱
            if (item.type === ProjectItemType.CLIP) {
                var filePath = item.getMediaPath(); // 获取素材的文件路径
                var fileExtension = "";

                // 检查是否有后缀
                if (filePath.lastIndexOf('.') !== -1) {
                    fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase(); // 从最后一个点开始截取扩展名
                }

                try {
                    // 检查是否为合成文件
                    if (fileExtension === "aep") {
                        item.moveBin(compositionBin); // 将合成文件移动到“合成”素材箱
                        categorizedCount++;
                    } else if (["mp4", "mov", "avi", "mkv"].indexOf(fileExtension) !== -1) {
                        // 如果是常见视频格式
                        item.moveBin(videoBin); // 将视频素材移动到“视频素材”箱
                        categorizedCount++;
                    } else if (["mp3", "wav", "aac"].indexOf(fileExtension) !== -1) {
                        // 如果是常见音频格式
                        item.moveBin(audioBin); // 将音频素材移动到“音频素材”箱
                        categorizedCount++;
                    } else if (["jpg", "png", "jpeg", "gif", "tiff"].indexOf(fileExtension) !== -1) {
                        // 如果是常见图片格式
                        item.moveBin(imageBin); // 将图像素材移动到“图像素材”箱
                        categorizedCount++;
                    } else if (fileExtension === "") {
                        // 如果没有后缀，将其移动到序列素材箱
                        item.moveBin(sequenceBin);
                        categorizedCount++;
                    }
                } catch (e) {
                    // 捕获并忽略错误
                    $.writeln("Error moving item: " + item.name + " - " + e.toString());
                }
            }
        }

        // 显示分类结果
        alert("素材分类完成！共分类了 " + categorizedCount + " 个素材。");
    } catch (e) {
        $.writeln("素材分类过程中出现错误: " + e.toString());
    }
}

// 查找或创建素材箱的函数
function findOrCreateBin(binName) {
    var root = app.project.rootItem; // 获取项目根目录

    // 遍历根项目，检查是否存在指定名称的素材箱
    for (var i = 0; i < root.children.numItems; i++) {
        var item = root.children[i];
        if (item.name === binName && item.type === ProjectItemType.BIN) {
            return item; // 如果找到素材箱，返回它
        }
    }

    // 如果素材箱不存在，创建一个新的素材箱
    var newBin = root.createBin(binName);
    return newBin; // 返回新创建的素材箱
}

// 运行函数
importMedia();
// Premiere Pro 脚本：统计时间线视频、音频片段数量（按轨道从上到下顺序 + 分隔线）
#target premierepro
(function () {
    'use strict';

    // 检查是否在 Premiere Pro 环境
    if (!app || !app.project) {
        alert("错误：请在 Adobe Premiere Pro 中运行此脚本！", "脚本错误");
        return;
    }

    var project = app.project;
    var activeSequence = project.activeSequence;

    // 检查是否有激活的序列
    if (!activeSequence) {
        alert("请先激活一个序列（双击时间线打开）！", "无序列");
        return;
    }

    var videoCount = 0;
    var audioCount = 0;

    // 构建调试信息（按从上到下顺序）
    var debugMsg = "调试信息：\n\n";

    // === 视频轨道：从最高轨道（numTracks-1）到最低（0） ===
    var videoTrackCount = activeSequence.videoTracks.numTracks;
    debugMsg += "视频轨道:\n";
    for (var vt = videoTrackCount - 1; vt >= 0; vt--) {
        var videoTrack = activeSequence.videoTracks[vt];
        var numClips = videoTrack.clips.numItems;
        var trackLabel = "视频轨道 " + (vt + 1);
        debugMsg += trackLabel + " 剪辑数： " + numClips + "\n";
        videoCount += numClips;
    }

    // 分隔线
    debugMsg += "-------------\n";

    // === 音频轨道：从最低（0）到最高（numTracks-1） ===
    var audioTrackCount = activeSequence.audioTracks.numTracks;
    debugMsg += "音频轨道:\n";
    for (var at = 0; at < audioTrackCount; at++) {
        var audioTrack = activeSequence.audioTracks[at];
        var numClips = audioTrack.clips.numItems;
        var trackLabel = "音频轨道 " + (at + 1);
        debugMsg += trackLabel + " 剪辑数： " + numClips + "\n";
        audioCount += numClips;
    }

    // 显示调试信息（轨道顺序正确）
    alert(debugMsg, "调试：轨道和剪辑信息");

    // 构建最终结果消息
    var sequenceName = activeSequence.name;
    var totalCount = videoCount + audioCount;
    var message = "时间线统计结果\n" +
                  "序列名称： " + sequenceName + "\n\n" +
                  "视频片段（含图片）： " + videoCount + " 个\n" +
                  "音频片段： " + audioCount + " 个\n\n" +
                  "总计： " + totalCount + " 个片段";

    // 弹窗显示最终结果
    alert(message, "时间线素材统计");
})();
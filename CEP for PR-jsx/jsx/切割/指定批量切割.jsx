// 已切割好的视频所在的轨道, videoTracks[0] 对应 V1 轨道
var sourceTrack = app.project.activeSequence.videoTracks[0];
var settings = app.project.activeSequence.getSettings();
var time = new Time();
app.enableQE();

// 需要被切割的目标轨道索引：V2, V3, V4 → 对应索引 1, 2, 3
var targetTrackIndices = [1, 2, 3];

// 遍历 V1 上所有剪辑（从第1个开始，因为第0个是起始点）
for (var i = 1; i < sourceTrack.clips.length; i++) {
    time = sourceTrack.clips[i].start;
    var timecode = time.getFormatted(settings.videoFrameRate, settings.videoDisplayFormat);

    // 对 V2、V3、V4 每个轨道都执行 razor 切割
    for (var t = 0; t < targetTrackIndices.length; t++) {
        var trackIndex = targetTrackIndices[t];
        var qeTrack = qe.project.getActiveSequence().getVideoTrackAt(trackIndex);
        
        // 安全检查：确保轨道存在且有媒体
        if (qeTrack && qeTrack.numItems > 0) {
            try {
                qeTrack.razor(timecode);
            } catch (e) {
                // 可选：记录错误，避免中断
                // $.writeln("Razor failed on track " + trackIndex + " at " + timecode);
            }
        }
    }
}
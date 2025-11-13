// 已切割好的视频所在的轨道, videoTracks[0] 对应 V1 轨道
var sourceTrack = app.project.activeSequence.videoTracks[0];
var settings   = app.project.activeSequence.getSettings();
var time       = new Time();

app.enableQE();                     // 开启 QE 引擎（razor 必须）

// ---------- 1. 动态读取所有高于 V1 的视频轨道 ----------
var videoTracks = app.project.activeSequence.videoTracks;   // 所有视频轨道数组
var targetTrackIndices = [];

for (var idx = 1; idx < videoTracks.numTracks; idx++) {     // 从 V2 开始（索引 1）
    // 只保留有媒体的轨道，防止对空轨道执行 razor 报错
    if (videoTracks[idx].clips.numItems > 0) {
        targetTrackIndices.push(idx);
    }
}

// ---------- 2. 遍历 V1 上所有剪辑（从第 1 个开始） ----------
for (var i = 1; i < sourceTrack.clips.numItems; i++) {      // 注意：numItems 而不是 length
    time = sourceTrack.clips[i].start;                     // 取剪辑的起点时间

    var timecode = time.getFormatted(
        settings.videoFrameRate,
        settings.videoDisplayFormat
    );

    // ---------- 3. 对每一条目标轨道执行 razor ----------
    for (var t = 0; t < targetTrackIndices.length; t++) {
        var trackIndex = targetTrackIndices[t];

        // QE 引擎中轨道索引从 0 开始，和 PPro 的 videoTracks 一致
        var qeTrack = qe.project.getActiveSequence().getVideoTrackAt(trackIndex);

        if (qeTrack && qeTrack.numItems > 0) {
            try {
                qeTrack.razor(timecode);   // 在该时间点切一刀
            } catch (e) {
                // 可选：静默处理，或取消注释下面一行记录错误
                // $.writeln("Razor failed on track " + trackIndex + " at " + timecode);
            }
        }
    }
}
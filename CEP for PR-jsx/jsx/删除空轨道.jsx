app.enableQE();
var qeSeqence = qe.project.getActiveSequence();
qeSeqence.removeEmptyVideoTracks();
qeSeqence.removeEmptyAudioTracks();
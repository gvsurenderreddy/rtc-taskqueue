var fs = require('fs');
var test = require('tape');
var sdp = {
  nodata: fs.readFileSync(__dirname + '/sdp/nodata.sdp', 'utf8'),
  all: fs.readFileSync(__dirname + '/sdp/video-audio-data.sdp', 'utf8')
};
var RTCPeerConnection = require('rtc-core/detect')('RTCPeerConnection');
var RTCSessionDescription = require('rtc-core/detect')('RTCSessionDescription');
var RTCIceCandidate = require('rtc-core/detect')('RTCIceCandidate');
var validateCandidate = require('rtc-validator/candidate');

var candidateData = {
  sdpMid: 'data',
  sdpMLineIndex: 2,
  candidate: 'candidate:1635139038 2 udp 2121998079 10.17.130.132 52524 typ host generation 0'
};

var pc;

test('can validate candidate', function(t) {
  t.plan(1);
  t.equal(validateCandidate(candidateData).length, 0, 'no errors');
});

test('can create a new peer connection', function(t) {
  t.plan(1);
  t.ok(pc = new RTCPeerConnection({ iceServers: [] }));
});

test('can set the remote description of the pc', function(t) {
  t.plan(1);
  pc.setRemoteDescription(
    new RTCSessionDescription({ type: 'offer', sdp: sdp.nodata }),
    t.pass,
    t.fail
  );
});

test('applying the bad ice candidate fails', function(t) {
  var candidate;

  t.plan(2);
  try {
    candidate = new RTCIceCandidate(candidateData);
    t.pass('created candidate');
    pc.addIceCandidate(candidate);
    t.fail('applied candidate');
  }
  catch (e) {
    t.pass('failed as expected');
  }
});

test('can create a new peer connection', function(t) {
  t.plan(1);
  t.ok(pc = new RTCPeerConnection({ iceServers: [] }));
});

test('can set the remote description of the pc', function(t) {
  t.plan(1);
  pc.setRemoteDescription(
    new RTCSessionDescription({ type: 'offer', sdp: sdp.all }),
    t.pass,
    t.fail
  );
});

test('applying the ice candidate succeeds', function(t) {
  var candidate;

  t.plan(2);
  try {
    candidate = new RTCIceCandidate(candidateData);
    t.pass('created candidate');

    pc.addIceCandidate(candidate);
    t.pass('added ice candidate');
  }
  catch (e) {
    t.fail(e);
  }
});
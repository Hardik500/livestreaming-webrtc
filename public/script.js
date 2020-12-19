const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

// VARIABLE DECLARATIONS

const main_left = document.querySelector(".main__left");
const main_right = document.querySelector(".main__right");
const chatBtn = document.querySelector("#chat")
const participantBtn = document.querySelector('#participants');
const main__videos = document.querySelector(".main__videos");
const mute_btn = document.querySelector('.main__mute_button');
const video_btn = document.querySelector('.main__video_button');
const chat_close = document.querySelector('.main__chat_close');
const video_player = document.querySelector(".video__player > iframe");
const zoom_in = document.querySelector(".zoom-in");
const zoom_out = document.querySelector(".zoom-out");

const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  mute_btn.innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  mute_btn.innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  video_btn.innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  video_btn.innerHTML = html;
}

const hideUnhideChat = () => {
  const showChat = `
  <i class="stop fas fa-comment-alt"></i>
    <span>Show Chat</span>
  `

  const hideChat = `
  <i class="fas fa-comment-alt"></i>
    <span>Hide Chat</span>
  `

  if (main_right.classList.contains("main__right_show")) {
    main_right.classList.remove("main__right_show")
    main_right.classList.add("main__right_hide")
    chatBtn.innerHTML = showChat;
  }
  else {
    main_right.classList.remove("main__right_hide")
    main_right.classList.add("main__right_show")
    chatBtn.innerHTML = hideChat;
  }

  if (window.matchMedia('screen and (max-width: 450px)').matches) {
    if (main_left.classList.contains("main__left_show")) {
      main_left.classList.remove("main__left_show")
      main_left.classList.add("main__left_hide")
    }
    else {
      main_left.classList.remove("main__left_hide")
      main_left.classList.add("main__left_show")
    }
  }
}

const hideUnhideParticipants = () => {
  const showParticipants = `
  <i class="stop fas fa-user-friends"></i>
    <span>Show Particpants</span>
  `

  const hideParticipants = `
  <i class="fas fa-user-friends"></i>
    <span>Hide Particpants</span>
  `

  if (main__videos.classList.contains("main__videos_show")) {
    main__videos.classList.remove("main__videos_show")
    main__videos.classList.add("main__videos_hide")
    participantBtn.innerHTML = showParticipants;
  }
  else {
    main__videos.classList.remove("main__videos_hide")
    main__videos.classList.add("main__videos_show")
    participantBtn.innerHTML = hideParticipants;
  }
}

chat_close.addEventListener("click", () => {
  hideUnhideChat();
})

if (window.matchMedia('screen and (max-width: 450px)').matches) {
  main_left.classList.remove("main__left_show")
  main_left.classList.add("main__left_hide")
  chatBtn.click();
}

let deg = 0;

zoom_in.addEventListener("click", () => {
  video_player.width = parseFloat(video_player.width) + 50;
  video_player.height = parseFloat(video_player.height) + 25;
})

zoom_out.addEventListener("click", () => {
  video_player.width = parseFloat(video_player.width) - 50;
  video_player.height = parseFloat(video_player.height) - 25;
})
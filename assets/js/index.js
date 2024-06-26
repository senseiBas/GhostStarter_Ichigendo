// Card_Gallery JS

(function() {
    const images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        const container = image.closest('.kg-gallery-image');
        const width = image.attributes.width.value;
        const height = image.attributes.height.value;
        const ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    })
})();

// toggle card
(function() {
    const toggleHeadingElements = document.getElementsByClassName("kg-toggle-heading");

    const toggleFn = function(event) {
        const targetElement = event.target;
        const parentElement = targetElement.closest('.kg-toggle-card');
        var toggleState = parentElement.getAttribute("data-kg-toggle-state");
        if (toggleState === 'close') {
            parentElement.setAttribute('data-kg-toggle-state', 'open');
        } else {
            parentElement.setAttribute('data-kg-toggle-state', 'close');
        }
    };

    for (let i = 0; i < toggleHeadingElements.length; i++) {
        toggleHeadingElements[i].addEventListener('click', toggleFn, false);
    }
})();

// video card
(function() {
    const handleVideoPlayer = function (videoElementContainer) {
        const videoPlayer = videoElementContainer.querySelector('.kg-video-player');
        const videoPlayerContainer = videoElementContainer.querySelector('.kg-video-player-container');
        const playIconContainer = videoElementContainer.querySelector('.kg-video-play-icon');
        const pauseIconContainer = videoElementContainer.querySelector('.kg-video-pause-icon');
        const seekSlider = videoElementContainer.querySelector('.kg-video-seek-slider');
        const playbackRateContainer = videoElementContainer.querySelector('.kg-video-playback-rate');
        const muteIconContainer = videoElementContainer.querySelector('.kg-video-mute-icon');
        const unmuteIconContainer = videoElementContainer.querySelector('.kg-video-unmute-icon');
        const volumeSlider = videoElementContainer.querySelector('.kg-video-volume-slider');
        const videoEl = videoElementContainer.querySelector('video');
        const durationContainer = videoElementContainer.querySelector('.kg-video-duration');
        const currentTimeContainer = videoElementContainer.querySelector('.kg-video-current-time');
        const largePlayIcon = videoElementContainer.querySelector('.kg-video-large-play-icon');
        const videoOverlay = videoElementContainer.querySelector('.kg-video-overlay');
        let playbackRates = [{
            rate: 0.75,
            label: '0.7×'
        }, {
            rate: 1.0,
            label: '1×'
        }, {
            rate: 1.25,
            label: '1.2×'
        }, {
            rate: 1.75,
            label: '1.7×'
        }, {
            rate: 2.0,
            label: '2×'
        }];

        let raf = null;
        let currentPlaybackRateIdx = 1;
        if (!!videoEl.loop) {
            largePlayIcon.classList.add("kg-video-hide-animated");
            videoOverlay.classList.add("kg-video-hide-animated");
        }
        const whilePlaying = () => {
            seekSlider.value = Math.floor(videoEl.currentTime);
            currentTimeContainer.textContent = calculateTime(seekSlider.value);
            videoPlayer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
            raf = requestAnimationFrame(whilePlaying);
        }

        const showRangeProgress = (rangeInput) => {
            if (rangeInput === seekSlider) {
                videoPlayer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
            }
            else {
                videoPlayer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
            }
        }

        const calculateTime = (secs) => {
            const minutes = Math.floor(secs / 60);
            const seconds = Math.floor(secs % 60);
            const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${minutes}:${returnedSeconds}`;
        }

        const displayDuration = () => {
            durationContainer.textContent = calculateTime(videoEl.duration);
        }

        const setSliderMax = () => {
            seekSlider.max = Math.floor(videoEl.duration);
        }

        const displayBufferedAmount = () => {
            if (videoEl.buffered.length > 0) {
                const bufferedAmount = Math.floor(videoEl.buffered.end(videoEl.buffered.length - 1));
                videoPlayer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
            }
        }

        if (videoEl.readyState > 0) {
            displayDuration();
            setSliderMax();
            displayBufferedAmount();
            if (videoEl.autoplay) {
                raf = requestAnimationFrame(whilePlaying);
                playIconContainer.classList.add("kg-video-hide");
                pauseIconContainer.classList.remove("kg-video-hide");
            }
            if (videoEl.muted) {
                unmuteIconContainer.classList.add("kg-video-hide");
                muteIconContainer.classList.remove("kg-video-hide");
            }
        } else {
            videoEl.addEventListener('loadedmetadata', () => {
                displayDuration();
                setSliderMax();
                displayBufferedAmount();
                if (videoEl.autoplay) {
                    raf = requestAnimationFrame(whilePlaying);
                    playIconContainer.classList.add("kg-video-hide");
                    pauseIconContainer.classList.remove("kg-video-hide");
                }
                if (videoEl.muted) {
                    unmuteIconContainer.classList.add("kg-video-hide");
                    muteIconContainer.classList.remove("kg-video-hide");
                }
            });
        }

        videoElementContainer.onmouseover = () => {
            if (!videoEl.loop) {
                videoPlayerContainer.classList.remove("kg-video-hide-animated");
            }
        }

        videoElementContainer.onmouseleave = () => {
            const isPlaying = !!(videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended && videoEl.readyState > 2);
            if (isPlaying) {
                videoPlayerContainer.classList.add("kg-video-hide-animated");
            }
        }

        videoElementContainer.addEventListener('click', () => {
            if (!videoEl.loop) {
                const isPlaying = !!(videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended && videoEl.readyState > 2);
                if (isPlaying) {
                    handleOnPause();
                } else {
                    handleOnPlay();
                }
            }
        });

        videoEl.onplay = () => {
            largePlayIcon.classList.add("kg-video-hide-animated");
            videoOverlay.classList.add("kg-video-hide-animated");
            playIconContainer.classList.add("kg-video-hide");
            pauseIconContainer.classList.remove("kg-video-hide");
        };

        const handleOnPlay = () => {
            largePlayIcon.classList.add("kg-video-hide-animated");
            videoOverlay.classList.add("kg-video-hide-animated");
            playIconContainer.classList.add("kg-video-hide");
            pauseIconContainer.classList.remove("kg-video-hide");
            videoEl.play();
            raf = requestAnimationFrame(whilePlaying);
        }

        const handleOnPause = () => {
            pauseIconContainer.classList.add("kg-video-hide");
            playIconContainer.classList.remove("kg-video-hide");
            videoEl.pause();
            cancelAnimationFrame(raf);
        }

        largePlayIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            handleOnPlay();
        });

        playIconContainer.addEventListener('click', (event) => {
            event.stopPropagation();
            handleOnPlay();
        });

        pauseIconContainer.addEventListener('click', (event) => {
            event.stopPropagation();
            handleOnPause();
        });

        muteIconContainer.addEventListener('click', (event) => {
            event.stopPropagation();
            muteIconContainer.classList.add("kg-video-hide");
            unmuteIconContainer.classList.remove("kg-video-hide");
            videoEl.muted = false;
        });

        unmuteIconContainer.addEventListener('click', (event) => {
            event.stopPropagation();
            unmuteIconContainer.classList.add("kg-video-hide");
            muteIconContainer.classList.remove("kg-video-hide");
            videoEl.muted = true;
        });

        playbackRateContainer.addEventListener('click', (event) => {
            event.stopPropagation();
            let nextPlaybackRate = playbackRates[(currentPlaybackRateIdx + 1) % 5];
            currentPlaybackRateIdx = currentPlaybackRateIdx + 1;
            videoEl.playbackRate = nextPlaybackRate.rate;
            playbackRateContainer.textContent = nextPlaybackRate.label;
        });

        videoEl.addEventListener('progress', displayBufferedAmount);

        seekSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            showRangeProgress(e.target);
            currentTimeContainer.textContent = calculateTime(seekSlider.value);
            if (!videoEl.paused) {
                cancelAnimationFrame(raf);
            }
        });

        seekSlider.addEventListener('change', (event) => {
            event.stopPropagation();
            videoEl.currentTime = seekSlider.value;
            if (!videoEl.paused) {
                requestAnimationFrame(whilePlaying);
            }
        });

        volumeSlider.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        seekSlider.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        volumeSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            const value = e.target.value;
            showRangeProgress(e.target);
            videoEl.volume = value / 100;
        });
    }

    const videoCardElements = document.querySelectorAll('.kg-video-card');

    for (let i = 0; i < videoCardElements.length; i++) {
        handleVideoPlayer(videoCardElements[i]);
    }
})();

// Audio JS
(function() {
    const handleAudioPlayer = function (audioElementContainer) {
        const audioPlayerContainer = audioElementContainer.querySelector('.kg-audio-player-container');
        const playIconContainer = audioElementContainer.querySelector('.kg-audio-play-icon');
        const pauseIconContainer = audioElementContainer.querySelector('.kg-audio-pause-icon');
        const seekSlider = audioElementContainer.querySelector('.kg-audio-seek-slider');
        const playbackRateContainer = audioElementContainer.querySelector('.kg-audio-playback-rate');
        const muteIconContainer = audioElementContainer.querySelector('.kg-audio-mute-icon');
        const unmuteIconContainer = audioElementContainer.querySelector('.kg-audio-unmute-icon');
        const volumeSlider = audioElementContainer.querySelector('.kg-audio-volume-slider');
        const audio = audioElementContainer.querySelector('audio');
        const durationContainer = audioElementContainer.querySelector('.kg-audio-duration');
        const currentTimeContainer = audioElementContainer.querySelector('.kg-audio-current-time');
        let playbackRates = [{
            rate: 0.75,
            label: '0.7×'
        }, {
            rate: 1.0,
            label: '1×'
        }, {
            rate: 1.25,
            label: '1.2×'
        }, {
            rate: 1.75,
            label: '1.7×'
        }, {
            rate: 2.0,
            label: '2×'
        }];

        let raf = null;
        let currentPlaybackRateIdx = 1;

        const whilePlaying = () => {
            seekSlider.value = Math.floor(audio.currentTime);
            currentTimeContainer.textContent = calculateTime(seekSlider.value);
            audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
            raf = requestAnimationFrame(whilePlaying);
        }

        const showRangeProgress = (rangeInput) => {
            if (rangeInput === seekSlider) {
                audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
            }
            else {
                audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
            }
        }

        const calculateTime = (secs) => {
            const minutes = Math.floor(secs / 60);
            const seconds = Math.floor(secs % 60);
            const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${minutes}:${returnedSeconds}`;
        }

        const displayDuration = () => {
            durationContainer.textContent = calculateTime(audio.duration);
        }

        const setSliderMax = () => {
            seekSlider.max = Math.floor(audio.duration);
        }

        const displayBufferedAmount = () => {
            if (audio.buffered.length > 0) {
                const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
                audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
            }
        }

        if (audio.readyState > 0) {
            displayDuration();
            setSliderMax();
            displayBufferedAmount();
        } else {
            audio.addEventListener('loadedmetadata', () => {
                displayDuration();
                setSliderMax();
                displayBufferedAmount();
            });
        }

        playIconContainer.addEventListener('click', () => {
            playIconContainer.classList.add("kg-audio-hide");
            pauseIconContainer.classList.remove("kg-audio-hide");
            audio.play();
            requestAnimationFrame(whilePlaying);
        });

        pauseIconContainer.addEventListener('click', () => {
            pauseIconContainer.classList.add("kg-audio-hide");
            playIconContainer.classList.remove("kg-audio-hide");
            audio.pause();
            cancelAnimationFrame(raf);
        });

        muteIconContainer.addEventListener('click', () => {
            muteIconContainer.classList.add("kg-audio-hide");
            unmuteIconContainer.classList.remove("kg-audio-hide");
            audio.muted = false;
        });

        unmuteIconContainer.addEventListener('click', () => {
            unmuteIconContainer.classList.add("kg-audio-hide");
            muteIconContainer.classList.remove("kg-audio-hide");
            audio.muted = true;
        });

        playbackRateContainer.addEventListener('click', () => {
            let nextPlaybackRate = playbackRates[(currentPlaybackRateIdx + 1) % 5];
            currentPlaybackRateIdx = currentPlaybackRateIdx + 1;
            audio.playbackRate = nextPlaybackRate.rate;
            playbackRateContainer.textContent = nextPlaybackRate.label;
        });

        audio.addEventListener('progress', displayBufferedAmount);

        seekSlider.addEventListener('input', (e) => {
            showRangeProgress(e.target);
            currentTimeContainer.textContent = calculateTime(seekSlider.value);
            if (!audio.paused) {
                cancelAnimationFrame(raf);
            }
        });

        seekSlider.addEventListener('change', () => {
            audio.currentTime = seekSlider.value;
            if (!audio.paused) {
                requestAnimationFrame(whilePlaying);
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            showRangeProgress(e.target);
            audio.volume = value / 100;
        });
    }

    const audioCardElements = document.querySelectorAll('.kg-audio-card');

    for (let i = 0; i < audioCardElements.length; i++) {
        handleAudioPlayer(audioCardElements[i]);
    }
})();
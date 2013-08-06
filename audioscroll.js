/*Copyright (c) 2013 Muhammad Resna Rizki Pratama

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
	
(function ($) {
	$.fn.audioscroll = function (arg) {
		
		/*		Properties		*/
		
		// Passing argument
		var	args	= $.extend(true, {
								source          : null,
								pauseOnIdle     : true,
								listenOnPlaying : true,
								onPrepared      : null,
								onPlaying       : null,
								onIdle          : null,
								onComplete      : null
							}, arg);

		var araa	= $.extend(true, {
			source : true
		});
		// Cache the window and document object
		var $window = $(window);
		var $page   = $(document);
		
		// Audio properties
		var	audio, audioLength;
		
		// Page detail properties
		var	pageHeight;
		
		// Seekbar properties for audio
		//var	seekBar, seekBarProgress, seekBarThumb;
		
		// Cache variable for updating scroll activity
		var updateRuntimeCC;
		
		/*		Methods		*/
		
		/**
		 * Create HTML5 audio elements and get the DOM elements for controlling the audio
		 */
		function buildAudioPlayer() {
			if(args.source === null) {
				return;
			}

			audio = $('<audio src="' + args.source + '" id="music" preload="auto" ></audio>').get(0);
			audio.addEventListener("loadedmetadata", function() {
				audioLength = audio.duration;
				if ( $.isFunction( args.onPrepared ) ) {
					args.onPrepared.call( this );
				}
				calcArea();
			});
		}
		
		/**
		 * Calculate website page's height for makes scrolling match with the music
		 */
		function calcArea() {
			pageHeight = $page.height() - $window.height();
		}
		
		function scrollPage(percentage) {
			var scrollToPos = pageHeight * (percentage / 100);
			window.scrollTo(0,scrollToPos);
		}

		/**
		 * Listen to played music and calculate music's seek position and scroll page, and run the function itself recursively
		 */
		function updateRuntime() {
			var curtime = audio.currentTime;
			
			var percentage = (curtime / audioLength) * 100;
			
			//console.log(percentage + ' ' + curtime + ' / ' + audioLength);
			
			scrollPage(percentage);
			
			if(args.listenOnPlaying === true) {
				onPlayingCall(percentage);
			}
			
			if(percentage === 100) {
				onCompleteCall();
				stopRuntime();
			} else {
				startRuntime();
			}
		}
		
		/**
		 * Start timeout function to updateRuntime for starting scroll
		 */
		function startRuntime() {
			updateRuntimeCC = setTimeout(function() { updateRuntime(); },1);
			//bindScrollSeek();
		}
		
		/**
		 * Clearing timeout id of updateRuntime for stopping scroll 
		 */
		function stopRuntime() {
			clearTimeout(updateRuntimeCC);
			//unBindScrollSeek();
		}
		
		/**
		 * Play the music and start scroll the page
		 */
		function play() {
			audio.play();
			startRuntime();
		}
		
		/**
		 * Pause the music and stop scrolling the page
		 */
		function pause() {
			audio.pause();
			stopRuntime();
		}
		
		/**
		 * Seek the music to certain position
		 * @param  {int} percentage The percentage of music position given
		 */
		function seek(percentage) {
			audio.currentTime = (percentage / 100) * audioLength;
		}
		
		/**
		 * Replay the music and start scrolling the page from top
		 */
		function replay() {
			audio.currentTime = 0;
			startRuntime();
		}
		
		/**
		 * Call onPlaying callback given when music playing and page scrolling
		 * @param  {int} percentage Percentage of played music and scrolled page
		 */
		function onPlayingCall(percentage) {
			if ( $.isFunction( args.onPlaying ) ) {
				args.onPlaying.call( this, percentage );
			}
		}
		
		/**
		 * Call onIdle callback given when the page have been unfocused
		 */
		function onIdleCall() {
			if ( $.isFunction( args.onIdle ) ) {
				args.onIdle.call( this );
			}
		}
		
		/**
		 * Call onComplete callback given when the music is complete played and scroll reachs 
		 */
		function onCompleteCall() {
			if ( $.isFunction( args.onComplete ) ) {
				args.onComplete.call( this );
			}
		}
		
		/**
		 * Set if runtime should call onPlaying callback
		 * @param {boolean} status Call onPlaying callback or not
		 */
		function setOnPlayingListener(status) {
			args.listenOnPlaying = status;
		}

		/*		Main		*/
		
		$window.resize(function() {
			calcArea();
		});
		
		if(args.pauseOnIdle === true) {
			$window.blur(function() {
				pause();
				onIdleCall();
			});
		}
		
		buildAudioPlayer();
		
		return {
			prepare              : buildAudioPlayer,
			play                 : play,
			pause                : pause,
			seek                 : seek,
			replay               : replay,
			setOnPlayingListener : setOnPlayingListener
        };
    };
})(jQuery);

var audioscroll = $.fn.audioscroll;
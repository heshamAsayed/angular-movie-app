import { Component, OnInit, Input, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-autoplay-videos',
  templateUrl: './autoplay-videos.html',
  styleUrls: ['./autoplay-videos.css'],
})
export class AutoplayVideos implements OnInit, OnDestroy {
  @Input() autoplay = true;
  @Input() muted = true;
  @Input() controls = false;

  videoPaths: string[] = [];
  selectedVideoNumbers: number[] = [];
  currentVideo!: HTMLVideoElement;
  nextVideo!: HTMLVideoElement;
  currentIndex = 0;
  isTransitioning = false;
  private rafId: number | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // ✅ Run initialization outside Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initializeVideos();
      }, 0);
    });
  }

  ngOnDestroy(): void {
    // ✅ Clean up resources
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.cleanupVideo(this.currentVideo);
    this.cleanupVideo(this.nextVideo);
  }

  /** Cleanup video element */
  private cleanupVideo(video: HTMLVideoElement) {
    if (!video) return;
    
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
  }

  /** Initialize video playback */
  private initializeVideos() {
    this.selectVideos();
    this.createVideoElements();
    this.startPlayback();
  }

  /** Randomly select 4 videos from available pool */
  private selectVideos() {
    const allNumbers = Array.from({ length: 19 }, (_, i) => i + 1);
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    this.selectedVideoNumbers = shuffled.slice(0, 4);
    this.videoPaths = this.selectedVideoNumbers.map(num => `assets/Movie (${num}).mp4`);
    console.log('Selected videos:', this.selectedVideoNumbers);
  }

  /** Create video elements and append to container */
  private createVideoElements() {
    const container = document.querySelector('.video-container');
    if (!container) return;

    this.currentVideo = this.createVideoElement();
    this.nextVideo = this.createVideoElement();

    container.appendChild(this.currentVideo);
    container.appendChild(this.nextVideo);
  }

  /** Create a single video element with proper styles */
  private createVideoElement(): HTMLVideoElement {
    const video = document.createElement('video');
    
    video.muted = this.muted;
    video.controls = this.controls;
    video.autoplay = false;
    video.playsInline = true;
    video.preload = 'auto';
    video.loop = false;
    
    Object.assign(video.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: '0',
      transition: 'opacity 0.3s ease-in-out',
      willChange: 'opacity',
      pointerEvents: 'none'
    });

    return video;
  }

  /** Start playback of first video and setup transitions */
  private startPlayback() {
    this.loadVideo(this.currentIndex, this.currentVideo, true);
    this.setupTransition();
  }

  /** Load a video into a video element */
  private loadVideo(index: number, videoElement: HTMLVideoElement, show: boolean = false) {
    const path = this.videoPaths[index];
    videoElement.src = path;

    if (show) {
      videoElement.load();
      const onCanPlay = () => {
        videoElement.removeEventListener('canplaythrough', onCanPlay);
        videoElement.style.opacity = '1';
        videoElement.play().catch(e => console.error('Play error:', e));
      };
      videoElement.addEventListener('canplaythrough', onCanPlay, { once: true, passive: true });
    }
  }

  /** Monitor video progress and handle transitions */
  private setupTransition() {
    let nextIndex = (this.currentIndex + 1) % this.videoPaths.length;
    let isNextVideoReady = false;
    let lastCheckTime = 0;

    const checkProgress = (timestamp: number) => {
      if (timestamp - lastCheckTime < 200) {
        this.rafId = requestAnimationFrame(checkProgress);
        return;
      }
      lastCheckTime = timestamp;

      if (!this.currentVideo || this.currentVideo.paused) {
        this.rafId = requestAnimationFrame(checkProgress);
        return;
      }

      const timeLeft = this.currentVideo.duration - this.currentVideo.currentTime;

      // Preload next video when 2 seconds left
      if (timeLeft <= 2 && timeLeft > 0 && !isNextVideoReady) {
        isNextVideoReady = true;
        this.loadVideo(nextIndex, this.nextVideo, false);
      }

      // Transition to next video
      if (timeLeft <= 0.1 && !this.isTransitioning) {
        this.performTransition(nextIndex, () => {
          nextIndex = (this.currentIndex + 1) % this.videoPaths.length;
          isNextVideoReady = false;
        });
      } else {
        this.rafId = requestAnimationFrame(checkProgress);
      }
    };

    this.rafId = requestAnimationFrame(checkProgress);
  }

  /** Perform smooth transition between videos */
  private performTransition(nextIndex: number, callback: () => void) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    requestAnimationFrame(() => {
      this.currentVideo.style.opacity = '0';
      this.nextVideo.style.opacity = '1';
      
      this.nextVideo.play().catch(e => console.error('Play error:', e));

      // Swap references
      const temp = this.currentVideo;
      this.currentVideo = this.nextVideo;
      this.nextVideo = temp;

      this.currentIndex = nextIndex;
      this.isTransitioning = false;

      callback();
      this.setupTransition();
    });
  }

  /** Reshuffle videos manually */
  reshuffleVideos() {
    this.ngZone.runOutsideAngular(() => {
      if (this.rafId) cancelAnimationFrame(this.rafId);

      this.cleanupVideo(this.currentVideo);
      this.cleanupVideo(this.nextVideo);

      const container = document.querySelector('.video-container');
      if (container) container.innerHTML = '';

      this.currentIndex = 0;
      this.isTransitioning = false;
      
      setTimeout(() => {
        this.initializeVideos();
      }, 0);
    });
  }
}

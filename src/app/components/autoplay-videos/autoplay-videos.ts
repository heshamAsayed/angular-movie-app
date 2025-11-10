import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-autoplay-videos',
  template: `<div class="video-container"></div>`,
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

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.selectRandomVideos();
      this.createVideoElements();
      if (this.autoplay) this.startPlayback();
    });
  }

  ngOnDestroy(): void {
    this.cleanupVideo(this.currentVideo);
    this.cleanupVideo(this.nextVideo);
  }

  private selectRandomVideos(): void {
    const allNumbers = Array.from({ length: 19 }, (_, i) => i + 1);
    for (let i = allNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }
    this.selectedVideoNumbers = allNumbers.slice(0, 4);
    this.videoPaths = this.selectedVideoNumbers.map(n => `assets/Movie (${n}).mp4`);
  }

  private createVideoElements(): void {
    const container = document.querySelector('.video-container');
    if (!container) return;

    this.currentVideo = this.createVideoElement();
    this.nextVideo = this.createVideoElement();

    container.appendChild(this.currentVideo);
    container.appendChild(this.nextVideo);
  }

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
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: 'none',
    });

    return video;
  }

  private startPlayback(): void {
    if (!this.videoPaths.length) return;

    this.currentVideo.src = this.videoPaths[this.currentIndex];
    this.currentVideo.load();
    this.currentVideo.play().catch(() => {});

    this.currentVideo.style.opacity = '1';

    this.currentVideo.addEventListener('ended', () => {
      this.transitionToNextVideo();
    }, { once: true });
  }

  private transitionToNextVideo(): void {
    const nextIndex = (this.currentIndex + 1) % this.videoPaths.length;

    this.nextVideo.src = this.videoPaths[nextIndex];
    this.nextVideo.load();
    this.nextVideo.play().catch(() => {});

    this.currentVideo.style.opacity = '0';
    this.nextVideo.style.opacity = '1';

    // Swap
    const temp = this.currentVideo;
    this.currentVideo = this.nextVideo;
    this.nextVideo = temp;
    this.currentIndex = nextIndex;

    // Continue loop
    this.currentVideo.addEventListener('ended', () => {
      this.transitionToNextVideo();
    }, { once: true });
  }

  private cleanupVideo(video: HTMLVideoElement): void {
    if (!video) return;
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
  }
}

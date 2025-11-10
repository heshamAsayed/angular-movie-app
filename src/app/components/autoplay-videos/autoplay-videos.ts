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
  private timeUpdateBound: any;
  private endedBound: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // تشغيل كل العمليات خارج Angular zone
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initializeVideos();
      }, 0);
    });
  }

  ngOnDestroy(): void {
    // تنظيف كل الموارد
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.cleanupVideo(this.currentVideo);
    this.cleanupVideo(this.nextVideo);
  }

  private cleanupVideo(video: HTMLVideoElement) {
    if (!video) return;
    
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
  }

  private initializeVideos() {
    this.selectVideos();
    this.createVideoElements();
    this.startPlayback();
  }

  selectVideos() {
    const allNumbers = Array.from({ length: 19 }, (_, i) => i + 1);
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    this.selectedVideoNumbers = shuffled.slice(0, 4);
    this.videoPaths = this.selectedVideoNumbers.map(num => `assets0/Movie (${num}).mp4`);
    console.log('Selected videos:', this.selectedVideoNumbers);
  }

  private createVideoElements() {
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
    
    // استخدام CSS للأداء الأفضل
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
      pointerEvents: 'none' // مهم جداً: منع الفيديو من اعتراض الأحداث
    });

    return video;
  }

  private startPlayback() {
    this.loadVideo(this.currentIndex, this.currentVideo, true);
    this.setupTransition();
  }

  private loadVideo(index: number, videoElement: HTMLVideoElement, show: boolean = false) {
    const path = this.videoPaths[index];
    
    // تحميل غير متزامن تماماً
    videoElement.src = path;
    
    if (show) {
      videoElement.load();
      
      const onCanPlay = () => {
        videoElement.removeEventListener('canplaythrough', onCanPlay);
        videoElement.style.opacity = '1';
        
        // تشغيل بدون انتظار
        videoElement.play().catch(e => {
          console.error('Play error:', e);
        });
      };

      videoElement.addEventListener('canplaythrough', onCanPlay, { once: true, passive: true });
    }
  }

  private setupTransition() {
    let nextIndex = (this.currentIndex + 1) % this.videoPaths.length;
    let isNextVideoReady = false;
    let lastCheckTime = 0;

    // استخدام requestAnimationFrame بدلاً من setInterval
    const checkProgress = (timestamp: number) => {
      // التحقق كل 200ms فقط لتقليل الحمل
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

      // تحميل الفيديو التالي
      if (timeLeft <= 2 && timeLeft > 0 && !isNextVideoReady) {
        isNextVideoReady = true;
        this.loadVideo(nextIndex, this.nextVideo, false);
      }

      // التحقق من الانتهاء
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

  private performTransition(nextIndex: number, callback: () => void) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // التبديل السلس
    requestAnimationFrame(() => {
      this.currentVideo.style.opacity = '0';
      this.nextVideo.style.opacity = '1';
      
      this.nextVideo.play().catch(e => {
        console.error('Play error:', e);
      });

      // تبديل المراجع
      const temp = this.currentVideo;
      this.currentVideo = this.nextVideo;
      this.nextVideo = temp;

      this.currentIndex = nextIndex;
      this.isTransitioning = false;

      callback();
      this.setupTransition();
    });
  }

  reshuffleVideos() {
    this.ngZone.runOutsideAngular(() => {
      // إيقاف كل العمليات
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }

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
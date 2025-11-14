import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.createObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private createObserver() {
    const options = {
      root: null,
      rootMargin: '50px', // Load images 50px before they enter viewport
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    const img = this.el.nativeElement.querySelector('img.lazy-image');
    
    if (img && img.getAttribute('data-src')) {
      const src = img.getAttribute('data-src');
      
      // Create a new image to preload
      const tempImg = new Image();
      
      tempImg.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        
        // Add fade-in animation
        img.style.animation = 'fadeIn 0.5s ease-in-out';
      };
      
      tempImg.onerror = () => {
        // Fallback image on error
        img.src = 'assets/images/placeholder.jpg';
        img.classList.add('loaded');
      };
      
      tempImg.src = src;
    }
  }
}

// Add this CSS to your global styles or component styles
/*
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
*/
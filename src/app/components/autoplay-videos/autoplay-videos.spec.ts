import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoplayVideos } from './autoplay-videos';

describe('AutoplayVideos', () => {
  let component: AutoplayVideos;
  let fixture: ComponentFixture<AutoplayVideos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoplayVideos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoplayVideos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

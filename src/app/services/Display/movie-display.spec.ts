import { TestBed } from '@angular/core/testing';

import { MovieDisplay } from './movie-display';

describe('MovieDisplay', () => {
  let service: MovieDisplay;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieDisplay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

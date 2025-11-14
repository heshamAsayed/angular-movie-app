import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMovies } from './group-movies';

describe('GroupMovies', () => {
  let component: GroupMovies;
  let fixture: ComponentFixture<GroupMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMovies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

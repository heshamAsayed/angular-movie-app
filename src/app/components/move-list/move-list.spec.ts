import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveList } from './move-list';

describe('MoveList', () => {
  let component: MoveList;
  let fixture: ComponentFixture<MoveList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

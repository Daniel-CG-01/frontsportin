import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoPlist } from './partido-plist';

describe('PartidoPlist', () => {
  let component: PartidoPlist;
  let fixture: ComponentFixture<PartidoPlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidoPlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidoPlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

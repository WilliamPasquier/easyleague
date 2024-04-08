import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerCardComponent } from './summoner-card.component';

describe('SummonerCardComponent', () => {
  let component: SummonerCardComponent;
  let fixture: ComponentFixture<SummonerCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummonerCardComponent]
    });
    fixture = TestBed.createComponent(SummonerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerSuggestionComponent } from './summoner-suggestion.component';

describe('SummonerSuggestionComponent', () => {
  let component: SummonerSuggestionComponent;
  let fixture: ComponentFixture<SummonerSuggestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummonerSuggestionComponent]
    });
    fixture = TestBed.createComponent(SummonerSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

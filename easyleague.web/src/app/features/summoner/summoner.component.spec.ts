import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerComponent } from './summoner.component';

describe('SummonerComponent', () => {
  let component: SummonerComponent;
  let fixture: ComponentFixture<SummonerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummonerComponent]
    });
    fixture = TestBed.createComponent(SummonerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

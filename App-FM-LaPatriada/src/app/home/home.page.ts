import {Component, OnInit} from '@angular/core';
import {AudioService} from './audio.service';

export interface StreamState {
  playing: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  volume: any;
  canplay: boolean;
  error: boolean;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  _streamPaused:boolean = true
  constructor(private mediaStreamClient: AudioService) {
  }

  ngOnInit() {
    this.mediaStreamClient.streamPause.subscribe(e=>{
      this._streamPaused = e
    })
  }

  streamStation() {
    if(this._streamPaused != true){
      this.mediaStreamClient.pauseStream()
    }else{
      this.mediaStreamClient.resumeStream()
    }
  }
}

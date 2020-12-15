import { Component } from '@angular/core';
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
export class HomePage {
  isPlay = false;
  constructor(private audioService: AudioService) {
    // this.openUrl('https://server.laradio.online/proxy/fm_la_ppatriada?mp=/stream');
    // this.openUrl('http://www.stweb.tv/clientes/lapatriada/');
    // this.openUrl('http://server4.stweb.tv:1935/lapatriada/live/playlist.m3u8');
  }

  openUrl(url){
    this.audioService.playStream(url).subscribe(algo => {
      console.log('algo: ', algo);
      // if (algo.type === 'error'){
      //   console.log('se cago');
      // }
    });

  }

  play() {
    this.openUrl('https://server.laradio.online/proxy/fm_la_patriada?mp=/stream');
    // this.openUrl('http://www.stweb.tv/clientes/lapatriada');
    // this.openUrl('http://server4.stweb.tv:1935/lapatriada/live/playlist.m3u8');
    this.audioService.play();
    this.isPlay = true;
  }

  stop() {
    this.audioService.stop();
    this.isPlay = false;
  }
}

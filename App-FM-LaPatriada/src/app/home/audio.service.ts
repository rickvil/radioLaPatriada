import {Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { Platform } from '@ionic/angular';
import {Media} from "@ionic-native/media/ngx";

export interface StreamState {
    playing: boolean;
    readableCurrentTime: string;
    readableDuration: string;
    duration: number | undefined;
    currentTime?: number | undefined;
    canplay: boolean;
    error: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private streamUrl = { streamHttp: 'https://server.laradio.online/proxy/fm_la_patriada?mp=/stream', streamPort:'http://listen.181fm.com:'}

    private notPlaying:boolean = false
    private mediaFile: any

    private uSubscriptions: Subscription
    private readonly httpSubscriptions: Subscription

    public streamPause: BehaviorSubject<boolean> = new BehaviorSubject(this.notPlaying)

    constructor(
        private http: HttpClient,
        private media: Media,
        private platform: Platform)
    {
        this.httpSubscriptions = new Subscription()
        this.uSubscriptions = new Subscription()
        this.streamPause.next(this.notPlaying)
        this.checkPlatform()
    }

    private checkPlatform(){
        if(this.platform.is('mobile')||this.platform.is('mobileweb')){
            delete this.media
            this.mediaFile = new Audio()

            this.checkMediaFile = ()=>{
                this.mediaFile.pause()
                this.mediaFile.currentTime = 0
            }

            this.setStreamSource = ()=>{
                this.mediaFile.src = this.streamUrl.streamHttp
            }
        }
    }

    private checkMediaFile(){
        if (this.mediaFile != undefined) {
            this.mediaFile.stop()
            this.mediaFile.release()
            this.mediaFile = null
        }
    }

    private setStreamSource(){
        this.mediaFile = this.media.create(this.streamUrl.streamHttp)
    }

    pauseStream() {
        this.mediaFile.pause()
        this.notPlaying = true
        this.streamPause.next(this.notPlaying)
    }

    resumeStream() {
        this.checkMediaFile()
        this.setStreamSource()
        this.die()
        this.uSubscriptions.add(this.httpSubscriptions)
        this.mediaFile.play()
        this.notPlaying = false
        this.streamPause.next(this.notPlaying)
    }


    private die() {
        this.uSubscriptions.unsubscribe();
    }
}

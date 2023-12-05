import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { pluck, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class WindowService {
    height$: Observable<number>;
    constructor() {
        const windowSize$ = new BehaviorSubject(getWindowSize());

        this.height$ = windowSize$.pipe(pluck('height'), distinctUntilChanged());

        fromEvent(window, 'resize').pipe(map(getWindowSize))
            .subscribe(windowSize$);
    }

}

function getWindowSize() {
    return {
        height: window.innerHeight
        //you can sense other parameters here
    };
};
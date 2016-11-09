
namespace pxsim {
    export class CPNeoPixelState {
        public NUM_PIXELS = 10;
        private neopixels: [number, number, number][] = [];
        private CPLAY_NEOPIXELPIN = 17;
        private brightness: number = 20;

        public setPixelColor(pixel: number, red: number, green: number, blue: number) {
            this.neopixels[pixel] = [red, green, blue];
        }

        public setBrightness(brightness: number) {
            this.brightness = brightness;
        }
        
        public getBrightness(): number{
            return this.brightness;
        }

        public getNeoPixels(): [number, number, number][] {
            return this.neopixels;
        }

        public rotate(offset: number = 1, reverse?: boolean) {
            for (let i = 0; i < offset; i++) {
                if(reverse)
                    this.neopixels.unshift(this.neopixels.pop());
                else
                    this.neopixels.push(this.neopixels.shift());
            }
        }

        public clearPixels() {
            this.neopixels = [];
        }
    }

    export class RedLEDState {
        on: boolean = false;
    }
}

namespace pxsim.light {

    function getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    export function redLED(value: boolean) {
        board().redLEDState.on = value;
        runtime.queueDisplayUpdate()
    }

    export function setPixelColor(pixel: number, rgb: number) {
        let state = board().neopixelState;
        if (pixel < 0
            || pixel >= state.NUM_PIXELS)
            return;
        state.setPixelColor(pixel, unpackR(rgb), unpackG(rgb), unpackB(rgb));
        runtime.queueDisplayUpdate()
    }

    export function setPixelColorRgb(pixel: number, red: number, green: number, blue: number) {
        let state = board().neopixelState;
        if (pixel < 0
            || pixel >= state.NUM_PIXELS)
            return;
        state.setPixelColor(pixel, red, green, blue);
        runtime.queueDisplayUpdate()
    }

    export function setStripPixelColorRgb(pixel: number, red: number, green: number, blue: number) {
        setPixelColorRgb(pixel, red, green, blue);
    }

    export function showStrip() {
        runtime.queueDisplayUpdate()
    }

    export function clearPixels() {
        let state = board().neopixelState;
        state.clearPixels();
        runtime.queueDisplayUpdate()
    }

    export function colorWheel(WheelPos: number): number {
        WheelPos = 255 - WheelPos;
        if (WheelPos < 85) {
            return packRGB(255 - WheelPos * 3, 0, WheelPos * 3);
        }
        if (WheelPos < 170) {
            WheelPos -= 85;
            return packRGB(0, WheelPos * 3, 255 - WheelPos * 3);
        }
        WheelPos -= 170;
        return packRGB(WheelPos * 3, 255 - WheelPos * 3, 0);
    }

    export function rgb(r: number, g: number, b: number): number {
        return packRGB(r, g, b);
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }
}
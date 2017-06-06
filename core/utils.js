import Palette from './Palette';
export class Color{ 
    constructor(){
        this.intensities = [400,500,600,700,800,900]
        this.colors = Object.keys(Palette);
        this.currentIntensity = 0;
        this.currentColor = 0;
        window.getNextColor = this.getNextColor = this.getNextColor.bind(this);
    }
    getNextColor(){
        if((this.currentColor + 1) === this.colors.length){
            this.currentColor = 0;
            if((this.currentIntensity + 1) < this.intensities.length)
                this.currentIntensity += 1;
            else
                return null;
        }
        return Palette[this.colors[this.currentColor++]][this.intensities[this.currentIntensity]];
    }
}
export default {
    Color
};

//% weight=5 color=#0fbc11 icon="\uf112" block="lcd"
namespace lcd {
    // lcd

    const AQM_ADDRESS = 0x3E
    const LCD_SIZE_X = 8
    const LCD_SIZE_Y = 2

    let initialized = false

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initAQM(): void {
        i2cwrite(AQM_ADDRESS, 0x00, 0x38);
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x39);// 拡張モード・コマンドへ
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x14);// 発振周波数
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x73);// コントラスト
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x56);// ブースタOFF。電圧3.3V
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x6C);// フォロワ・コントロール
        control.waitMicros(300000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x38);// ノーマル・モード・コマンドへ
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x0C);// ディスプレイON
        control.waitMicros(2000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x0C);//　画面クリア
        control.waitMicros(2000);
        initialized = true;
    }
    function lcdOut(y: number, text: string){
        let data = 0x80;
        if (y != 0) {
            data = 0xC0;
        }
        i2cwrite(AQM_ADDRESS, 0x00, data);
        control.waitMicros(1000);
        let str = text;
        for (let i = 0; i < LCD_SIZE_X; i++ ) {
//            if (text.charAt(i) == 0x00) return;
            i2cwrite(AQM_ADDRESS, 0x40, str.charAt(i));
            control.waitMicros(100);
        }

    }

    //  subcategory="LCD"
    //% blockId="show_string"
    //% block="show string %text"
    //% weight=80
    export function showString(text: string): void {
        if (!initialized) {
              initAQM();
        }

        lcdOut(0, text);
/*
        if ( text.lengrh() > LCD_SIZE_X ) {
            let str = text.substring(LCD_SIZE_X, text.lengrh());
            lcdOut(1, str);
        }
*/
    }
} 

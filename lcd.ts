//% weight=5 color=#00ffff icon="\uf110" block="lcd"
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
        i2cwrite(AQM_ADDRESS, 0x00, 0x01);//　画面クリア
        control.waitMicros(2000);
        initialized = true;
    }
    function lcdOutLine(y: number, text: string){
        let data = 0x80;
        if (y != 0) {
            data = 0xC0;
        }
        i2cwrite(AQM_ADDRESS, 0x00, data);
        control.waitMicros(1000);
        for (let i = 0; i < LCD_SIZE_X; i++ ) {
            if (i < text.length) {
                i2cwrite(AQM_ADDRESS, 0x40, text.charCodeAt(i));
            } else {
                i2cwrite(AQM_ADDRESS, 0x40, 0x20);
            }
            control.waitMicros(100);
        }

    }

    function lcdOut(x: number, y: number, text: string){
        let data = 0x80;
        if (y != 0) {
            data = 0xC0;
        }
        data |= x;
        i2cwrite(AQM_ADDRESS, 0x00, data);
        control.waitMicros(1000);
        for (let i = 0; i < text.length; i++ ) {
            i2cwrite(AQM_ADDRESS, 0x40, text.charCodeAt(i));
            control.waitMicros(100);
        }

    }

    //  subcategory="LCD"
    //% blockId="show_lines"
    //% block="show lines %text"
    //% weight=80
    export function showLiens(text: string): void {
        if (!initialized) {
              initAQM();
        }
        lcdOutLine(0, text);

        if ( text.length > LCD_SIZE_X ) {
            let str = text.substr(LCD_SIZE_X, text.length);
            lcdOutLine(1, str);
        } else {
            let str = '';
            lcdOutLine(1, str);
        }

    }

    //  subcategory="LCD"
    //% blockId="show_line_1"
    //% block="show line1 %text"
    //% weight=80
    export function showLine1(text: string): void {
        if (!initialized) {
              initAQM();
        }
        lcdOutLine(0, text);
    }

    //  subcategory="LCD"
    //% blockId="show_line_2"
    //% block="show line2 %text"
    //% weight=80
    export function showLine2(text: string): void {
        if (!initialized) {
              initAQM();
        }
        lcdOutLine(1, text);
    }

    //  subcategory="LCD"
    //% blockId="show_string"
    //% block="show x:0-8 %x|y:0-1 %y|string %text"
    //% weight=80
    //% x.min=0 x.max=7
    //% y.min=0 y.max=1
    export function showString(x: number, y: number, text: string): void {
        if (!initialized) {
              initAQM();
        }
        lcdOut(x, y, text);
    }

    //  subcategory="LCD"
    //% blockId="lcd_clear"
    //% block="LCD clear"
    //% weight=80
    export function lcdClear(): void {
        if (!initialized) {
              initAQM();
        }
        i2cwrite(AQM_ADDRESS, 0x00, 0x01);//　画面クリア
        control.waitMicros(2000);
    }
} 

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
        i2cwrite(AQM_ADDRESS, 0x00, 0x39);// �g�����[�h�E�R�}���h��
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x14);// ���U���g��
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x73);// �R���g���X�g
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x56);// �u�[�X�^OFF�B�d��3.3V
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x6C);// �t�H�����E�R���g���[��
        control.waitMicros(300000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x38);// �m�[�}���E���[�h�E�R�}���h��
        control.waitMicros(1000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x0C);// �f�B�X�v���CON
        control.waitMicros(2000);
        i2cwrite(AQM_ADDRESS, 0x00, 0x0C);//�@��ʃN���A
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
        for (let i = 0; i < LCD_SIZE_X; i++ ) {
            if (text.charCodeAt(i) == 0x00) return;
            if (i < text.length) {
                i2cwrite(AQM_ADDRESS, 0x40, text.charCodeAt(i));
            } else {
                i2cwrite(AQM_ADDRESS, 0x40, 0x20);
            }
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

        if ( text.length > LCD_SIZE_X ) {
            let str = text.substr(LCD_SIZE_X, text.length);
            lcdOut(1, str);
        }

    }

    //  subcategory="LCD"
    //% blockId="show_string_1"
    //% block="show line1 %text"
    //% weight=80
    export function showString1(text: string): void {
        if (!initialized) {
              initAQM();
        }
        lcdOut(0, text);
    }

    //  subcategory="LCD"
    //% blockId="show_string_2"
    //% block="show line2 %text"
    //% weight=80
    export function showString2(text: string): void {
        if (!initialized) {
              initAQM();
        }
        lcdOut(1, text);
    }
} 

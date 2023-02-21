'use strict';

class GeneratorIdHelper {
    async generate (length = 6) {
        if (length < 6 ) return {status: 'error', message: 'Minimum lengt 6'};
        if (length > 16 ) return {status: 'error', message: 'Maximum lengt 16'};

        let result             = '';
        const characters       = '08AABCDDEFGHI0123456789IJKLLMNNOOOFANI08AMELIAPQRSSSTUUVWXYZZabcdefghijklmnopqrstuvwxyz01234567890987654321qwertyuuiiooopaasssddfghjkllzfani08ameliazxcvbnnmMNBVCX0987654321ZLKJHGFDSAQWERTYUIOP08';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return {status: 'success', message: result};
    }
}

module.exports = new GeneratorIdHelper()
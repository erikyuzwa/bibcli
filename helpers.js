
export const get_filename_from_translation = (translation_code) => {
    switch (translation_code.toLowerCase()) {
        case 'amp':
            return 'amp.txt'
        case 'kjv':
            return 'kjv.txt'
        case 'nasb95':
            return 'nasb95.txt'
        case 'nkjv':
            return 'nkjv.txt'
        default:
            return ''
    }
}

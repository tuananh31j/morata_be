function removeAccents(str: string) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

export function convertString(str: string) {
    return removeAccents(str).replace(/\s+/g, '_').toLowerCase();
}

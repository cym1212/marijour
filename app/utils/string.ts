// 텍스트 마스킹 함수
export const maskText = (text: string) => {
    const firstChar = text.charAt(0);
    const lastChar = text.charAt(text.length - 1);
    const maskedMiddle = '*'.repeat(text.length - 2);
    return `${firstChar}${maskedMiddle}${lastChar}`;
};

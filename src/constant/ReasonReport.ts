export enum ReportReason {
    InappropriateContent = 'Nội dung không phù hợp:',
    Spam = 'Spam',
    OffensiveLanguage = 'Ngôn ngữ thô tục',
    Other = 'Lý do khác...',
    Harassment = 'Quấy rối',
    Misinformation = 'Thông tin sai lệch',
    advertisement = 'Quảng cáo',
}
export enum ReportStatus {
    UnderReview = 'Đang xem xét',
    ContentRemoved = 'Đã xóa nội dung vi phạm',
    NoViolation = 'Nội dung không vi phạm',
}

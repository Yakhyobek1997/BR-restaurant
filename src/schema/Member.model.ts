// Mongoose modulini import qilamiz va `Schema`ni olib kelamiz.
// `Schema` MongoDB ma'lumotlar bazasi strukturasini yaratishda ishlatiladi.
import mongoose, { Schema } from 'mongoose';

// Foydalanuvchi holati va turini aniqlash uchun `MemberStatus` va `MemberType` enumlarini import qilamiz.
import { MemberStatus, MemberType } from './../libs/enums/member.enum';

// Foydalanuvchi ma'lumotlarini aniqlovchi schema yaratamiz.
const memberSchema = new Schema({
    // MemberType: Foydalanuvchi turini belgilash uchun ishlatiladi.
    memberType: {
        type: String,
        enum: MemberType, 
        // Faqatgina `MemberType` enumidagi qiymatlar qabul qilinadi.
        default: MemberType.USER 
        // Standart qiymat `USER` qilib belgilangan.
    },

    // MemberStatus: Foydalanuvchi holati (Active yoki boshqa holatlar).
    memberStatus: {
        type: String,
        enum: MemberStatus, // Faqatgina `MemberStatus` enumidagi qiymatlar qabul qilinadi.
        default: MemberStatus.ACTIVE, // Standart qiymat `ACTIVE` qilib belgilangan.
        required: false // Holat berilmasa ham, mumkin.
    },

    // MemberNick: Foydalanuvchining unikal laqabi (nickname).
    memberNick: {
        type: String,
        index: { unique: true, sparse: true }, // Unikal bo'lishi kerak, lekin bo'sh qiymatga ham ruxsat etiladi.
        required: true // Bu ma'lumot majburiy.
    },

    // MemberPhone: Foydalanuvchining telefon raqami.
    memberPhone: {
        type: String,
        index: { unique: true, sparse: true }, // Unikal bo'lishi kerak, lekin bo'sh qiymatga ham ruxsat etiladi.
        required: true // Bu ma'lumot majburiy.
    },

    // MemberPassword: Foydalanuvchining paroli.
    memberPassword: {
        type: String,
        select: false, // So'rovda qaytarilmaydi (`select: false`).
        required: true // Bu ma'lumot majburiy.
    },

    // MemberAddress: Foydalanuvchining manzili.
    memberAddress: {
        type: String, // Majburiy emas.
    },
    
    // MemberDesc: Foydalanuvchi haqida qisqacha ma'lumot.
    memberDesc: {
        type: String, // Majburiy emas.
    },

    // MemberImage: Foydalanuvchining rasmi (rasm URL yoki yo'l).
    memberImage: {
        type: String, // Majburiy emas.
    },

    // MemberPoints: Foydalanuvchining ballari yoki ochkolari.
    memberPoints: {
        type: Number,
        default: 0, // Standart qiymat sifatida `0` belgilangan.
    },

}, { timestamps: true }); // `timestamps` qo'llanilgan. Bu "createdAt" va "updatedAt" ma'lumotlarini avtomatik qo'shib beradi.

// Schema asosida modelni yaratib, eksport qilamiz.
// MongoDB jadvallarni (`Member`) `memberSchema` asosida yaratadi.
export default mongoose.model('Member', memberSchema);

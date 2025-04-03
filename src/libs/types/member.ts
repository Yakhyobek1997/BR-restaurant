import { Session } from "express-session";
import {MemberStatus, MemberType } from "../enums/member.enum";
import { ObjectId } from 'mongoose' 
import mongoose from 'mongoose';
import { Request } from "express";


export interface Member {
    _id: mongoose.Types.ObjectId; // ObjectId
    memberType: MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword?: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }



export interface MemberInput {
    memberType?: MemberType
    memberStatus?: MemberStatus
    memberNick: string
    memberPhone: string
    memberPassword: string
    memberAddress?: string
    memberDesc?:string
    memberImage?:string
    memberPoints?:Number
}

// Foydalanuvchining tizimga kirish (login) ma'lumotlarini belgilovchi interfeys
export interface LoginInput {
    memberNick: string;
    // Foydalanuvchining taxallusi yoki foydalanuvchi nomi
    memberPassword: string;  
// Foydalanuvchining paroli
}

// Express.js so‘rov obyektini kengaytiruvchi interfeys
export interface AdminRequest extends Request {
    member: Member; 
    // Hozirgi foydalanuvchining ma'lumotlarini saqlovchi obyekt
    session: Session & { member: Member };
    file: Express.Multer.File
    files: Express.Multer.File[]
}

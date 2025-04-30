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

// Restaurant controllerdna logindan keldik
// bu yerda ikta sharti bor memberNick,memberPassword
export interface LoginInput {
    memberNick: string;
    memberPassword: string;  
}
// Object malumotni ozi
// interface uni soyasi


export interface MemberUpdateInput {
    // _id: mongoose.Types.ObjectId; // ObjectId
    _id: ObjectId; // ObjectId
    memberStatus?: MemberStatus
    memberNick?: string
    memberPhone?: string
    memberPassword?: string
    memberAddress?: string
    memberDesc?:string
    memberImage?:string
}

export interface ExtendedRequest extends Request {
    member: Member; 
    file: Express.Multer.File
    files: Express.Multer.File[]
}



// Express.js so‘rov obyektini kengaytiruvchi interfeys
export interface AdminRequest extends Request {
    member: Member; 
    // Hozirgi foydalanuvchining ma'lumotlarini saqlovchi obyekt
    session: Session & { member: Member };
    file: Express.Multer.File
    files: Express.Multer.File[]
}

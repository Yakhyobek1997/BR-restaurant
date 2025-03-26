import {MemberStatus, MemberType } from "../enums/member.enum";
import { ObjectId } from 'mongoose' 
import mongoose from 'mongoose';

export interface Member {
    _id: mongoose.Types.ObjectId; // ObjectId dan foydalaning
    memberType: MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword?: string; // optional qilish kerak delete uchun
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

export interface LoginInput {
    memberNick: string
    memberPassword: string
}
import {Message} from '@/model/User.model'

export interface ApiResponse{
        message: string,
        success:boolean,
        isAcceptingMessage?:boolean,
        messages?:Array<Message>
}


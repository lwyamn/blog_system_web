const email = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const phone = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
export function verifyUsername(username:string){
    if(email.test(username)===true){
        return "email";
    }else if(phone.test(username)===true){
      return "phone";
    }else{
      return "username";
    }
}
export function verifyUserType(userType:number){
    switch(userType){
        case 1 :return {
            color:'red',
            userType:'管理员'
        };
        case 2 :return{
            color:'pink',
            userType:'普通用户'
        };
        case 0 :return{
            color:'blue',
            userType:'游客'
        }
        default:return{
            color:'purple',
            userType:'未知'
        };
    }
}
export function verifyCommentType(commentType:string){
    switch(commentType){
        case 'GENERAL' :return {
            color:'orange',
            commentType:'普通评论'
        };
        case 'ADMINISTRATOR' :return{
            color:'red',
            commentType:'管理员评论'
        };
        case 'REPLY' :return{
            color:'green',
            commentType:'回复'
        };
        default:return{
            color:'purple',
            userType:'未知'
        };
    }
}
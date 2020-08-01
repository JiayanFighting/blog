package com.jiayan.blog.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDO {
    public static final int USER_TYPE_ADMIN = 1;
    public static final int USER_TYPE_NORMAL = 2;
//    public static final int USER_TYPE_SUPER_ADMIN = 3;
    public static final int USER_STATUS_NORMAL = 0;
    public static final int USER_STATUS_DELETED = 1;

    //primary key
    private String email;
    private String username;
    private String avatar;
    private int type;
    private int statusCode;

    public UserDO(String email,String username){
        this.email = email;
        this.username = username;
    }
}

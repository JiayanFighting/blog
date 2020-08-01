package com.jiayan.blog.service.Impl;

import com.jiayan.blog.dao.UserMapper;
import com.jiayan.blog.domain.UserDO;
import com.jiayan.blog.service.LoginService;
import com.jiayan.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    UserService userService;

    @Override
    public UserDO login(String email,String username) {
        if (inWhitelist(email) || userService.isSuperAdmin(email)) {
            UserDO user = userMapper.findByEmail(email);
            if (user != null && user.getEmail().equals(email) && user.getStatusCode() ==  UserDO.USER_STATUS_NORMAL){
                return user;
            }else {
                saveUser(new UserDO(email,username));
                if (userService.isSuperAdmin(email)){
                    userMapper.updateUserType(email,UserDO.USER_TYPE_ADMIN);
                }
                return new UserDO(email,username,"",UserDO.USER_TYPE_NORMAL,0);
            }
        }
        return new UserDO(email,username,"",-1,0);
    }

    @Override
    public void saveUser(UserDO user) {
        userMapper.saveUser(user);
    }

    @Override
    public boolean inWhitelist(String email) {
        return userMapper.inWhitelist(email) > 0;
    }
}

package com.jiayan.blog.service;

import com.jiayan.blog.domain.UserDO;

public interface LoginService {

    UserDO login(String email,String username);

    void saveUser(UserDO user);

    boolean inWhitelist(String email);
}

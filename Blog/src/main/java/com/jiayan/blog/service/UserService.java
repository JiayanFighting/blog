package com.jiayan.blog.service;

import com.jiayan.blog.domain.UserDO;

import java.util.List;

public interface UserService {

    public static final String[] SUPER_ADMIN = {"jiayan.huang@dchdc.net"};

    List<UserDO> search(String content);

    UserDO findByEmail(String email);

    int updateAvatar(String email, String avatar);

    int addWhitelist(String email);

    int deleteWhitelist(String email);

    List<UserDO> getAllWhitelist();

    int setAdmin(String email);

    int cancelAdmin(String email);

    boolean isSuperAdmin(String email);
}

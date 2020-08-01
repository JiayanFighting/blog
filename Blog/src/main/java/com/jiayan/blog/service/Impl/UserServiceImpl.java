package com.jiayan.blog.service.Impl;

import com.jiayan.blog.dao.UserMapper;
import com.jiayan.blog.domain.UserDO;
import com.jiayan.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper userMapper;

    @Override
    public List<UserDO> search(String content) {
        return userMapper.search(content);
    }

    @Override
    public UserDO findByEmail(String email) {
        return userMapper.findByEmail(email);
    }

    @Override
    public int updateAvatar(String email, String avatar) {
        return userMapper.updateAvatar(email,avatar);
    }

    @Override
    public int addWhitelist(String email) {
        return userMapper.addWhitelist(email);
    }

    @Override
    public int deleteWhitelist(String email) {
        userMapper.deleteUser(email);
        return userMapper.deleteWhitelist(email);
    }

    @Override
    public List<UserDO> getAllWhitelist() {
        return userMapper.getAllWhitelist();
    }

    @Override
    public int setAdmin(String email) {
        return userMapper.updateUserType(email,UserDO.USER_TYPE_ADMIN);
    }

    @Override
    public int cancelAdmin(String email) {
        return userMapper.updateUserType(email,UserDO.USER_TYPE_NORMAL);
    }

    @Override
    public boolean isSuperAdmin(String email) {
        for (String admin:SUPER_ADMIN){
            if (admin.equals(email)){
                return true;
            }
        }
        return false;
    }
}

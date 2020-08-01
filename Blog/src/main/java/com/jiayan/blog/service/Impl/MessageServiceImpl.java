package com.jiayan.blog.service.Impl;

import com.jiayan.blog.dao.MessageMapper;
import com.jiayan.blog.domain.MessageDO;
import com.jiayan.blog.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageMapper messageMapper;

    @Override
    public int readMessage(int id) {
        return messageMapper.readMessage(id);
    }

    @Override
    public int deleteMessage(int id) {
        return messageMapper.deleteMessage(id);
    }


    @Override
    public int createMessage(MessageDO messageDO) {
        return messageMapper.createMessage(messageDO);
    }

    @Override
    public MessageDO getMessage(int id) {
        return messageMapper.getMessage(id);
    }

    @Override
    public List<MessageDO> getMessageList(String userEmail) {
        return messageMapper.getMessageList(userEmail);
    }
}
